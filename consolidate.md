- the app is running on localhost:3000, if you need to restart use `bun dev`
- the app uses tailwind version 4, next.js version 15, shadcn and nuqs
- use chrome dev tools to validate the design matches the spec and use Playwright MCP to validate functionality
- when you're done, lint and typecheck
- use bun and bunx

# Code Consolidation Plan

## Current State Analysis

### Duplicate Code Issues

There are two parallel implementations that serve different purposes but contain significant duplication:

1. **`components/editor/`** - Interactive editor UI (currently in use)
   - Uses `contexts/editor-context.tsx` for state management
   - Components: `email-block.tsx`, `block-content.tsx`, `settings-panel.tsx`, `block-toolbar.tsx`, `preview-dialog.tsx`
   - Includes interactive features: hover states, selection, add buttons, tooltips
   - Uses React Email components for rendering blocks

2. **`components/email/`** - Standalone email rendering (appears unused)
   - Uses `lib/types.ts` and `types/email.ts` for types
   - Components: `email-block.tsx`, `email-renderer.tsx`, `settings-panel.tsx`, `block-toolbar.tsx`, `preview-dialog.tsx`, `blocks-container.tsx`
   - More prop-based, presentational components
   - Includes `email-renderer.tsx` which wraps blocks in proper HTML/Body structure

3. **`emails/`** - Static React Email templates (existing templates)
   - Contains production email templates (Notion, Stripe, Vercel, Plaid examples)
   - These are standalone components with hardcoded content
   - Used for actual email sending with Resend

### Key Differences

| Aspect | `components/editor/` | `components/email/` |
|--------|---------------------|---------------------|
| State Management | Context-based (EditorProvider) | Props-based |
| Interactivity | Full editor features (hover, select, add) | Presentational only |
| Block Rendering | Uses `BlockContent` component | Uses `renderBlock` function |
| Email Structure | Blocks only | Full HTML/Body wrapper |
| Type Definition | `contexts/editor-context.tsx` | `types/email.ts` & `lib/types.ts` |
| Usage | Main UI (app/page.tsx) | Unused |

### Type Inconsistencies

```typescript
// contexts/editor-context.tsx
export interface EmailBlock {
  id: string;
  type: "text" | "heading" | "image" | "button" | "divider" | "spacer";
  content?: string;  // Simple string
  settings?: Record<string, unknown>;
}

// types/email.ts
export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  content?: string;  // Simple string
  settings?: Record<string, unknown>;
}

// lib/types.ts (DIFFERENT!)
export interface EmailBlock {
  id: string;
  type: string;  // Not typed
  content: Record<string, unknown>;  // Complex object (wrong!)
  settings: Record<string, unknown>;
}
```

## Goals

1. **Editor UI**: Allow users to build/edit email templates with interactive UI
2. **Email Rendering**: Convert editor blocks → React Email components → HTML for sending via Resend
3. **Template Management**: Store and load templates from `emails/` directory
4. **Clean Architecture**: Single source of truth, no duplicate code

## Consolidation Strategy

### Phase 1: Establish Single Source of Truth

#### 1.1 Types & Interfaces
- **Keep**: `types/email.ts` as the single source of truth for EmailBlock types
- **Delete**: `lib/types.ts` (incorrect type definitions)
- **Update**: `contexts/editor-context.tsx` to import from `types/email.ts`

#### 1.2 Core Rendering Components
- **Keep**: `components/editor/block-content.tsx` - This correctly uses React Email components
- **Rename to**: `components/email/block-renderer.tsx` (better naming)
- **Enhance**: Add export/conversion functions for HTML generation

### Phase 2: Consolidate Components

#### 2.1 Email Block Component
- **Keep**: `components/editor/email-block.tsx` (interactive version with hover/select)
- **Delete**: `components/email/email-block.tsx` (unused presentational version)

#### 2.2 Toolbars
- **Keep**: `components/editor/block-toolbar.tsx` (context-aware version)
- **Delete**: `components/email/block-toolbar.tsx` (props-based version)

#### 2.3 Settings Panel
- **Keep**: `components/editor/settings-panel.tsx` (context-aware version)
- **Delete**: `components/email/settings-panel.tsx` (props-based version)

#### 2.4 Preview Dialog
- **Keep**: `components/editor/preview-dialog.tsx` (better integrated)
- **Delete**: `components/email/preview-dialog.tsx` (duplicate)

#### 2.5 Email Renderer
- **Extract from**: `components/email/email-renderer.tsx`
- **Create new**: `lib/email-renderer.tsx` - Server-side email generation utility
- **Purpose**: Convert blocks array → full HTML email for Resend

### Phase 3: New Architecture

