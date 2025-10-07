# Template Management Examples

This document provides practical examples of using the email template management system.

## Example 1: Save Current Editor State as Template

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useEditor } from '@/contexts/editor-context';

export function SaveTemplateButton() {
  const { blocks } = useEditor();
  const { saveTemplate, loading, error } = useTemplates();

  const handleSave = async () => {
    try {
      await saveTemplate('My Newsletter', blocks, {
        description: 'Weekly newsletter template',
        category: 'newsletter'
      });
      alert('Template saved successfully!');
    } catch (err) {
      console.error('Failed to save template:', err);
    }
  };

  return (
    <button onClick={handleSave} disabled={loading}>
      {loading ? 'Saving...' : 'Save Template'}
    </button>
  );
}
```

## Example 2: Load Template into Editor

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useEditor } from '@/contexts/editor-context';
import { useEffect, useState } from 'react';

export function TemplateSelector() {
  const { listTemplates, loadTemplate, loading } = useTemplates();
  const { setBlocks } = useEditor();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    listTemplates(true).then(setTemplates);
  }, [listTemplates]);

  const handleLoadTemplate = async (id: string) => {
    const template = await loadTemplate(id);
    if (template) {
      setBlocks(template.blocks);
    }
  };

  return (
    <div>
      <h2>Load Template</h2>
      {loading && <p>Loading...</p>}
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <button onClick={() => handleLoadTemplate(template.id)}>
              {template.name}
            </button>
            {template.description && <p>{template.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Example 3: Import from React Email Templates

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useEditor } from '@/contexts/editor-context';
import { useEffect, useState } from 'react';

export function ImportTemplateDialog() {
  const {
    listImportableTemplates,
    importTemplate,
    loadTemplate,
    loading
  } = useTemplates();
  const { setBlocks } = useEditor();
  const [available, setAvailable] = useState<string[]>([]);

  useEffect(() => {
    listImportableTemplates().then(setAvailable);
  }, [listImportableTemplates]);

  const handleImport = async (templateName: string) => {
    // Import and load in one go
    const template = await importTemplate(templateName);
    if (template) {
      setBlocks(template.blocks);
      alert(`Imported ${template.metadata.name}!`);
    }
  };

  return (
    <div>
      <h2>Import from React Email</h2>
      {loading && <p>Importing...</p>}
      <ul>
        {available.map((name) => (
          <li key={name}>
            <button onClick={() => handleImport(name)}>
              Import {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Example 4: Duplicate Template with Custom Name

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useState } from 'react';

export function DuplicateTemplateButton({ templateId }: { templateId: string }) {
  const { duplicateTemplate, loading } = useTemplates();
  const [newName, setNewName] = useState('');

  const handleDuplicate = async () => {
    if (!newName) {
      alert('Please enter a name for the duplicate');
      return;
    }

    try {
      const duplicate = await duplicateTemplate(templateId, newName);
      alert(`Template duplicated as "${duplicate.metadata.name}"!`);
      setNewName('');
    } catch (err) {
      console.error('Failed to duplicate:', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="New template name"
      />
      <button onClick={handleDuplicate} disabled={loading || !newName}>
        {loading ? 'Duplicating...' : 'Duplicate'}
      </button>
    </div>
  );
}
```

## Example 5: Server-Side Template Loading (API Route)

```typescript
// app/api/email/send-template/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loadTemplate } from '@/lib/email-templates';
import { sendEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { templateId, to, subject } = await request.json();

    // Load template
    const template = await loadTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      );
    }

    // Send email using template blocks
    const result = await sendEmail({
      to,
      subject,
      blocks: template.blocks,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending template email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

## Example 6: Template Gallery Component

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useEditor } from '@/contexts/editor-context';
import { useEffect, useState } from 'react';
import { TemplateMetadata } from '@/lib/email-templates';

export function TemplateGallery() {
  const {
    listTemplates,
    loadTemplate,
    deleteTemplate,
    loading,
    error
  } = useTemplates();
  const { setBlocks } = useEditor();
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const list = await listTemplates(true);
    setTemplates(list);
  };

  const handleLoad = async (id: string) => {
    const template = await loadTemplate(id);
    if (template) {
      setBlocks(template.blocks);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
      await loadTemplates(); // Refresh list
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Template Gallery</h2>
      {loading && <p>Loading templates...</p>}

      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded p-4">
            <h3 className="font-bold">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-600">{template.description}</p>
            )}
            {template.category && (
              <span className="badge">{template.category}</span>
            )}
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleLoad(template.id)}>
                Load
              </button>
              <button onClick={() => handleDelete(template.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <p>No templates found. Create one or import from React Email!</p>
      )}
    </div>
  );
}
```

