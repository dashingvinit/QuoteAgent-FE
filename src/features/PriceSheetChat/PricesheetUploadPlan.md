# AI Quote System - Knowledge Graph Architecture

## System Overview

This document outlines the architecture for building a knowledge graph system that understands product relationships and dependencies for AI-powered quote generation.

## High-Level Architecture

```
User Upload → Chat API → MongoDB → Knowledge Graph API → Vector DB + Neo4j Knowledge Graph
```

## Data Flow

### Phase 1: Price Sheet Upload

1. **Schema fetched** from ComponentType DB based on selected component
2. **Chat API handles** price sheet upload using fetched schema
3. **MongoDB updated immediately** with product data
4. **Upload completion** returns success with batch identifier

### Phase 2: Knowledge Graph Construction (Separate API)

1. **Knowledge Graph API triggered** with batch identifier
2. **LLM analyzes product rules** from MongoDB batch
3. **LLM generates Cypher queries** to create/update Neo4j relationships
4. **AI discovers new relationships** during analysis
5. **New relationships stored** in relationship database for consistency
6. **Vector DB updated** with new embeddings

## Database Schema

### MongoDB Collections

#### Products Collection (Actual Schema)

```javascript
const ProductSchema = new Schema(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    componentTypeName: { type: String, required: true },
    attributes: { type: Map, of: Schema.Types.Mixed },
    processedForKG: {
      type: Boolean,
      default: false,
      index: true,
    }, // Identifier for knowledge graph processing
    kgBatchId: {
      type: String,
      index: true,
    }, // Batch identifier for bulk processing
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ orgId: 1, componentTypeName: 1 });
ProductSchema.index({ orgId: 1, processedForKG: 1 });
ProductSchema.index({ kgBatchId: 1 });
```

#### ComponentType Collection (Schema Provider)

```javascript
const AttributeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  dataType: { type: String, enum: ['String', 'Number', 'Boolean', 'Date', 'Array'], required: true },
  unit: { type: String, trim: true },
});

const ComponentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    attributes: [AttributeSchema],
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Index: unique component name per organization
ComponentSchema.index({ orgId: 1, name: 1 }, { unique: true });
```

#### RelationshipType Collection (Pattern Storage)

```javascript
const RelationshipSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Index: unique relationship name per organization
RelationshipSchema.index({ orgId: 1, name: 1 }, { unique: true });
```

### Neo4j Graph Schema

#### Node Types

- **Product** nodes with properties (id, name, type, attributes)
- **ComponentType** nodes (glass, frame, handle, etc.)
- **Rule** nodes for complex conditional logic

#### Relationship Types

- `COMPATIBLE_WITH` - Products that work together
- `REQUIRES` - Mandatory dependencies
- `EXCLUDES` - Incompatible products
- `APPLIES_TO` - Modifier applicability
- `BELONGS_TO` - Product belongs to component type

#### Example Graph Structure

```cypher
// Product relationships
(glass:Product {id: "G123"})-[:COMPATIBLE_WITH {conditions: "size:20-50sqft"}]->(frame:Product {id: "F456"})
(glass:Product)-[:REQUIRES]->(hardware:Product)
(modifier:Product)-[:APPLIES_TO {size_min: 20, size_max: 50}]->(glass:Product)

// Component type relationships
(glass:Product)-[:BELONGS_TO]->(glassType:ComponentType {name: "glass"})
```

## API Endpoints

### Schema & Upload APIs (Existing Chat API)

```javascript
// Get schema for price sheet upload
GET /api/component-types/{componentName}/schema?orgId={orgId}
Response: {
  name: "glass",
  description: "Glass components for doors and windows",
  attributes: [
    {
      name: "glass_id",
      dataType: "String",
      unit: null
    },
    {
      name: "thickness",
      dataType: "String",
      unit: "mm"
    },
    {
      name: "price",
      dataType: "Number",
      unit: "USD"
    }
  ]
}

// Upload price sheet (existing chat API)
POST /api/chat/upload-price-sheet
{
  orgId: "org_id",
  componentName: "glass", // Changed from componentTypeName to match schema
  products: [...], // Validated against ComponentType attributes
  batchId: "batch_uuid_123"
}
```

