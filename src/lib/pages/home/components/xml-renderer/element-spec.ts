/** Narrow primitive set just for the XSD generator, not used at runtime */
export type PrimitiveAttr = 'string' | 'integer' | 'boolean' | 'date' | 'uri';

export interface AttributeSpec {
  type?: PrimitiveAttr; // default "string"
  required?: boolean; // default optional
}

export interface ChildSpec {
  min?: number; // default 0
  max?: number | 'unbounded'; // default 1
}

export interface ElementSpec {
  /** optional React component used for rendering */
  component?: React.ComponentType<
    { children?: React.ReactNode } & Record<string, unknown>
  >;
  /** attribute definitions */
  attrs?: Record<string, AttributeSpec>;
  /** which child tags are allowed + cardinality */
  children?: Record<string, ChildSpec>;
  /** mixed content (text + elements interleaved) */
  mixed?: boolean;
}

export type ComponentRegistry = Record<string, ElementSpec>;
