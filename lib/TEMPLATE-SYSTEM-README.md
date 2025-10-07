# Email Template Management System

This document describes the template management system for the email builder application.

## Overview

The template management system allows users to:
- Import existing React Email templates from the `emails/` directory
- Save custom templates created in the editor
- Load previously saved templates
- Duplicate, update, and delete templates
- List all available templates

## Architecture

### Storage

Templates are stored as JSON files in the `templates/` directory at the project root. Each template file contains:
- **Metadata**: ID, name, description, category, timestamps
- **Blocks**: Array of EmailBlock objects representing the email structure

### File Structure

```
/templates/                      # Templates storage (auto-created)
  ├── notion-magic-link.json     # Saved template
  ├── stripe-welcome.json        # Saved template
  └── my-custom-template.json    # User-created template

/emails/                         # React Email templates (existing)
  ├── notion-magic-link.tsx      # Source templates
  ├── stripe-welcome.tsx
  └── ...

/lib/
  ├── email-templates.ts         # Core template utilities
  └── hooks/
      └── use-templates.ts       # React hook for client-side

/app/api/templates/              # REST API endpoints
  ├── route.ts                   # GET, POST /api/templates
  ├── [id]/
  │   ├── route.ts              # GET, PUT, DELETE /api/templates/:id
  │   └── duplicate/
  │       └── route.ts          # POST /api/templates/:id/duplicate
  └── import/
      └── route.ts              # GET, POST /api/templates/import
```

## Core Functions

### `lib/email-templates.ts`

#### Template Storage

**`saveTemplate(name, blocks, options?)`**
- Saves a template to the filesystem
- Auto-generates ID from name (slugified)
- Preserves creation date for existing templates
- Returns: `EmailTemplate`

**`loadTemplate(id)`**
- Loads a template by ID
- Returns: `EmailTemplate | null`

**`deleteTemplate(id)`**
- Deletes a template by ID
- Returns: `boolean`

**`duplicateTemplate(sourceId, newName)`**
- Creates a copy of an existing template
- Returns: `EmailTemplate | null`

**`listTemplates()`**
- Lists all saved templates
- Returns: `TemplateMetadata[]`

#### React Email Import

**`listReactEmailTemplates()`**
- Lists available templates in `emails/` directory
- Returns: `string[]` (template names without extension)

**`importReactEmailTemplate(templateName)`**
- Parses a React Email template file
- Converts JSX components to EmailBlock objects
- Extracts: headings, text, buttons, images, dividers
- Returns: `EmailBlock[] | null`

**`importAndSaveReactEmailTemplate(templateName, customName?)`**
- Imports and immediately saves a React Email template
- Returns: `EmailTemplate | null`

**`getStarterTemplates()`**
- Returns all templates including auto-imported starters
- Automatically imports common templates if not present
- Returns: `TemplateMetadata[]`

## API Endpoints

### List Templates
```
GET /api/templates
Query: ?starters=true (optional, includes starter templates)

Response:
{
  "success": true,
  "templates": [
    {
      "id": "notion-magic-link",
      "name": "Notion Magic Link",
      "description": "...",
      "category": "imported",
      "createdAt": "2024-10-07T...",
      "updatedAt": "2024-10-07T..."
    }
  ]
}
```

### Get Template
```
GET /api/templates/:id

Response:
{
  "success": true,
  "template": {
    "metadata": { ... },
    "blocks": [ ... ]
  }
}
```

### Save Template
```
POST /api/templates
Body:
{
  "name": "My Template",
  "blocks": [ ... ],
  "description": "Optional description",
  "category": "custom"
}

Response:
{
  "success": true,
  "template": { ... }
}
```

### Update Template
```
PUT /api/templates/:id
Body:
{
  "name": "Updated Name",
  "blocks": [ ... ],
  "description": "...",
  "category": "..."
}

Response:
{
  "success": true,
  "template": { ... }
}
```

### Delete Template
```
DELETE /api/templates/:id

Response:
{
  "success": true,
  "message": "Template deleted successfully"
}
```

### Duplicate Template
```
POST /api/templates/:id/duplicate
Body:
{
  "name": "My Template Copy"
}

Response:
{
  "success": true,
  "template": { ... }
}
```

### List Importable Templates
```
GET /api/templates/import

Response:
{
  "success": true,
  "templates": [
    "notion-magic-link",
    "stripe-welcome",
    "vercel-invite-user",
    "plaid-verify-identity"
  ]
}
```

### Import Template
```
POST /api/templates/import
Body:
{
  "templateName": "notion-magic-link",
  "customName": "My Custom Name" // optional
}

Response:
{
  "success": true,
  "template": { ... }
}
```

## Client-Side Hook

### `useTemplates()`

A React hook that provides all template operations with loading and error states.

```typescript
import { useTemplates } from '@/lib/hooks/use-templates';

function MyComponent() {
  const {
    loading,
    error,
    listTemplates,
    loadTemplate,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    listImportableTemplates,
    importTemplate,
  } = useTemplates();

  // Example: Load all templates including starters
  const templates = await listTemplates(true);

  // Example: Load a specific template
  const template = await loadTemplate('my-template-id');

  // Example: Save current editor blocks
  await saveTemplate('My Template', blocks, {
    description: 'A custom template',
    category: 'custom'
  });

  // Example: Import from emails/ directory
  await importTemplate('notion-magic-link', 'My Magic Link');

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Your UI */}
    </div>
  );
}
```

## Usage Examples