### Knowledge Graph API (New API to Build)

```javascript
// Get available relationship types for organization
GET /api/knowledge-graph/relationship-types?orgId={orgId}
Response: {
  relationships: [
    {
      name: "COMPATIBLE_WITH",
      description: "Products that work together"
    },
    {
      name: "REQUIRES",
      description: "Mandatory dependencies"
    }
  ]
}

// Trigger knowledge graph update
POST /api/knowledge-graph/process
{
  orgId: "org_id",
  batchId: "batch_uuid_123", // Optional: process specific batch
  componentTypes: ["glass", "frame"], // Optional: limit to specific types
  forceReprocess: false // Optional: reprocess already processed products
}

// Get processing status
GET /api/knowledge-graph/status/{batchId}
Response: {
  batchId: "batch_uuid_123",
  status: "processing|completed|failed",
  totalProducts: 150,
  processedProducts: 75,
  relationshipsCreated: 230,
  errors: [...]
}

// Get knowledge graph stats
GET /api/knowledge-graph/stats?orgId={orgId}
Response: {
  totalProducts: 500,
  totalRelationships: 1200,
  componentTypes: ["glass", "frame", "handle"],
  relationshipTypes: ["COMPATIBLE_WITH", "REQUIRES", "EXCLUDES"],
  lastProcessed: "2024-08-28T15:30:00Z"
}
```

### Knowledge Graph Management APIs

```javascript
// Add new relationship type (AI tool)
POST /api/knowledge-graph/relationship-types
{
  orgId: "org_id",
  name: "SIZE_COMPATIBLE",
  description: "Products compatible within size ranges",
  cypherTemplate: "MATCH (a:Product) MATCH (b:Product) WHERE ... MERGE (a)-[:SIZE_COMPATIBLE {conditions: $conditions}]->(b)"
}

// Add discovered relationship (AI tool during processing)
POST /api/knowledge-graph/relationships
{
  orgId: "org_id",
  fromProductId: "product_id_123",
  toProductId: "product_id_456",
  relationshipType: "COMPATIBLE_WITH",
  conditions: {
    "size_range": "20-50",
    "material": "aluminum"
  },
  confidence: 0.85,
  source: "llm_analysis"
}
```

## LLM Integration

### Rule Analysis Prompt Template

```
Analyze the following product rules and generate Neo4j relationships:

Product: {product_name}
Rules: {rules_text}

Extract:
1. Compatible products/types
2. Required dependencies
3. Size/condition constraints
4. Exclusions

Generate Cypher queries to create these relationships in Neo4j.
```

### Relationship Discovery

- **LLM analyzes** product descriptions and rules
- **Generates Cypher queries** for relationship creation
- **Identifies new patterns** not in existing relationship database
- **Tools provided** to store new relationship patterns for consistency

## Processing Workflow

### Price Sheet Upload Workflow (Chat API)

```javascript
async function uploadPriceSheet(orgId, componentName, products) {
  // 1. Fetch schema from ComponentType collection
  const componentType = await ComponentType.findOne({
    orgId,
    name: componentName,
  });

  if (!componentType) {
    throw new Error(`Component type '${componentName}' not found for organization`);
  }

  // 2. Validate products against schema attributes
  const validatedProducts = validateAgainstAttributes(products, componentType.attributes);

  // 3. Generate batch ID
  const batchId = generateUUID();

  // 4. Save to MongoDB with batch identifier
  const savedProducts = await Product.insertMany(
    validatedProducts.map((product) => ({
      orgId,
      componentTypeName: componentName,
      attributes: new Map(Object.entries(product)), // Convert to Map as per schema
      processedForKG: false,
      kgBatchId: batchId,
    }))
  );

  return { success: true, batchId, productCount: savedProducts.length };
}

// Validation helper
function validateAgainstAttributes(products, attributeSchema) {
  return products.map((product) => {
    const validated = {};

    attributeSchema.forEach((attr) => {
      const value = product[attr.name];
      if (value !== undefined) {
        // Type validation based on dataType
        validated[attr.name] = validateDataType(value, attr.dataType, attr.unit);
      }
    });

    return validated;
  });
}
```

