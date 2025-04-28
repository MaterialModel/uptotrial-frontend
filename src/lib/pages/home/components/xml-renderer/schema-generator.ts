// component-registry-to-xsd.ts
import type {
  ChildSpec,
  ComponentRegistry,
  ElementSpec,
  PrimitiveAttr,
} from './element-spec';

/* ------------------------------------------------------------------ */
/*  Primitive-type → xs:type map                                       */
/* ------------------------------------------------------------------ */
const xsType: Record<PrimitiveAttr, string> = {
  string: 'xs:string',
  integer: 'xs:integer',
  boolean: 'xs:boolean',
  date: 'xs:date',
  uri: 'xs:anyURI',
};

const getXsType = (type?: PrimitiveAttr): string => {
  return type ? xsType[type] : 'xs:string';
};

/* ------------------------------------------------------------------ */
/*  Small helpers (all arrows)                                         */
/* ------------------------------------------------------------------ */
const occurs = (min: number, max: number | 'unbounded') =>
  min === 0 && max === 1
    ? ''
    : ` minOccurs="${min}" maxOccurs="${max === 'unbounded' ? max : max}"`;

const mergeSpec = (
  base: ElementSpec | undefined,
  override?: ChildSpec,
): {
  component: ElementSpec['component'];
  attrs: NonNullable<ElementSpec['attrs']>;
  children: ElementSpec['children'];
  mixed: boolean;
  min: number;
  max: number | 'unbounded';
} => ({
  component: base?.component,
  attrs: base?.attrs ?? {},
  children: base?.children,
  mixed: base?.mixed ?? true,
  min: override?.min ?? 0,
  max: override?.max ?? 1,
});

/* ------------------------------------------------------------------ */
/*  Recursive emitter (arrow)                                          */
/* ------------------------------------------------------------------ */
const emitElement = (
  tag: string,
  spec: ElementSpec,
  registry: ComponentRegistry,
  indent = '  ',
  override?: ChildSpec,
): string => {
  const { attrs, children, mixed, min, max } = mergeSpec(spec, override);

  /* leaf: no attrs/children */
  if (!(children || Object.keys(attrs).length)) {
    return `${indent}<xs:element name="${tag}" type="xs:string"${occurs(
      min,
      max,
    )}/>\n`;
  }

  let out = `${indent}<xs:element name="${tag}"${occurs(min, max)}>\n`;
  out += `${indent}  <xs:complexType${mixed ? ' mixed="true"' : ''}>\n`;

  /* children */
  if (children) {
    out += `${indent}    <xs:sequence>\n`;
    for (const [childTag, card] of Object.entries(children)) {
      const childSpec = registry[childTag];
      if (!childSpec) {
        throw new Error(`Tag <${childTag}> not found in registry`);
      }
      out += emitElement(
        childTag,
        childSpec,
        registry,
        `${indent}      `,
        card,
      );
    }
    out += `${indent}    </xs:sequence>\n`;
  }

  /* attributes */
  for (const [attrName, attr] of Object.entries(attrs)) {
    const required = attr.required ? ' use="required"' : '';
    out += `${indent}    <xs:attribute name="${attrName}" type="${getXsType(
      attr.type,
    )}"${required}/>\n`;
  }

  out += `${indent}  </xs:complexType>\n${indent}</xs:element>\n`;
  return out;
};

/* ------------------------------------------------------------------ */
/*  Public arrow function                                              */
/* ------------------------------------------------------------------ */
export const componentRegistryToXsd = (
  registry: ComponentRegistry,
  rootTag = 'response',
): string => {
  if (!registry[rootTag]) {
    throw new Error(`Root tag <${rootTag}> missing in registry`);
  }

  const header =
    '<?xml version="1.0"?>\n' +
    '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"\n' +
    '           elementFormDefault="qualified">\n';

  const body = emitElement(rootTag, registry[rootTag], registry, '  ');
  return `${header}${body}</xs:schema>\n`;
};
