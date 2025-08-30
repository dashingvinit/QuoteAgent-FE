export interface Attribute {
  _id?: string;
  name: string;
  dataType: 'String' | 'Number' | 'Boolean' | 'Date';
  unit?: string;
}

export interface ComponentType {
  _id: string;
  name: string;
  description?: string;
  attributes: Attribute[];
}

export interface RelationshipType {
  _id: string;
  name: string;
  description?: string;
}

export interface Ontology {
  componentTypes: ComponentType[];
  relationshipTypes: RelationshipType[];
  components?: ComponentType[];
  relationships?: RelationshipType[];
}

export interface NewAttribute {
  name: string;
  dataType: 'String' | 'Number' | 'Boolean' | 'Date';
  unit: string;
}

export interface NewComponentType {
  name: string;
  description?: string;
}

export interface NewRelationshipType {
  name: string;
  description?: string;
}