### Knowledge Graph Update Workflow (New API)

```javascript
async function processKnowledgeGraph(orgId, options = {}) {
  const { batchId, componentTypes, forceReprocess } = options;

  // 1. Query unprocessed products
  const query = {
    orgId,
    ...(batchId && { kgBatchId: batchId }),
    ...(componentTypes && { componentTypeName: { $in: componentTypes } }),
    ...(forceReprocess ? {} : { processedForKG: false }),
  };

  const products = await Product.find(query);

  // 2. Process products in batches
  for (const productBatch of chunkArray(products, 50)) {
    // 3. LLM analyzes rules and generates relationships
    const relationships = await llm.analyzeProductRules(productBatch);
    const cypherQueries = await llm.generateCypher(relationships);

    // 4. Execute Cypher queries in Neo4j
    await neo4j.executeQueries(cypherQueries);

    // 5. Update vector embeddings
    await updateVectorDB(productBatch);

    // 6. Mark as processed
    await Product.updateMany({ _id: { $in: productBatch.map((p) => p._id) } }, { processedForKG: true });
  }
}
```

## Relationship Database

### Pattern Storage

```json
{
  "pattern_id": "glass_frame_compatibility",
  "description": "Glass and frame compatibility rules",
  "conditions": {
    "glass_type": "tempered",
    "frame_material": "aluminum"
  },
  "cypher_template": "MATCH (g:Product {type:'glass', glass_type:'tempered'}) MATCH (f:Product {type:'frame', material:'aluminum'}) MERGE (g)-[:COMPATIBLE_WITH]->(f)",
  "confidence": 0.9,
  "last_used": "2024-08-28T15:30:00Z"
}
```

## Implementation Notes

### Performance Considerations

- **MongoDB** for fast operational updates (pricing, availability)
- **Neo4j** for complex relationship queries
- **Vector DB** for semantic product search
- **Async processing** to avoid blocking user uploads

### Data Consistency

- Product IDs consistent across all databases
- Relationship patterns stored for LLM consistency
- Background sync processes to handle conflicts

### Scalability

- Modular API design allows independent scaling
- Graph updates can be batched and processed async
- Vector embeddings updated incrementally

## Tools for AI Agent

### Relationship Management Tools

```javascript
// Tool: Add new relationship
addRelationship(fromProduct, toProduct, relationshipType, conditions, confidence);

// Tool: Update relationship pattern
updateRelationshipPattern(patternId, description, cypherTemplate, conditions);

// Tool: Validate relationship consistency
validateRelationships(productId, relationships);
```

## Implementation Phases

### Phase 1: Knowledge Graph API Foundation

1. **Build Knowledge Graph API** with batch processing endpoints
2. **Add processedForKG and kgBatchId** fields to Product schema
3. **Set up Neo4j connection** and basic relationship models
4. **Create processing status tracking**

### Phase 2: LLM Integration

1. **Rule analysis prompts** for extracting relationships
2. **Cypher query generation** from relationship analysis
3. **Relationship pattern storage** for consistency
4. **Error handling and validation**

### Phase 3: Vector DB Integration

1. **Product embedding generation** from attributes and relationships
2. **Batch vector updates** aligned with knowledge graph processing
3. **Embedding optimization** based on relationship context

### Phase 4: Monitoring & Optimization

1. **Processing metrics and dashboards**
2. **Relationship quality scoring**
3. **Performance optimization** for large product catalogs
4. **Incremental processing** for ongoing updates

## Success Metrics (Knowledge Graph Focus)

- **Processing Coverage:** % of products successfully processed for relationships
- **Relationship Discovery:** Number of relationships discovered per product batch
- **Processing Time:** Average time from batch trigger to completion
- **Accuracy Rate:** Manual validation of discovered relationships
- **Vector Alignment:** Consistency between graph relationships and vector similarities
