# Database Integration Plan: Drizzle ORM + SQLite

## Overview
This document outlines the plan to migrate from file-based storage to Drizzle ORM with SQLite for persisting email templates and integrating with the current state management system.

---

## Current State Analysis

### Current Storage System
- **Storage Method**: File-based (JSON files in `/templates` directory)
- **Current Functions**: `listTemplates()`, `loadTemplate()`, `saveTemplate()`, `deleteTemplate()`
- **Location**: `lib/email-templates.ts`

### Current API Routes
- `GET /api/templates` - List all templates
- `POST /api/templates` - Create new template
- `GET /api/templates/[id]` - Get template by ID
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

### Current State Management
- **Context**: `EditorContext` (contexts/editor-context.tsx)
- **State**:
  - `blocks: EmailBlock[]` - Current editor blocks
  - `selectedBlockId: string | null`
  - History management (undo/redo)
- **Operations**: addBlock, updateBlock, deleteBlock, duplicateBlock, moveBlock, etc.

### Data Structures
```typescript
interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content?: string;
  settings?: Record<string, unknown>;
}

interface TemplateMetadata {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplate {
  metadata: TemplateMetadata;
  blocks: EmailBlock[];
}
```

---

## Phase 1: Setup & Installation

### 1.1 Install Dependencies
```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

### 1.2 Project Structure
```
/ezero
├── lib/
│   ├── db/
│   │   ├── index.ts              # Database connection & client
│   │   ├── schema.ts             # Drizzle schema definitions
│   │   ├── queries.ts            # Database query functions
│   │   └── migrate.ts            # Migration utilities
│   ├── email-templates.ts        # Keep for backward compatibility initially
│   └── email-templates-db.ts     # New DB-based implementation
├── drizzle/
│   └── migrations/               # Auto-generated migrations
├── drizzle.config.ts             # Drizzle Kit configuration
└── sqlite.db                     # SQLite database file (gitignored)
```

---

## Phase 2: Database Schema Design

### 2.1 Schema Definition (`lib/db/schema.ts`)

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Templates table
export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  tags: text('tags'), // JSON array stored as text
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Blocks table (normalized)
export const blocks = sqliteTable('blocks', {
  id: text('id').primaryKey(),
  templateId: text('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // EmailBlockType
  content: text('content'),
  settings: text('settings'), // JSON stored as text
  order: integer('order').notNull().default(0), // For block ordering
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Optional: Version history table for undo/redo
export const templateVersions = sqliteTable('template_versions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  templateId: text('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'cascade' }),
  snapshot: text('snapshot').notNull(), // Full JSON snapshot
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Types
export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
export type Block = typeof blocks.$inferSelect;
export type NewBlock = typeof blocks.$inferInsert;
export type TemplateVersion = typeof templateVersions.$inferSelect;
```

### 2.2 Schema Design Decisions

**Option A: Normalized (Recommended)**
- Templates and Blocks in separate tables
- Better for large templates
- Efficient block updates
- Easier to query individual blocks
- Foreign key constraints ensure data integrity

**Option B: Denormalized**
- Store blocks as JSON in templates table
- Simpler queries
- Better for small datasets
- Matches current file structure

**Recommendation**: Use Option A (normalized) for scalability

---

## Phase 3: Database Configuration

### 3.1 Drizzle Config (`drizzle.config.ts`)
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'better-sqlite3',
  dbCredentials: {
    url: process.env.DATABASE_URL || './sqlite.db',
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

### 3.2 Database Client (`lib/db/index.ts`)
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database(process.env.DATABASE_URL || './sqlite.db');
export const db = drizzle(sqlite, { schema });

// For migrations
export { sqlite };
```

### 3.3 Environment Configuration
```env
# .env.local
DATABASE_URL=./sqlite.db
```

Add to `.gitignore`:
```
sqlite.db
sqlite.db-journal
```

---

## Phase 4: Database Query Layer

### 4.1 Core Queries (`lib/db/queries.ts`)

```typescript
import { eq, desc, sql } from 'drizzle-orm';
import { db } from './index';
import { templates, blocks, type Template, type Block } from './schema';
import type { EmailBlock, EmailTemplate, TemplateMetadata } from '@/types/email';

// Convert DB models to app types
export function dbTemplateToAppTemplate(
  template: Template,
  templateBlocks: Block[]
): EmailTemplate {
  return {
    metadata: {
      id: template.id,
      name: template.name,
      description: template.description || undefined,
      category: template.category || undefined,
      tags: template.tags ? JSON.parse(template.tags) : undefined,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    },
    blocks: templateBlocks
      .sort((a, b) => a.order - b.order)
      .map((block): EmailBlock => ({
        id: block.id,
        type: block.type as any,
        content: block.content || undefined,
        settings: block.settings ? JSON.parse(block.settings) : {},
      })),
  };
}

// List all templates
export async function listAllTemplates(): Promise<TemplateMetadata[]> {
  const results = await db
    .select()
    .from(templates)
    .orderBy(desc(templates.updatedAt));

  return results.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description || undefined,
    category: t.category || undefined,
    tags: t.tags ? JSON.parse(t.tags) : undefined,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));
}