## Example 7: Using Templates with Resend Directly

```typescript
// Server-side only
import { loadTemplate } from '@/lib/email-templates';
import { sendEmail } from '@/lib/resend';

async function sendWelcomeEmail(userEmail: string) {
  // Load the welcome template
  const template = await loadTemplate('welcome-email');

  if (!template) {
    throw new Error('Welcome template not found');
  }

  // Optionally customize blocks before sending
  const customizedBlocks = template.blocks.map((block) => {
    if (block.type === 'text' && block.content?.includes('{{name}}')) {
      return {
        ...block,
        content: block.content.replace('{{name}}', 'John Doe'),
      };
    }
    return block;
  });

  // Send the email
  const result = await sendEmail({
    to: userEmail,
    subject: 'Welcome to our platform!',
    blocks: customizedBlocks,
  });

  return result;
}
```

## Example 8: Template Categories Filter

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useState, useEffect } from 'react';
import { TemplateMetadata } from '@/lib/email-templates';

export function TemplateFilter() {
  const { listTemplates } = useTemplates();
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    listTemplates(true).then(setTemplates);
  }, [listTemplates]);

  // Get unique categories
  const categories = ['all', ...new Set(templates.map((t) => t.category).filter(Boolean))];

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  return (
    <div>
      <div className="mb-4">
        <label>Category: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="template-list">
        {filteredTemplates.map((template) => (
          <div key={template.id}>
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 9: Auto-save Draft Template

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useEditor } from '@/contexts/editor-context';
import { useEffect, useRef } from 'react';

export function AutoSaveDraft() {
  const { blocks } = useEditor();
  const { saveTemplate } = useTemplates();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Save draft after 2 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      saveTemplate('__draft__', blocks, {
        description: 'Auto-saved draft',
        category: 'draft',
      }).catch((err) => {
        console.error('Failed to auto-save:', err);
      });
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [blocks, saveTemplate]);

  return null; // This is a background component
}
```

## Example 10: Search Templates

```typescript
'use client';

import { useTemplates } from '@/lib/hooks/use-templates';
import { useState, useEffect, useMemo } from 'react';
import { TemplateMetadata } from '@/lib/email-templates';

export function TemplateSearch() {
  const { listTemplates } = useTemplates();
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    listTemplates(true).then(setTemplates);
  }, [listTemplates]);

  // Filter templates based on search query
  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return templates;

    const query = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="results">
        {filteredTemplates.length === 0 && (
          <p>No templates found matching "{searchQuery}"</p>
        )}

        {filteredTemplates.map((template) => (
          <div key={template.id}>
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Tips & Best Practices

1. **Always handle errors**: Use try-catch blocks when calling template functions
2. **Show loading states**: Use the `loading` state from `useTemplates()` hook
3. **Confirm destructive actions**: Ask for confirmation before deleting templates
4. **Auto-save drafts**: Save work-in-progress templates automatically
5. **Use categories**: Organize templates with meaningful categories
6. **Validate before save**: Ensure blocks array is not empty before saving
7. **Cache template lists**: Don't fetch templates on every render
8. **Provide feedback**: Show success/error messages to users
9. **Use descriptive names**: Help users identify templates easily
10. **Test imports**: Not all React Email templates parse perfectly

## Common Patterns

### Loading Template on Page Load

```typescript
// Load a specific template when component mounts
useEffect(() => {
  const templateId = searchParams.get('template');
  if (templateId) {
    loadTemplate(templateId).then((template) => {
      if (template) setBlocks(template.blocks);
    });
  }
}, []);
```

### Saving with Custom ID

```typescript
// Save template with specific ID (for updates)
await saveTemplate('My Template', blocks, {
  id: 'custom-id-here',
  description: 'Updated description',
});
```

### Bulk Import Starter Templates

```typescript
// Import all starter templates at once
const starters = await listImportableTemplates();
for (const name of starters) {
  await importTemplate(name);
}
```
