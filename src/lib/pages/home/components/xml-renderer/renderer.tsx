// XMLRenderer.tsx
import React, { useEffect, useState, useMemo } from 'react';
import type { ComponentRegistry } from './element-spec';

/**
 * Generate a random UUID for React keys
 */
const generateUniqueId = (): string => {
  // Use crypto.randomUUID if available (modern browsers)
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/* -------------------------------------------------------------------------- */
/*  Regex constants                                                           */
/* -------------------------------------------------------------------------- */

const TAG_REGEX = /<(\/?)([a-z_][\w.\-:]*)[^>]*?(\/?)>/gi;
const TAG_NAME_REGEX = /^([a-z_][\w.\-:]*)/i;
const KEBAB_CASE_REGEX = /-([a-z])/g;

/* -------------------------------------------------------------------------- */
/*  Public props                                                              */
/* -------------------------------------------------------------------------- */

export interface XMLRendererProps {
  /** Raw, possibly streaming XML fragment */
  content: string;
  /** The registry created by the user */
  registry: ComponentRegistry;
  /** Show raw XML if parse fails? */
  showRaw?: boolean;
  /** Extra classes for the raw / error block */
  rawClassNames?: string;
}

/* -------------------------------------------------------------------------- */
/*  Runtime helpers                                                           */
/* -------------------------------------------------------------------------- */

/** Build tag → component map once so rendering is fast */
const buildComponentMap = (registry: ComponentRegistry) =>
  Object.fromEntries(
    Object.entries(registry)
      .filter(([, spec]) => spec.component)
      .map(([tag, spec]) => [
        tag,
        spec.component as React.ComponentType<
          { children?: React.ReactNode } & Record<string, unknown>
        >,
      ]),
  );

/* Attribute names React aliases internally */
const HTML_ALIAS: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
};

/** kebab-case → camelCase */
const toCamel = (s: string) =>
  s.includes('-') ? s.replace(KEBAB_CASE_REGEX, (_, c) => c.toUpperCase()) : s;

/** Convert DOM attrs → props React understands */
const attrsToProps = (el: Element) => {
  const out: Record<string, string> = {};
  for (const { name, value } of Array.from(el.attributes)) {
    const key = name.includes(':') ? name : (HTML_ALIAS[name] ?? toCamel(name));
    out[key] = value;
  }
  return out;
};

/** Repair a truncated XML fragment — now also fixes an *open* tag at EOF */
const repairXML = (xml: string): string => {
  // Escape ampersands that aren't already part of a valid entity
  // Only replace & that aren't followed by a valid entity pattern
  const escapedXml = xml.replace(
    /&(?!(amp|lt|gt|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/g,
    '&amp;',
  );

  const open: Array<string> = [];
  const tagRE = TAG_REGEX;

  // 1. Scan all *complete* tags
  const matches: Array<RegExpExecArray> = [];
  let m: RegExpExecArray | null;
  m = tagRE.exec(escapedXml);
  while (m !== null) {
    matches.push(m);
    m = tagRE.exec(escapedXml);
  }

  for (const [, close, rawName, selfClose] of matches) {
    if (selfClose) {
      continue; // <br/> etc.
    }
    const name = rawName.toLowerCase();
    if (close) {
      if (open.at(-1) === name) {
        open.pop(); // match the stack
      }
    } else {
      open.push(name); // push opening tag
    }
  }

  // 2. Detect an *incomplete* opening tag at the end of the buffer
  const lastLt = escapedXml.lastIndexOf('<');
  const lastGt = escapedXml.lastIndexOf('>');
  let fixed = escapedXml;

  if (lastLt > lastGt) {
    // there is a dangling "< …"
    const partial = escapedXml.slice(lastLt + 1);
    const nameMatch = TAG_NAME_REGEX.exec(partial);
    if (nameMatch) {
      open.push(nameMatch[1].toLowerCase()); // treat it as just-opened
    }
    fixed += '>'; // close the start-tag itself
  }

  // 3. Close whatever remains on the stack
  return open.reduceRight((acc, n) => `${acc}</${n}>`, fixed);
};

const hasParseError = (doc: Document) =>
  doc.getElementsByTagName('parsererror').length > 0;

/** Recursively map DOM nodes → React */
const nodeToReact = (
  node: Node,
  componentMap: Record<
    string,
    React.ComponentType<
      { children?: React.ReactNode } & Record<string, unknown>
    >
  >,
  path: Array<string> = [],
): React.ReactNode => {
  if (node.nodeType === Node.TEXT_NODE) {
    const txt = node.textContent ?? '';
    return txt.trim() ? txt : ' ';
  }
  if (
    node.nodeType === Node.COMMENT_NODE ||
    node.nodeType === Node.DOCUMENT_TYPE_NODE
  ) {
    return null;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }
  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (tag === 'script' || tag === 'style') {
    return null; // simple XSS guard
  }

  const children = Array.from(el.childNodes)
    .map((c) => nodeToReact(c, componentMap, [...path, generateUniqueId()]))
    .filter(Boolean);

  const Cmp = componentMap[tag];
  return Cmp ? (
    <Cmp key={generateUniqueId()} {...attrsToProps(el)}>
      {children}
    </Cmp>
  ) : (
    children
  );
};

/* -------------------------------------------------------------------------- */
/*  Main renderer                                                             */
/* -------------------------------------------------------------------------- */

export const XMLRenderer: React.FC<XMLRendererProps> = ({
  content,
  registry,
  showRaw = false,
  rawClassNames = '',
}) => {
  const componentMap = useMemo(() => buildComponentMap(registry), [registry]);
  const [lastValidXml, setLastValidXml] = useState<Document | null>(null);
  const [showError, setShowError] = useState(false);

  // 1. Take current content, repair it, try to parse it, and if so set as valid xml
  useEffect(() => {
    const repaired = repairXML(content);
    const currentXml = new DOMParser().parseFromString(
      repaired,
      'application/xml',
    );
    if (!hasParseError(currentXml)) {
      setLastValidXml(currentXml);
    } else if (content.length > 0 && !lastValidXml) {
      setShowError(true);
    }
  }, [content]);

  if (showError) {
    return showRaw ? (
      <div className="xml-renderer">
        <pre className={rawClassNames}>{content}</pre>
      </div>
    ) : (
      <div className={`xml-renderer ${rawClassNames}`}>
        Invalid XML received
      </div>
    );
  }

  if (lastValidXml) {
    const rendered = React.Children.toArray(
      Array.from(lastValidXml.childNodes).map((node) => (
        <React.Fragment key={generateUniqueId()}>
          {nodeToReact(node, componentMap, [generateUniqueId()])}
        </React.Fragment>
      )),
    );
    return <div className="xml-renderer">{rendered}</div>;
  }
  return null;
};