// Get template by ID
export async function getTemplateById(id: string): Promise<EmailTemplate | null> {
  const [template] = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .limit(1);

  if (!template) return null;

  const templateBlocks = await db
    .select()
    .from(blocks)
    .where(eq(blocks.templateId, id))
    .orderBy(blocks.order);

  return dbTemplateToAppTemplate(template, templateBlocks);
}

// Create template
export async function createTemplate(
  template: EmailTemplate
): Promise<EmailTemplate> {
  await db.transaction(async (tx) => {
    // Insert template
    await tx.insert(templates).values({
      id: template.metadata.id,
      name: template.metadata.name,
      description: template.metadata.description,
      category: template.metadata.category,
      tags: template.metadata.tags ? JSON.stringify(template.metadata.tags) : null,
    });

    // Insert blocks
    if (template.blocks.length > 0) {
      await tx.insert(blocks).values(
        template.blocks.map((block, index) => ({
          id: block.id,
          templateId: template.metadata.id,
          type: block.type,
          content: block.content,
          settings: block.settings ? JSON.stringify(block.settings) : null,
          order: index,
        }))
      );
    }
  });

  return template;
}

// Update template
export async function updateTemplate(
  id: string,
  template: EmailTemplate
): Promise<EmailTemplate> {
  await db.transaction(async (tx) => {
    // Update template metadata
    await tx
      .update(templates)
      .set({
        name: template.metadata.name,
        description: template.metadata.description,
        category: template.metadata.category,
        tags: template.metadata.tags ? JSON.stringify(template.metadata.tags) : null,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id));

    // Delete old blocks
    await tx.delete(blocks).where(eq(blocks.templateId, id));

    // Insert new blocks
    if (template.blocks.length > 0) {
      await tx.insert(blocks).values(
        template.blocks.map((block, index) => ({
          id: block.id,
          templateId: id,
          type: block.type,
          content: block.content,
          settings: block.settings ? JSON.stringify(block.settings) : null,
          order: index,
        }))
      );
    }
  });

  return template;
}

// Delete template
export async function deleteTemplate(id: string): Promise<boolean> {
  const result = await db
    .delete(templates)
    .where(eq(templates.id, id))
    .returning();

  return result.length > 0;
}