```
/components
  /editor                          # Interactive editor UI
    ├── header.tsx                 # Top toolbar
    ├── toolbar-left.tsx           # Left actions (send, favorite, share)
    ├── toolbar-right.tsx          # Right actions (preview modes)
    ├── email-block.tsx            # Interactive block wrapper
    ├── block-toolbar.tsx          # Block actions (move, duplicate, delete)
    ├── settings-panel.tsx         # Right settings panel
    └── preview-dialog.tsx         # Preview modal

  /email                           # Email rendering (for editor & export)
    ├── block-renderer.tsx         # Renders blocks using React Email components
    ├── email-wrapper.tsx          # NEW: Wraps blocks in Html/Body/Container
    └── iphone-frame.tsx           # Mobile preview frame

/lib
  ├── email-exporter.ts            # NEW: Converts blocks → HTML for Resend
  └── email-templates.ts           # NEW: Load/save templates

/types
  └── email.ts                     # Single source of truth for types

/contexts
  └── editor-context.tsx           # State management (updated to use types/email.ts)

/emails                            # Static templates (existing)
  ├── notion-magic-link.tsx        # Can be imported as starting templates
  ├── stripe-welcome.tsx
  └── ...
```

### Phase 4: New Functionality

#### 4.1 Email Export Service (`lib/email-exporter.ts`)
```typescript
import { render } from '@react-email/render';
import { EmailWrapper } from '@/components/email/email-wrapper';
import type { EmailBlock } from '@/types/email';

export function renderEmailToHTML(blocks: EmailBlock[]): string {
  return render(<EmailWrapper blocks={blocks} />);
}

export function renderEmailToText(blocks: EmailBlock[]): string {
  return render(<EmailWrapper blocks={blocks} />, { plainText: true });
}
```

#### 4.2 Resend Integration (`lib/resend.ts`)
```typescript
import { Resend } from 'resend';
import { renderEmailToHTML } from './email-exporter';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  blocks,
}: {
  to: string;
  subject: string;
  blocks: EmailBlock[];
}) {
  const html = renderEmailToHTML(blocks);

  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html,
  });
}
```

#### 4.3 Template Management
- Create API routes to save/load templates
- Allow importing existing `emails/*` templates into editor
- Export editor content as React Email template files

### Phase 5: Clean Up

Files to **DELETE**:
- ❌ `components/email/email-block.tsx`
- ❌ `components/email/block-toolbar.tsx`
- ❌ `components/email/settings-panel.tsx`
- ❌ `components/email/preview-dialog.tsx`
- ❌ `components/email/blocks-container.tsx`
- ❌ `components/email/email-renderer.tsx` (content moved to lib)
- ❌ `components/email/index.ts` (no longer needed)
- ❌ `lib/types.ts` (incorrect definitions)

Files to **MOVE/RENAME**:
- 📦 `components/editor/block-content.tsx` → `components/email/block-renderer.tsx`

Files to **CREATE**:
- ✨ `components/email/email-wrapper.tsx` - Full email wrapper with Html/Body
- ✨ `lib/email-exporter.ts` - HTML generation for Resend
- ✨ `lib/resend.ts` - Resend integration
- ✨ `lib/email-templates.ts` - Template save/load utilities
- ✨ `app/api/send-email/route.ts` - API endpoint for sending emails

Files to **KEEP**:
- ✅ `components/editor/*` (all current editor components)
- ✅ `components/email/iphone-frame.tsx`
- ✅ `contexts/editor-context.tsx` (update imports)
- ✅ `types/email.ts`
- ✅ `emails/*` (all existing templates)

## Implementation Order

1. **Update Type System**
   - Update `types/email.ts` if needed
   - Update `contexts/editor-context.tsx` to import from `types/email.ts`
   - Delete `lib/types.ts`

2. **Create New Components**
   - Move `block-content.tsx` → `components/email/block-renderer.tsx`
   - Create `components/email/email-wrapper.tsx`
   - Update imports in editor components

3. **Create Export Infrastructure**
   - Create `lib/email-exporter.ts`
   - Create `lib/resend.ts`
   - Create API route for sending

4. **Delete Unused Code**
   - Delete all unused `components/email/*` files
   - Remove `components/email/index.ts`

5. **Test & Verify**
   - Editor still works
   - Preview works
   - Email export generates valid HTML
   - Resend integration works

## Benefits

✅ **Single source of truth**: One EmailBlock type, one rendering system
✅ **Clear separation**: Editor UI vs Email Rendering
✅ **Reusable**: Block renderer used in editor preview AND email export
✅ **Production ready**: Proper HTML generation for email clients via Resend
✅ **Template system**: Load existing templates, save new ones
✅ **Maintainable**: Less code, clear responsibilities

## Risk Mitigation

- Keep git history clean with proper commits for each phase
- Test editor functionality after each change
- Ensure React Email components render correctly in both web UI and email HTML
- Validate generated HTML in email clients