### Example 1: Loading Starter Templates

```typescript
// In your component
const { listTemplates } = useTemplates();

useEffect(() => {
  async function loadStarters() {
    const templates = await listTemplates(true);
    setTemplateList(templates);
  }
  loadStarters();
}, []);
```

### Example 2: Saving Editor State

```typescript
// In your editor
const { blocks } = useEditor(); // Your editor context
const { saveTemplate } = useTemplates();

async function handleSave() {
  await saveTemplate('My Email', blocks, {
    description: 'Custom newsletter template',
    category: 'newsletter'
  });
}
```

### Example 3: Loading a Template into Editor

```typescript
const { loadTemplate } = useTemplates();
const { setBlocks } = useEditor();

async function handleLoadTemplate(id: string) {
  const template = await loadTemplate(id);
  if (template) {
    setBlocks(template.blocks);
  }
}
```

### Example 4: Importing from emails/ Directory

```typescript
const { listImportableTemplates, importTemplate } = useTemplates();

// List available templates
const available = await listImportableTemplates();
// ['notion-magic-link', 'stripe-welcome', ...]

// Import one
const template = await importTemplate('stripe-welcome');
// Now available via listTemplates()
```

## Template Format

### EmailTemplate Interface

```typescript
interface EmailTemplate {
  metadata: {
    id: string;              // Auto-generated slug
    name: string;            // Display name
    description?: string;    // Optional description
    category?: string;       // Optional category
    createdAt: string;       // ISO timestamp
    updatedAt: string;       // ISO timestamp
  };
  blocks: EmailBlock[];      // Array of blocks
}
```

### EmailBlock Interface

```typescript
interface EmailBlock {
  id: string;                      // Unique block ID
  type: EmailBlockType;            // "text" | "heading" | "button" | ...
  content?: string;                // Block content
  settings?: Record<string, any>;  // Block-specific settings
}
```

### Example Template JSON

```json
{
  "metadata": {
    "id": "welcome-email",
    "name": "Welcome Email",
    "description": "A friendly welcome email for new users",
    "category": "onboarding",
    "createdAt": "2024-10-07T12:00:00.000Z",
    "updatedAt": "2024-10-07T12:30:00.000Z"
  },
  "blocks": [
    {
      "id": "block-1",
      "type": "heading",
      "content": "Welcome to Our Platform!",
      "settings": {
        "align": "center",
        "color": "#333"
      }
    },
    {
      "id": "block-2",
      "type": "text",
      "content": "We're excited to have you here.",
      "settings": {}
    },
    {
      "id": "block-3",
      "type": "button",
      "content": "Get Started",
      "settings": {
        "url": "https://example.com/onboarding",
        "backgroundColor": "#0070f3",
        "color": "#ffffff"
      }
    }
  ]
}
```

## React Email Import Process

The importer uses regex patterns to extract common React Email components:

1. **Headings**: `<Heading>`, `<h1>` - `<h6>`
2. **Text**: `<Text>`, `<p>`
3. **Buttons**: `<Button>` with href
4. **Links styled as buttons**: `<Link>` with button styling
5. **Images**: `<Img>` with src and alt
6. **Dividers**: `<Hr>`, `<hr>`

### Limitations

- **Complex nesting**: Deeply nested components may not parse correctly
- **Dynamic content**: Props and variables are ignored (only literal strings)
- **Advanced layouts**: Multi-column layouts (Row/Column) simplified to single column
- **Custom components**: Only standard React Email components are recognized
- **Inline styles**: Style objects are extracted but may need adjustment

### Best Practices

1. Use the importer as a starting point, not final output
2. Review imported blocks and adjust settings as needed
3. Complex templates may need manual recreation
4. Consider creating templates directly in the editor for best results

## Future Improvements

### Planned Features

1. **Categories and Tags**
   - Better organization of templates
   - Filtering by category/tag

2. **Template Marketplace**
   - Share templates with community
   - Browse and install templates

3. **Version History**
   - Track template changes over time
   - Revert to previous versions

4. **Enhanced Import**
   - Better parsing of complex React Email templates
   - Support for more component types
   - Preserve more styling information

5. **Template Preview**
   - Generate thumbnail previews
   - Quick preview without loading

6. **Export Options**
   - Export as React Email component
   - Export as HTML file
   - Export as Markdown

7. **Search and Filter**
   - Full-text search across templates
   - Filter by category, date, etc.

8. **Cloud Storage**
   - Sync templates across devices
   - Backup and restore

### Current Limitations

1. **File System Storage**
   - Templates stored locally only
   - No cloud sync or collaboration
   - Limited to server filesystem

2. **Basic Parser**
   - Simple regex-based parsing
   - May miss complex structures
   - No AST analysis

3. **No Validation**
   - Blocks not validated before save
   - Could save invalid structures

4. **No Permissions**
   - No user authentication
   - Anyone can modify any template

5. **No Thumbnails**
   - No visual preview in list
   - Must load to see content

## Troubleshooting

### Templates Directory Not Found
The directory is auto-created on first save. Ensure write permissions.

### Import Fails
Check that the template file exists in `emails/` directory and is valid TSX.

### Template Not Loading
Verify the template ID is correct and the file is valid JSON.

### Blocks Not Rendering
Ensure blocks follow the EmailBlock interface and have valid types.

## Contributing

When adding new features:

1. Update TypeScript interfaces
2. Add API endpoint if needed
3. Update client hook
4. Add tests
5. Update this documentation