// Duplicate template
export async function duplicateTemplate(
  sourceId: string,
  newName: string,
  newId: string
): Promise<EmailTemplate | null> {
  const source = await getTemplateById(sourceId);
  if (!source) return null;

  const newTemplate: EmailTemplate = {
    metadata: {
      ...source.metadata,
      id: newId,
      name: newName,
      description: `Duplicated from ${source.metadata.name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    blocks: source.blocks.map((block) => ({
      ...block,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })),
  };

  return createTemplate(newTemplate);
}
```

---

## Phase 5: Migration Strategy

### 5.1 Generate Initial Migration
```bash
npx drizzle-kit generate:sqlite
```

### 5.2 Run Migration
```bash
npx drizzle-kit push:sqlite
```

### 5.3 Data Migration Script (`lib/db/migrate-data.ts`)
```typescript
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { createTemplate } from './queries';
import type { EmailTemplate } from '@/types/email';

export async function migrateFileTemplates(): Promise<void> {
  const templatesDir = join(process.cwd(), 'templates');

  try {
    const files = await readdir(templatesDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    console.log(`Found ${jsonFiles.length} template files to migrate...`);

    for (const file of jsonFiles) {
      const content = await readFile(join(templatesDir, file), 'utf-8');
      const template: EmailTemplate = JSON.parse(content);

      try {
        await createTemplate(template);
        console.log(`✓ Migrated: ${template.metadata.name}`);
      } catch (error) {
        console.error(`✗ Failed to migrate ${file}:`, error);
      }
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run with: tsx lib/db/migrate-data.ts
if (require.main === module) {
  migrateFileTemplates();
}
```

---

## Phase 6: API Route Updates

### 6.1 Update Template Routes (`app/api/templates/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { listAllTemplates, createTemplate } from '@/lib/db/queries';
import type { EmailBlock } from '@/types/email';

export async function GET(request: NextRequest) {
  try {
    const templates = await listAllTemplates();

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, blocks, description, category, tags } = body;

    if (!name || !blocks || !Array.isArray(blocks)) {
      return NextResponse.json(
        { success: false, error: 'Name and blocks array are required' },
        { status: 400 }
      );
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const template = await createTemplate({
      metadata: {
        id,
        name,
        description,
        category,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      blocks: blocks as EmailBlock[],
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save template' },
      { status: 500 }
    );
  }
}
```

### 6.2 Update Individual Template Routes (`app/api/templates/[id]/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
  getTemplateById,
  updateTemplate,
  deleteTemplate as deleteTemplateById,
} from '@/lib/db/queries';
import type { EmailBlock } from '@/types/email';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await getTemplateById(id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error loading template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, blocks, description, category, tags } = body;

    if (!name || !blocks || !Array.isArray(blocks)) {
      return NextResponse.json(
        { success: false, error: 'Name and blocks array are required' },
        { status: 400 }
      );
    }

    const existing = await getTemplateById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = await updateTemplate(id, {
      metadata: {
        id,
        name,
        description,
        category,
        tags,
        createdAt: existing.metadata.createdAt,
        updatedAt: new Date().toISOString(),
      },
      blocks: blocks as EmailBlock[],
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteTemplateById(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
```

---

## Phase 7: State Management Integration

### 7.1 Auto-save Strategy

**Option A: Debounced Auto-save**
```typescript
// In EditorContext
const [templateId, setTemplateId] = useState<string | null>(null);
const [isSaving, setIsSaving] = useState(false);
const [lastSaved, setLastSaved] = useState<Date | null>(null);

const saveToDatabase = useCallback(
  async (blocks: EmailBlock[]) => {
    if (!templateId) return;

    setIsSaving(true);
    try {
      await fetch(`/api/templates/${templateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          blocks,
          description,
          category,
        }),
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  },
  [templateId]
);

// Debounced save
const debouncedSave = useMemo(
  () => debounce(saveToDatabase, 1000),
  [saveToDatabase]
);

useEffect(() => {
  debouncedSave(blocks);
}, [blocks]);
```

**Option B: Manual Save Button**
- Add "Save" button in header
- Show unsaved changes indicator
- Save on explicit user action

**Option C: Hybrid (Recommended)**
- Auto-save after 2 seconds of inactivity
- Manual save button available
- Save status indicator ("Saving...", "Saved at 3:45 PM")

### 7.2 Loading Templates

```typescript
// New hook: useTemplate
export function useTemplate(templateId: string | null) {
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) return;

    setLoading(true);
    fetch(`/api/templates/${templateId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTemplate(data.template);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [templateId]);

  return { template, loading, error };
}
```

### 7.3 Integration with Editor

```typescript
// Update EditorProvider to support loading/saving
export function EditorProvider({
  children,
  initialTemplateId,
}: {
  children: React.ReactNode;
  initialTemplateId?: string;
}) {
  const { template, loading } = useTemplate(initialTemplateId);

  // Initialize blocks from template when loaded
  useEffect(() => {
    if (template) {
      setBlocks(template.blocks);
      // Don't add to history on initial load
      setHistory([{ blocks: template.blocks, selectedBlockId: null }]);
      setHistoryIndex(0);
    }
  }, [template]);

  // ... rest of provider logic
}
```

---

## Phase 8: Additional Features

### 8.1 Search & Filtering
```typescript
// Add to queries.ts
export async function searchTemplates(
  query: string,
  filters?: {
    category?: string;
    tags?: string[];
  }
): Promise<TemplateMetadata[]> {
  let results = db.select().from(templates);

  if (query) {
    results = results.where(
      sql`${templates.name} LIKE ${`%${query}%`} OR ${templates.description} LIKE ${`%${query}%`}`
    );
  }

  if (filters?.category) {
    results = results.where(eq(templates.category, filters.category));
  }

  if (filters?.tags && filters.tags.length > 0) {
    // SQLite JSON querying
    results = results.where(
      sql`EXISTS (
        SELECT 1 FROM json_each(${templates.tags})
        WHERE value IN (${filters.tags.join(',')})
      )`
    );
  }

  return (await results.orderBy(desc(templates.updatedAt))).map(/* map to metadata */);
}
```

### 8.2 Version History (Undo/Redo with DB)
```typescript
// Save version snapshot
export async function saveVersion(templateId: string, blocks: EmailBlock[]) {
  await db.insert(templateVersions).values({
    templateId,
    snapshot: JSON.stringify(blocks),
  });

  // Keep only last 50 versions per template
  const versions = await db
    .select()
    .from(templateVersions)
    .where(eq(templateVersions.templateId, templateId))
    .orderBy(desc(templateVersions.createdAt));

  if (versions.length > 50) {
    const toDelete = versions.slice(50).map((v) => v.id);
    await db.delete(templateVersions).where(
      sql`${templateVersions.id} IN (${toDelete.join(',')})`
    );
  }
}
```

### 8.3 Analytics
```typescript
// Add usage tracking
export const templateAnalytics = sqliteTable('template_analytics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  templateId: text('template_id').notNull(),
  event: text('event').notNull(), // 'view', 'edit', 'duplicate', 'send'
  timestamp: integer('timestamp', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
```

---

## Phase 9: Testing Strategy

### 9.1 Unit Tests
- Test database query functions
- Test data transformations
- Test API endpoints

### 9.2 Integration Tests
- Test full CRUD operations
- Test editor + database integration
- Test auto-save behavior

### 9.3 Migration Testing
```bash
# Test migration script
npm run db:migrate:test

# Verify data integrity
npm run db:verify
```

---

## Phase 10: Deployment Checklist

### 10.1 Development
- [ ] Install dependencies
- [ ] Create schema
- [ ] Generate migrations
- [ ] Run migrations
- [ ] Migrate existing data
- [ ] Update API routes
- [ ] Update state management
- [ ] Add auto-save
- [ ] Test thoroughly

### 10.2 Production Considerations

**SQLite Limitations**
- Not suitable for multiple concurrent writes
- No built-in replication
- File-based (not distributed)

**Production Options:**
1. **Keep SQLite** (if single-server, low traffic)
2. **Upgrade to Turso** (distributed SQLite)
3. **Switch to PostgreSQL** (for high-scale)

**For Turso:**
```bash
npm install @libsql/client
```

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client);
```

---

## Timeline Estimate

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Setup & Installation | 30 min |
| 2 | Schema Design | 1 hour |
| 3 | Database Config | 30 min |
| 4 | Query Layer | 2 hours |
| 5 | Migration | 1 hour |
| 6 | API Updates | 1 hour |
| 7 | State Management | 2 hours |
| 8 | Additional Features | 2 hours |
| 9 | Testing | 2 hours |
| **Total** | | **~12 hours** |

---

## Rollback Plan

### If Issues Arise
1. Keep `lib/email-templates.ts` as fallback
2. Add feature flag: `USE_DATABASE=true/false`
3. Implement dual-write temporarily
4. Gradual migration with monitoring

### Backward Compatibility
```typescript
// Adapter pattern
export const templateStorage =
  process.env.USE_DATABASE === 'true'
    ? dbTemplateStorage
    : fileTemplateStorage;
```

---

## Next Steps

1. **Review this plan** with team
2. **Create a branch**: `feature/database-integration`
3. **Start with Phase 1**: Install dependencies
4. **Iterate phase by phase**
5. **Test after each phase**
6. **Deploy to staging** before production

---

## Questions to Address

1. Should we keep file-based storage as backup?
2. Do we need version history in the database or keep it client-side?
3. What's the auto-save frequency preference?
4. Should we add collaborative editing features?
5. Do we need template sharing/permissions?

---

## Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3)
- [Drizzle Kit](https://github.com/drizzle-team/drizzle-kit-mirror)
- [Turso (Distributed SQLite)](https://turso.tech)
