# Mobile Responsive Redesign Plan: CSS Container Queries Implementation

## Executive Summary

This document provides a comprehensive, step-by-step plan for rewriting the Ezero email builder's layouts and navigation to be mobile-responsive using CSS container queries. The application currently uses fixed positioning and hard-coded widths that make it unsuitable for mobile devices. This plan leverages Tailwind CSS 4's native container query support to create a truly component-driven responsive design.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Technology Stack Assessment](#technology-stack-assessment)
3. [Container Query Strategy](#container-query-strategy)
4. [Component-by-Component Refactoring Plan](#component-by-component-refactoring-plan)
5. [Breakpoint Strategy](#breakpoint-strategy)
6. [Navigation Patterns](#navigation-patterns)
7. [Migration Strategy](#migration-strategy)
8. [Implementation Phases](#implementation-phases)
9. [Potential Challenges & Solutions](#potential-challenges--solutions)
10. [Testing Strategy](#testing-strategy)
11. [Performance Considerations](#performance-considerations)

---

## Current State Analysis

### Application Structure

The Ezero email builder consists of two main pages:

1. **Homepage (`/app/page.tsx`)**: Template gallery with sidebar navigation
2. **Template Editor (`/app/template/[id]/page.tsx`)**: Email block editor with multiple panels

### Current Layout Issues

#### Homepage (`/app/page.tsx`)
- **Fixed Sidebar**: `w-[360px] fixed left-0` with `ml-[360px]` on main content
- **Grid Layout**: `grid-cols-1 lg:grid-cols-2` only partially responsive
- **Template Cards**: Using `aspect-[3/4]` ratios that may not work well on small screens
- **No Mobile Navigation**: Sidebar always visible, overlaps content on small screens

#### Template Editor (`/app/template/[id]/page.tsx`)
- **Fixed Left Toolbar**: `fixed top-20 left-5` - overlaps content on mobile
- **Fixed Right Toolbar**: `fixed top-20 right-7` - overlaps content on mobile
- **Fixed Settings Panel**: `w-[360px]` with dynamic margin `marginRight: selectedBlockId ? "360px" : "0"` - pushes content off-screen on mobile
- **Block Toolbar**: Positioned absolutely based on block position - breaks on small screens
- **Canvas**: `max-w-[600px]` works but surrounding UI doesn't adapt

#### Header Component
- **Fixed Positioning**: `fixed top-0 left-0 right-0 h-14` works across devices
- **Simple Layout**: Minimal complexity, already responsive

#### Templates Sidebar
- **Fixed Width**: `w-[360px] fixed left-0 top-0 h-screen` - always visible, no mobile adaptation
- **Tag Filters**: Flex-wrap used but takes up too much space on small screens

### Common Patterns

1. **Fixed Positioning**: Extensive use of `fixed` positioning with hard-coded pixel values
2. **Margin-Based Layouts**: Content areas use left/right margins to avoid fixed sidebars
3. **No Container Context**: All responsive behavior based on viewport, not component containers
4. **Desktop-First Mindset**: Layout assumes large screens by default

---

## Technology Stack Assessment

### Current Stack
- **Next.js 15.5.4**: Latest stable version with React 19
- **Tailwind CSS 4**: Built-in container query support
- **React Email Components**: For email rendering
- **Radix UI**: Accessible component primitives

### Container Query Support

Tailwind CSS 4 provides native container query support without plugins:

- **@container Directive**: Mark elements as container contexts
- **Breakpoint Variants**: `@sm:`, `@md:`, `@lg:`, `@xl:`, `@2xl:` prefixes
- **Named Containers**: `@container/sidebar`, `@container/main` for specific targeting
- **Container Units**: `cqw`, `cqh`, `cqi`, `cqb` for proportional sizing
- **Browser Support**: 91.33% global support (all modern browsers)

### SSR Considerations

**Critical**: Next.js SSR requires CSS-only responsive design to avoid hydration mismatches.

- Use container queries and media queries (CSS) exclusively
- Avoid JavaScript-based responsive logic (window.innerWidth, etc.)
- Single HTML markup tree for SSR and client
- No conditional rendering based on screen size

---

## Container Query Strategy

### Container Hierarchy

```
html (viewport context)
└── body
    └── main app container (@container/app)
        ├── navigation (@container/nav)
        ├── content area (@container/content)
        ├── sidebar (@container/sidebar)
        └── settings panel (@container/settings)
```

### Container Naming Convention

- `/app` - Top-level application container
- `/nav` - Navigation/header areas
- `/sidebar` - Left sidebar on homepage
- `/toolbar` - Floating toolbars in editor
- `/settings` - Right settings panel
- `/canvas` - Email editing canvas
- `/preview` - Preview dialog content

### Breakpoint Philosophy

**Mobile-First Approach**: Start with mobile layouts, enhance for larger containers

```css
/* Base: Mobile (no prefix needed) */
.component { /* mobile styles */ }

/* Tablet: 640px+ */
@sm: { /* tablet styles */ }

/* Desktop: 768px+ */
@md: { /* small desktop */ }

/* Large Desktop: 1024px+ */
@lg: { /* large desktop */ }

/* Extra Large: 1280px+ */
@xl: { /* extra large */ }
```

---

## Component-by-Component Refactoring Plan

### 1. Root Layout (`/app/layout.tsx`)

**Current State**: Simple wrapper with providers

**Changes Required**:
- Add container context to body or main wrapper
- Set up root container for app-wide queries

**Implementation**:
```tsx
// Add container context
<body className={`${geistSans.variable} ${geistMono.variable} antialiased @container/app`}>
  <Providers>{children}</Providers>
</body>
```

**Priority**: Low (minimal changes needed)

---

### 2. Homepage (`/app/page.tsx`)

**Current Issues**:
- Fixed sidebar with hard-coded margin on main content
- No mobile navigation
- Grid doesn't adapt well to small screens

**Required Changes**:

#### Container Setup
```tsx
<div className="@container/app h-[100dvh] bg-background flex flex-col @lg:flex-row">
  {/* Sidebar */}
  <TemplatesSidebar />

  {/* Main Content */}
  <main className="@container/content flex-1 overflow-y-auto">
    {/* Template grid */}
  </main>
</div>
```

#### Sidebar Transformation
- **Mobile**: Hidden by default, drawer/sheet overlay when opened
- **Tablet**: Collapsible sidebar with toggle button
- **Desktop**: Always visible, fixed width

```tsx
// Mobile: absolute positioning, transform off-screen
className="
  absolute inset-y-0 left-0 w-[280px] -translate-x-full transition-transform
  @md/app:translate-x-0 @md/app:relative @md/app:w-[320px]
  @lg/app:w-[360px]
"
```

#### Main Content Area
```tsx
// Remove fixed margin, use flex-1 for responsive growth
className="
  flex-1 py-8 px-4 overflow-y-auto
  @md/app:px-6 @md/app:py-12
  @lg/app:px-20 @lg/app:py-28
"
```

#### Template Grid
```tsx
// Responsive column count based on container
className="
  grid grid-cols-1 gap-8
  @sm/content:grid-cols-2
  @lg/content:grid-cols-2
  @xl/content:grid-cols-3
"
```

**Priority**: High (core user experience)

---

### 3. Template Sidebar (`/components/templates-sidebar.tsx`)

**Current Issues**:
- Always visible at 360px width
- No mobile menu
- Tags take too much space on small screens

**Required Changes**:

#### Mobile Sheet/Drawer Pattern
- Use Radix Dialog/Sheet for mobile overlay
- Hamburger menu button in header for mobile
- Slide-in animation from left

#### Responsive Width
```tsx
className="
  w-full @md/app:w-[320px] @lg/app:w-[360px]
  bg-background border-r
"
```

#### Tag Cloud Responsiveness
```tsx
// Adjust tag size based on container
className="
  px-2 py-1 text-xs @md/sidebar:px-3 @md/sidebar:py-1.5 @md/sidebar:text-sm
"
```

**New Component**: `MobileSidebarToggle` button for header

**Priority**: High

---

### 4. Template Editor Page (`/app/template/[id]/page.tsx`)

**Current Issues**:
- Multiple fixed toolbars overlap on mobile
- Settings panel pushes content off-screen
- Canvas margin doesn't work on small screens

**Required Changes**:

#### Layout Structure Transformation

**Current**:
```tsx
<div className="h-[100dvh]">
  <Header /> {/* fixed */}
  <ToolbarLeft /> {/* fixed left */}
  <ToolbarRight /> {/* fixed right */}
  <main style={{ marginRight: selectedBlockId ? "360px" : "0" }}>
    {/* canvas */}
  </main>
  <SettingsPanel /> {/* fixed right */}
</div>
```

**Proposed**:
```tsx
<div className="@container/editor h-[100dvh] flex flex-col">
  <Header />

  <div className="@container/workspace flex-1 flex flex-col @lg:flex-row overflow-hidden">
    {/* Mobile: Bottom toolbar */}
    {/* Desktop: Left toolbar */}
    <ToolbarLeft />

    {/* Canvas Area */}
    <main className="@container/canvas flex-1 overflow-y-auto">
      {/* email blocks */}
    </main>

    {/* Mobile: Bottom sheet */}
    {/* Desktop: Right panel */}
    <SettingsPanel />

    {/* Mobile: Top toolbar */}
    {/* Desktop: Right floating toolbar */}
    <ToolbarRight />
  </div>
</div>
```

#### Responsive Behavior by Screen Size

**Mobile (< 768px)**:
- Canvas takes full width/height
- Left toolbar: Bottom fixed bar with horizontal icons
- Right toolbar: Top bar with preview buttons
- Settings panel: Bottom sheet overlay (when block selected)
- Block toolbar: Floating at top of selected block

**Tablet (768px - 1024px)**:
- Canvas centered with padding
- Left toolbar: Vertical fixed left (collapsed)
- Right toolbar: Top-right corner
- Settings panel: Slide-in from right (overlay)
- Block toolbar: Side of selected block

**Desktop (1024px+)**:
- Current layout preserved
- All panels visible simultaneously
- Settings panel pushes canvas (current behavior)

**Priority**: Critical (core editing experience)

---

### 5. Header Component (`/components/editor/header.tsx`)

**Current State**: Already mostly responsive

**Required Changes**:

#### Mobile Additions
- Add hamburger menu for mobile navigation
- Reduce logo size on small screens
- Move export dropdown to overflow menu on mobile

```tsx
className="
  fixed top-0 left-0 right-0 h-14 bg-background border-b flex items-center justify-between
  px-4 @md/app:px-7
  z-50
"
```

#### Logo Responsive
```tsx
<h1 className="font-mono text-lg @md:text-xl font-semibold">
  e0
</h1>
```

**Priority**: Medium

---

### 6. Left Toolbar (`/components/editor/toolbar-left.tsx`)

**Current Issues**:
- Fixed positioning overlaps canvas on mobile
- Vertical layout wastes space on mobile

**Required Changes**:

#### Mobile: Bottom Toolbar
```tsx
<div className="
  fixed bottom-0 left-0 right-0 z-30
  flex flex-row gap-2 justify-around p-2 bg-background border-t
  @lg/editor:flex-col @lg/editor:top-20 @lg/editor:left-5 @lg/editor:bottom-auto
  @lg/editor:right-auto @lg/editor:border-t-0 @lg/editor:border-r @lg/editor:gap-0
">
  {/* buttons */}
</div>
```

#### Icon Size Adjustment
```tsx
// Slightly larger icons for mobile (easier touch targets)
<Button size="icon" className="@lg/editor:size-9 size-11">
  <Send className="@lg/editor:size-4 size-5" />
</Button>
```

**Priority**: High

---

### 7. Right Toolbar (`/components/editor/toolbar-right.tsx`)

**Current Issues**:
- Fixed top-right doesn't work well on mobile with left toolbar

**Required Changes**:

#### Mobile: Top Mini Bar
```tsx
<div className="
  fixed top-14 left-0 right-0 z-30
  flex flex-row gap-2 justify-center p-2 bg-background/80 backdrop-blur
  @lg/editor:top-20 @lg/editor:right-7 @lg/editor:left-auto @lg/editor:bg-transparent
  @lg/editor:backdrop-blur-none
">
  {/* preview buttons */}
</div>
```

**Priority**: High

---

### 8. Settings Panel (`/components/editor/settings-panel.tsx`)

**Current Issues**:
- Fixed 360px width takes entire screen on mobile
- Always visible when block selected, even on small screens

**Required Changes**:

#### Mobile: Bottom Sheet Pattern
```tsx
// Import Radix Dialog/Sheet
import * as Dialog from "@radix-ui/react-dialog"

// Mobile: Full-screen bottom sheet
// Desktop: Fixed right panel
<Dialog.Root open={selectedBlockId !== null}>
  <Dialog.Portal>
    <Dialog.Overlay className="@lg/editor:hidden fixed inset-0 bg-black/50" />
    <Dialog.Content className="
      fixed bottom-0 left-0 right-0 max-h-[80vh]
      bg-background rounded-t-xl border-t
      @lg/editor:top-14 @lg/editor:bottom-0 @lg/editor:left-auto
      @lg/editor:right-0 @lg/editor:w-[360px] @lg/editor:rounded-none
      @lg/editor:border-t-0 @lg/editor:border-l
    ">
      {/* panel content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

#### Tab Navigation
```tsx
// Horizontal scrollable tabs on mobile
<TabsList className="
  overflow-x-auto overflow-y-hidden
  @lg/settings:overflow-x-visible
">
  {/* tabs */}
</TabsList>
```

**Priority**: Critical

---

### 9. Block Toolbar (`/components/editor/block-toolbar.tsx`)

**Current Issues**:
- Absolutely positioned based on block rectangle
- Can overflow off screen on mobile
- Vertical layout wastes space

**Required Changes**:

#### Mobile: Horizontal Toolbar Above Block
```tsx
<div className="
  fixed z-40
  @max-md/canvas:relative @max-md/canvas:flex @max-md/canvas:flex-row
  @max-md/canvas:justify-center @max-md/canvas:gap-1 @max-md/canvas:py-2
  @md/canvas:flex-col
"
  style={
    // Only use absolute positioning on desktop
    containerWidth >= 768 ? { top: position.top, left: position.left } : {}
  }
>
  {/* toolbar buttons */}
</div>
```

#### Conditional Rendering by Container Size
```tsx
// Use container query JavaScript API to detect size
const [containerWidth, setContainerWidth] = useState(0)

useEffect(() => {
  const container = document.querySelector('[data-container="canvas"]')
  if (!container) return

  const observer = new ResizeObserver(entries => {
    setContainerWidth(entries[0].contentRect.width)
  })

  observer.observe(container)
  return () => observer.disconnect()
}, [])
```

**Priority**: High

---

### 10. Preview Dialog (`/components/editor/preview-dialog.tsx`)

**Current Issues**:
- Full-screen dialog works well
- iPhone frame might be too large on small screens

**Required Changes**:

#### Mobile Frame Scaling
```tsx
// Scale down phone frame on very small screens
<div className="
  scale-75 @sm/preview:scale-90 @md/preview:scale-100
  rounded-[2.5rem] border-8 border-primary bg-primary p-2.5
">
  <div className="h-[667px] w-[375px] overflow-auto rounded-[2rem] bg-card">
    {/* preview content */}
  </div>
</div>
```

#### Button Spacing
```tsx
// Stack buttons vertically on very small screens
<div className="
  flex flex-col gap-2 @sm/preview:flex-row @sm/preview:gap-2
">
  {/* preview mode buttons */}
</div>
```

**Priority**: Medium

---

### 11. Email Block Component (`/components/editor/email-block.tsx`)

**Current Issues**:
- Blocks render well but need better mobile interaction

**Required Changes**:

#### Touch Targets
```tsx
// Ensure minimum 44px touch target height on mobile
className="
  min-h-[44px] @md/canvas:min-h-[60px]
  p-3 @md/canvas:p-4
"
```

#### Selection Indicator
```tsx
// Larger selection border on mobile for easier visibility
className="
  outline-2 @md/canvas:outline-1
  outline-primary
"
```

**Priority**: Medium

---

## Breakpoint Strategy

### Container Query Breakpoints

Based on Tailwind CSS 4 defaults and common device sizes:

| Breakpoint | Container Width | Target Devices | Usage |
|------------|----------------|----------------|-------|
| Base | 0px - 639px | Mobile phones | Default mobile-first styles |
| `@sm` | 640px+ | Large phones, small tablets | Optimize spacing, 2-column grids |
| `@md` | 768px+ | Tablets, small laptops | Show sidebars, multi-column layouts |
| `@lg` | 1024px+ | Laptops, desktops | Full desktop experience, all panels visible |
| `@xl` | 1280px+ | Large desktops | Enhanced spacing, 3-column grids |
| `@2xl` | 1536px+ | Extra large displays | Maximum content width, optimal spacing |

### Named Container Breakpoints

For specific component contexts:

```tsx
// Sidebar container
@container/sidebar (min-width: 280px) { /* collapsed */ }
@container/sidebar (min-width: 320px) { /* expanded */ }

// Canvas container
@container/canvas (min-width: 320px) { /* minimal */ }
@container/canvas (min-width: 600px) { /* optimal */ }
@container/canvas (min-width: 800px) { /* spacious */ }

// Settings panel
@container/settings (min-width: 280px) { /* mobile sheet */ }
@container/settings (min-width: 360px) { /* full panel */ }
```

### Viewport Media Queries (for special cases)

Some behaviors still require viewport queries:

```tsx
// Navigation drawer (needs viewport context)
@media (max-width: 767px) {
  /* Mobile drawer overlay */
}

// Print styles
@media print {
  /* Print-specific styles */
}
```

---

## Navigation Patterns

### Mobile Navigation Strategy

#### Homepage
**Problem**: 360px fixed sidebar takes full screen on mobile

**Solution**: Hamburger menu with slide-in drawer

```tsx
// Mobile: Hidden by default
// Hamburger button in header
<button onClick={toggleSidebar} className="@lg/app:hidden">
  <Menu size={24} />
</button>

// Drawer overlay
<aside className="
  fixed inset-y-0 left-0 z-50 w-[280px]
  transform transition-transform duration-300
  -translate-x-full
  data-[state=open]:translate-x-0
  @lg/app:translate-x-0 @lg/app:relative @lg/app:w-[360px]
">
  {/* sidebar content */}
</aside>

// Backdrop
<div className="
  fixed inset-0 bg-black/50 z-40
  @lg/app:hidden
  data-[state=closed]:hidden
" />
```

#### Template Editor
**Problem**: Multiple fixed panels overlap on mobile

**Solution**: Context-aware panel system

**Mobile Layout Flow**:
```
┌─────────────────────┐
│ Header (fixed top)  │
├─────────────────────┤
│ Toolbar (top bar)   │  ← Preview buttons
├─────────────────────┤
│                     │
│   Canvas (full)     │  ← Email blocks
│                     │
├─────────────────────┤
│ Toolbar (bottom)    │  ← Actions (send, fav, share)
└─────────────────────┘
     ↑
     └── Settings (bottom sheet overlay when block selected)
```

**Desktop Layout Flow**:
```
┌──────┬──────────────────┬──────┐
│      │ Header (fixed)   │      │
├──────┼──────────────────┼──────┤
│ Tool │                  │ Tool │
│ bar  │  Canvas (center) │ bar  │
│ Left │                  │Right │
│      │                  │      │
│      ├──────────────────┼──────┤
│      │                  │Set-  │
│      │                  │tings │
└──────┴──────────────────┴──────┘
```

### Panel State Management

**Mobile Considerations**:
- Only one panel visible at a time (prevents overlap)
- Settings panel appears as bottom sheet overlay
- Block toolbar appears as top bar above selected block
- Smooth transitions between states

**Implementation**:
```tsx
// Panel state management
const [activeMobilePanel, setActiveMobilePanel] = useState<
  'none' | 'settings' | 'blockTools'
>(none)

// Only on mobile
useEffect(() => {
  const container = document.querySelector('[data-container="editor"]')
  // ... resize observer

  if (containerWidth < 768) {
    // Mobile: Manage panel priority
    if (selectedBlockId) {
      setActiveMobilePanel('settings')
    }
  }
}, [containerWidth, selectedBlockId])
```

### Touch Gestures (Future Enhancement)

Consider adding swipe gestures for mobile:
- Swipe right: Open navigation/sidebar
- Swipe left: Close panels
- Swipe up on block: Open settings
- Swipe down: Close settings sheet

---

## Migration Strategy

### Can it be done incrementally?

**Yes!** The migration can be phased:

### Phase 1: Foundation (Week 1)
**Goal**: Set up container query infrastructure without breaking existing layouts

1. Add container contexts to root elements
2. Test container query support
3. Update Tailwind CSS configuration if needed
4. Create utility classes for common container patterns
5. Document container naming convention

**Deliverables**:
- Container contexts added to all major layout components
- No visual changes to existing layouts
- Foundation for incremental migration

**Risk**: Low - purely additive changes

---

### Phase 2: Homepage Mobile Support (Week 2)
**Goal**: Make homepage usable on mobile devices

1. Implement mobile sidebar drawer
2. Add hamburger menu to header
3. Make template grid responsive with container queries
4. Update tag filters for mobile
5. Add touch-friendly spacing

**Deliverables**:
- Homepage fully functional on mobile
- Sidebar slides in/out smoothly
- Template grid adapts to screen size
- Tags wrap appropriately

**Risk**: Medium - significant layout changes but isolated to homepage

**Testing Focus**:
- Mobile devices (iPhone, Android)
- Tablet landscape/portrait
- Touch interactions
- Drawer animations

---

### Phase 3: Editor Mobile - Bottom Toolbar (Week 3)
**Goal**: Relocate left toolbar to bottom on mobile

1. Implement container queries for ToolbarLeft
2. Transform vertical to horizontal layout on mobile
3. Increase touch target sizes
4. Update z-index hierarchy
5. Test with keyboard/screen readers

**Deliverables**:
- Left toolbar functions on mobile
- Horizontal button layout
- Accessible touch targets
- No overlap with canvas

**Risk**: Medium - changes core editing interface

**Testing Focus**:
- Button functionality on mobile
- Accessibility (screen readers, keyboard)
- Visual alignment
- Touch target sizing (minimum 44px)

---

### Phase 4: Editor Mobile - Settings Panel (Week 3-4)
**Goal**: Transform settings panel into mobile bottom sheet

1. Implement bottom sheet with Radix Dialog
2. Add slide-up animation
3. Make tabs horizontally scrollable
4. Handle keyboard on mobile (viewport resize)
5. Add close button/swipe-down gesture

**Deliverables**:
- Settings panel works as bottom sheet on mobile
- Smooth open/close animations
- Tabs scrollable horizontally
- Keyboard doesn't cover content

**Risk**: High - complex mobile pattern, interaction with virtual keyboard

**Testing Focus**:
- iOS Safari keyboard behavior
- Android Chrome keyboard behavior
- Swipe gestures
- Tab scrolling
- Content visibility with keyboard open

---

### Phase 5: Editor Mobile - Block Toolbar (Week 4)
**Goal**: Make block toolbar mobile-friendly

1. Detect container width with ResizeObserver
2. Switch to horizontal layout on mobile
3. Position toolbar above block (relative) on mobile
4. Keep floating sidebar (absolute) on desktop
5. Update positioning logic

**Deliverables**:
- Block toolbar doesn't overflow on mobile
- Horizontal layout on small screens
- Buttons remain functional
- Smooth transitions

**Risk**: Medium - complex positioning logic

**Testing Focus**:
- Toolbar visibility on all block types
- Positioning accuracy
- Button functionality
- Scroll behavior

---

### Phase 6: Polish & Preview (Week 5)
**Goal**: Refine mobile experience and preview dialog

1. Scale preview iPhone frame for small screens
2. Add container queries to all remaining components
3. Fix any remaining overflow issues
4. Add loading states for mobile
5. Optimize animations for mobile performance

**Deliverables**:
- All components responsive
- Preview dialog scales appropriately
- Smooth animations
- No performance issues

**Risk**: Low - refinements only

**Testing Focus**:
- Performance profiling
- Animation frame rates
- Memory usage
- Battery impact (mobile)

---

### Phase 7: Testing & Bug Fixes (Week 6)
**Goal**: Comprehensive testing and bug resolution

1. Cross-browser testing (Safari, Chrome, Firefox, Edge)
2. Device testing (various iPhones, Android phones, tablets)
3. Accessibility audit
4. Performance optimization
5. User testing feedback

**Deliverables**:
- Zero critical bugs
- Accessibility WCAG AA compliant
- Performance benchmarks met
- User feedback incorporated

**Risk**: Low - testing phase

---

## Potential Challenges & Solutions

### Challenge 1: SSR Hydration Mismatches

**Problem**: JavaScript-based responsive logic causes mismatches between server and client rendering

**Solution**:
- Use CSS-only container queries and media queries
- Avoid `window.innerWidth` or similar JS checks
- Use `@container` and `@media` exclusively for responsive behavior
- If JS needed, wrap in `useEffect` and use `suppressHydrationWarning` sparingly

**Example**:
```tsx
// ❌ BAD: JavaScript-based
const isMobile = window.innerWidth < 768

return (
  <div>
    {isMobile ? <MobileNav /> : <DesktopNav />}
  </div>
)

// ✅ GOOD: CSS-based
return (
  <div>
    <nav className="block @md:hidden">
      <MobileNav />
    </nav>
    <nav className="hidden @md:block">
      <DesktopNav />
    </nav>
  </div>
)
```

---

### Challenge 2: Container Query Browser Support

**Problem**: 91% browser support means 9% of users might have issues

**Solution**:
- Provide fallback styles for unsupported browsers
- Use `@supports` queries to detect container query support
- Graceful degradation to media queries

**Example**:
```css
/* Fallback: media query */
@media (min-width: 768px) {
  .component {
    /* desktop styles */
  }
}

/* Enhanced: container query */
@supports (container-type: inline-size) {
  @container (min-width: 768px) {
    .component {
      /* desktop styles */
    }
  }
}
```

**Tailwind Approach**:
```tsx
// Tailwind automatically provides fallbacks
// Use both media queries and container queries
className="md:flex @md/app:flex"
```

---

### Challenge 3: Fixed Positioning with Container Queries

**Problem**: Container queries don't work well with `position: fixed` elements

**Solution**:
- Use viewport media queries for fixed elements (header, overlays)
- Use container queries for content within fixed containers
- Carefully manage z-index hierarchy

**Example**:
```tsx
// Header: Use viewport media query (fixed to viewport)
<header className="fixed top-0 left-0 right-0 h-14 px-4 md:px-7">
  {/* header content */}
</header>

// Content: Use container query (within scrollable container)
<main className="@container/main pt-14 overflow-y-auto">
  <div className="p-4 @md/main:p-8">
    {/* responsive content */}
  </div>
</main>
```

---

### Challenge 4: Nested Containers Complexity

**Problem**: Multiple nested containers can lead to confusing behavior

**Solution**:
- Use named containers to target specific contexts
- Document container hierarchy clearly
- Limit nesting depth where possible
- Use semantic naming

**Example**:
```tsx
// Clear hierarchy with names
<div className="@container/app">
  <aside className="@container/sidebar">
    <div className="@container/tags">
      {/* Only responds to /tags container */}
      <button className="text-sm @md/tags:text-base">
        Tag
      </button>
    </div>
  </aside>
</div>
```

---

### Challenge 5: Mobile Bottom Sheet Keyboard Overlap

**Problem**: On iOS/Android, virtual keyboard covers bottom sheet content

**Solution**:
- Detect keyboard visibility with viewport height changes
- Adjust bottom sheet max-height dynamically
- Use `viewport-fit=cover` meta tag
- Test on actual devices (simulators don't show keyboard)

**Example**:
```tsx
// Adjust bottom sheet height
const [keyboardVisible, setKeyboardVisible] = useState(false)

useEffect(() => {
  const handleResize = () => {
    // Detect keyboard by viewport height change
    const isKeyboardVisible = window.innerHeight < window.screen.height * 0.8
    setKeyboardVisible(isKeyboardVisible)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// Bottom sheet with dynamic height
<Dialog.Content
  className={cn(
    "fixed bottom-0 left-0 right-0",
    keyboardVisible ? "max-h-[40vh]" : "max-h-[80vh]"
  )}
>
  {/* content */}
</Dialog.Content>
```

---

### Challenge 6: Touch Target Sizes

**Problem**: Desktop UI elements may be too small for touch on mobile

**Solution**:
- Follow WCAG 2.1 AA guidelines (minimum 44x44px touch targets)
- Use container queries to adjust button sizes
- Increase spacing between interactive elements on mobile
- Test on actual devices with real fingers (not mouse)

**Example**:
```tsx
// Responsive touch targets
<Button
  size="icon"
  className="
    size-11 @md/toolbar:size-9
    m-1 @md/toolbar:m-0
  "
>
  <Icon className="size-5 @md/toolbar:size-4" />
</Button>
```

---

### Challenge 7: Performance on Low-End Mobile Devices

**Problem**: Container query calculations + animations may be slow on older phones

**Solution**:
- Use `will-change` sparingly
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Reduce animation complexity on mobile
- Use `prefers-reduced-motion` media query
- Profile on mid-range Android devices

**Example**:
```tsx
// Simplified animations for mobile
className="
  transition-transform duration-300
  @md/app:transition-all @md/app:duration-200
  motion-reduce:transition-none
"
```

---

### Challenge 8: Email Preview Responsiveness

**Problem**: Email blocks use inline styles for email client compatibility, hard to make responsive

**Solution**:
- Email preview (for editor) can use Tailwind classes
- Email export (for sending) uses inline styles
- Use separate components for editing vs. exporting
- Document the difference clearly

**Example**:
```tsx
// For editing (in browser)
<BlockContent block={block} mode="editor" />

// For exporting (email client)
<BlockContent block={block} mode="email" />

// Inside BlockContent
const wrapperClass = mode === 'editor'
  ? "p-4 @md/canvas:p-6" // Tailwind for browser
  : undefined // No classes for email

const wrapperStyle = mode === 'email'
  ? { padding: '16px' } // Inline for email
  : undefined
```

---

### Challenge 9: Testing Container Queries

**Problem**: Hard to test container-based responsive behavior with traditional tools

**Solution**:
- Use browser DevTools "Container Queries" panel (Chrome/Edge)
- Create a testing page with resizable containers
- Use Percy or similar visual regression testing
- Test on real devices at various sizes
- Use Storybook with viewport addon

**Testing Setup**:
```tsx
// Testing component with resizable container
export function ContainerTest() {
  const [width, setWidth] = useState(400)

  return (
    <div>
      <input
        type="range"
        min="300"
        max="1200"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
      />
      <div
        className="@container/test border-2 border-red-500"
        style={{ width: `${width}px` }}
      >
        <ComponentUnderTest />
      </div>
    </div>
  )
}
```

---

### Challenge 10: Migration Rollout Strategy

**Problem**: Can't deploy half-broken responsive features to production

**Solution**:
- Use feature flags to enable mobile UI per user group
- Deploy behind `/beta` route for testing
- A/B test with small percentage of users
- Provide "Use Desktop Version" fallback link
- Monitor analytics for mobile bounce rate changes

**Implementation**:
```tsx
// Feature flag approach
const { isMobileUIEnabled } = useFeatureFlags()

return (
  <div className={cn(
    isMobileUIEnabled
      ? "@container/app" // New responsive behavior
      : "" // Old fixed layout
  )}>
    {/* ... */}
  </div>
)
```

---

## Testing Strategy

### Unit Testing

**What to Test**:
- Component rendering at different container sizes
- Container query class application
- Responsive utility functions
- Event handlers for mobile interactions

**Tools**:
- Jest + React Testing Library
- Mock `ResizeObserver` for container size changes
- Test accessibility with jest-axe

**Example**:
```tsx
import { render } from '@testing-library/react'
import { TemplatesSidebar } from './templates-sidebar'

describe('TemplatesSidebar', () => {
  it('applies mobile classes in small container', () => {
    const { container } = render(
      <div style={{ width: '320px' }} className="@container/app">
        <TemplatesSidebar />
      </div>
    )

    // Assert mobile classes applied
    expect(container.querySelector('aside')).toHaveClass('w-[280px]')
  })

  it('applies desktop classes in large container', () => {
    const { container } = render(
      <div style={{ width: '1200px' }} className="@container/app">
        <TemplatesSidebar />
      </div>
    )

    // Assert desktop classes applied
    expect(container.querySelector('aside')).toHaveClass('@lg:w-[360px]')
  })
})
```

---

### Integration Testing

**What to Test**:
- Navigation flows on mobile (drawer open/close)
- Settings panel open/close on mobile
- Block selection and editing on mobile
- Multi-panel interactions

**Tools**:
- Playwright or Cypress
- Mobile viewport emulation
- Touch event simulation

**Example**:
```ts
import { test, expect } from '@playwright/test'

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('opens sidebar drawer on mobile', async ({ page }) => {
    await page.goto('/')

    // Hamburger button should be visible on mobile
    const menuButton = page.getByRole('button', { name: /menu/i })
    await expect(menuButton).toBeVisible()

    // Sidebar should be hidden initially
    const sidebar = page.getByRole('complementary')
    await expect(sidebar).not.toBeInViewport()

    // Click to open
    await menuButton.click()

    // Sidebar should slide in
    await expect(sidebar).toBeInViewport()
  })
})
```

---

### Visual Regression Testing

**What to Test**:
- Screenshots at various container sizes
- Animations and transitions
- Responsive layouts across pages

**Tools**:
- Percy.io or Chromatic
- Screenshot comparisons
- Automated visual diffs

**Example**:
```ts
import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test('homepage responsive layouts', async ({ page }) => {
  await page.goto('/')

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await percySnapshot(page, 'Homepage - Mobile')

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 })
  await percySnapshot(page, 'Homepage - Tablet')

  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 })
  await percySnapshot(page, 'Homepage - Desktop')
})
```

---

### Device Testing

**What to Test**:
- Actual device behavior (not just emulation)
- Touch interactions
- Virtual keyboard behavior
- Performance on low-end devices

**Devices to Test**:
- iPhone 12/13/14 (iOS Safari)
- iPhone SE (small screen)
- Samsung Galaxy S21 (Android Chrome)
- iPad Pro (tablet)
- Mid-range Android phone (performance testing)

**Manual Testing Checklist**:
- [ ] Sidebar drawer opens/closes smoothly
- [ ] Bottom sheet doesn't overlap keyboard
- [ ] Touch targets are easy to tap
- [ ] Animations are smooth (60fps)
- [ ] No horizontal scrolling
- [ ] All content accessible
- [ ] Forms work with virtual keyboard
- [ ] Landscape orientation works

---

### Accessibility Testing

**What to Test**:
- Screen reader compatibility (mobile)
- Keyboard navigation
- Focus management with drawers/sheets
- Color contrast
- Touch target sizes

**Tools**:
- axe DevTools
- Lighthouse (mobile score)
- VoiceOver (iOS)
- TalkBack (Android)

**Example Checks**:
```tsx
// Ensure proper ARIA labels for mobile nav
<button
  aria-label="Open navigation menu"
  aria-expanded={isDrawerOpen}
  onClick={toggleDrawer}
>
  <Menu />
</button>

// Focus trap in mobile drawer
<Dialog.Content>
  <FocusTrap>
    {/* drawer content */}
  </FocusTrap>
</Dialog.Content>
```

---

### Performance Testing

**What to Test**:
- Initial page load on 3G
- Animation frame rates
- Memory usage on mobile
- Battery impact

**Tools**:
- Lighthouse (performance score)
- Chrome DevTools Performance tab
- WebPageTest.org (mobile network simulation)
- React DevTools Profiler

**Metrics to Track**:
- First Contentful Paint (FCP): < 1.8s on 3G
- Largest Contentful Paint (LCP): < 2.5s on 3G
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms
- Time to Interactive (TTI): < 3.8s on 3G

---

## Performance Considerations

### 1. Container Query Performance

**Impact**: Container queries require layout calculations

**Optimizations**:
- Limit container nesting depth (max 3-4 levels)
- Use `container-type: inline-size` instead of `size` when possible (more performant)
- Avoid changing container boundaries frequently
- Use `content-visibility: auto` for off-screen containers

**Example**:
```tsx
// Optimize with content-visibility
<div
  className="@container/sidebar"
  style={{ contentVisibility: 'auto' }}
>
  {/* sidebar content */}
</div>
```

---

### 2. Animation Performance

**Impact**: Mobile devices have less powerful GPUs

**Optimizations**:
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `margin`, `padding` (triggers layout)
- Use `will-change` sparingly (creates new layer, uses memory)
- Reduce animation duration on mobile
- Honor `prefers-reduced-motion`

**Example**:
```tsx
// Good: GPU-accelerated
className="
  transition-transform duration-300
  translate-x-0 data-[state=open]:-translate-x-full
"

// Bad: Forces layout recalculation
className="
  transition-all duration-300
  w-0 data-[state=open]:w-[360px]
"
```

---

### 3. Bundle Size

**Impact**: Mobile users on slow networks

**Optimizations**:
- Code split by route (Next.js automatic)
- Dynamic import heavy components
- Tree-shake unused Radix UI components
- Lazy load preview dialog
- Use next/dynamic for mobile-only components

**Example**:
```tsx
// Lazy load mobile drawer (not needed on desktop)
const MobileDrawer = dynamic(
  () => import('./mobile-drawer'),
  { ssr: false } // Client-only
)

// Conditional rendering
export function Navigation() {
  return (
    <>
      <DesktopNav />
      {isMobile && <MobileDrawer />}
    </>
  )
}
```

---

### 4. Re-render Optimization

**Impact**: Container queries trigger on resize, may cause excessive re-renders

**Optimizations**:
- Memoize expensive components with `React.memo`
- Use `useMemo` for expensive calculations
- Debounce resize handlers
- Use `useCallback` for event handlers
- Virtualize long lists

**Example**:
```tsx
// Memoize to prevent unnecessary re-renders
const TemplateCard = React.memo(({ template }) => {
  return (
    <div className="@container/card">
      {/* card content */}
    </div>
  )
})

// Debounce resize observer
const debouncedWidth = useDebouncedValue(containerWidth, 150)
```

---

### 5. Critical CSS

**Impact**: First paint blocked by CSS loading

**Optimizations**:
- Inline critical above-the-fold CSS
- Defer non-critical styles
- Use Next.js built-in CSS optimization
- Purge unused Tailwind classes (automatic in prod)

**Tailwind v4**: Automatically optimized, only includes used classes

---

### 6. Image Optimization

**Impact**: Large images slow mobile load times

**Optimizations**:
- Use Next.js `<Image>` component
- Serve responsive images
- Use WebP/AVIF formats
- Lazy load off-screen images
- Optimize template preview thumbnails

**Example**:
```tsx
import Image from 'next/image'

<Image
  src="/templates/preview.jpg"
  alt="Template preview"
  width={400}
  height={533}
  className="@sm/card:w-[500px] @sm/card:h-[666px]"
  loading="lazy"
  placeholder="blur"
/>
```

---

### 7. Font Loading

**Impact**: Font loading blocks render on mobile

**Optimizations**:
- Use `next/font` for automatic optimization
- Subset fonts (only include used characters)
- Use font-display: swap
- Preload critical fonts

**Already Optimized**:
```tsx
// app/layout.tsx - Already using next/font
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Prevents FOIT
})
```

---

## Additional Recommendations

### 1. Add a Mobile Testing Page

Create `/app/test/responsive/page.tsx` for testing container queries:

```tsx
'use client'

import { useState } from 'react'
import { TemplatesSidebar } from '@/components/templates-sidebar'

export default function ResponsiveTestPage() {
  const [width, setWidth] = useState(768)

  return (
    <div className="p-8">
      <div className="mb-4">
        <label>
          Container Width: {width}px
          <input
            type="range"
            min="320"
            max="1440"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      <div
        className="@container/app border-2 border-blue-500 mx-auto"
        style={{ width: `${width}px` }}
      >
        <TemplatesSidebar />
      </div>
    </div>
  )
}
```

---

### 2. Document Container Conventions

Create `CONTAINER_CONVENTIONS.md`:

```md
# Container Query Conventions

## Naming
- Use semantic names: `/app`, `/sidebar`, `/canvas`, `/toolbar`
- Prefix with component name for clarity: `/emailBlock`, `/templateCard`

## Breakpoints
- Mobile: 0-639px (base)
- Tablet: 640-1023px (@sm, @md)
- Desktop: 1024px+ (@lg, @xl)

## Nesting
- Maximum 3 levels deep
- Document hierarchy in component comments

## Performance
- Use `inline-size` over `size` when possible
- Avoid frequent boundary changes
- Use `content-visibility` for large containers
```

---

### 3. Add DevTools Helpers

Create utility for debugging container queries:

```tsx
// lib/dev-utils.ts
export function logContainerInfo(element: HTMLElement) {
  if (process.env.NODE_ENV !== 'development') return

  const computed = getComputedStyle(element)
  console.log({
    containerType: computed.containerType,
    containerName: computed.containerName,
    width: element.offsetWidth,
    height: element.offsetHeight,
  })
}

// Usage in components (dev only)
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    const element = ref.current
    if (element) logContainerInfo(element)
  }
}, [])
```

---

### 4. Progressive Enhancement Strategy

Start with mobile-friendly base, enhance for larger screens:

```tsx
// Mobile-first: Base styles work on all screens
<Button className="
  // Mobile: Full width, large touch target
  w-full h-12 text-base

  // Tablet: Inline, medium size
  @md:w-auto @md:h-10 @md:text-sm

  // Desktop: Small, compact
  @lg:h-9 @lg:text-xs
">
  Action
</Button>
```

---

### 5. Analytics & Monitoring

Track mobile usage and issues:

```tsx
// Track container size distribution
useEffect(() => {
  const observer = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width

    // Send to analytics
    analytics.track('container_resize', {
      component: 'editor',
      width,
      breakpoint: width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
    })
  })

  observer.observe(containerRef.current)
  return () => observer.disconnect()
}, [])

// Track mobile errors
window.addEventListener('error', (event) => {
  if (isMobileViewport()) {
    analytics.track('mobile_error', {
      message: event.message,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    })
  }
})
```

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Mobile Traffic**
   - Target: 40%+ of users on mobile devices
   - Current: Likely low due to poor mobile experience

2. **Mobile Bounce Rate**
   - Target: < 50%
   - Measure: After homepage loads

3. **Mobile Conversion**
   - Target: Create template from mobile
   - Measure: % of mobile users who create/edit templates

4. **Performance**
   - Mobile LCP: < 2.5s
   - Mobile FID: < 100ms
   - Mobile CLS: < 0.1

5. **Accessibility**
   - Lighthouse Accessibility Score: > 95
   - Touch target compliance: 100%

---

## Timeline Summary

| Phase | Duration | Components | Risk |
|-------|----------|------------|------|
| 1. Foundation | 1 week | All (container setup) | Low |
| 2. Homepage | 1 week | Sidebar, Grid, Header | Medium |
| 3. Editor Toolbar | 1 week | ToolbarLeft, ToolbarRight | Medium |
| 4. Settings Panel | 1-2 weeks | SettingsPanel, Bottom Sheet | High |
| 5. Block Toolbar | 1 week | BlockToolbar | Medium |
| 6. Polish | 1 week | Preview, misc | Low |
| 7. Testing | 1 week | All | Low |
| **Total** | **7-8 weeks** | | |

---

## Conclusion

This comprehensive plan provides a clear roadmap for implementing CSS container queries to make Ezero mobile-responsive. The incremental migration strategy allows for safe, tested deployment without breaking existing functionality. By leveraging Tailwind CSS 4's native container query support and following mobile-first best practices, the application will provide an excellent user experience across all device sizes.

### Key Takeaways

1. **Container queries enable component-driven responsive design** - Components adapt to their container, not the viewport
2. **Tailwind CSS 4 makes this easier** - Built-in support, no plugins needed
3. **SSR requires CSS-only solutions** - No JavaScript-based responsive logic
4. **Incremental migration is possible** - Can be done in phases over 7-8 weeks
5. **Mobile-first approach** - Start with mobile, enhance for desktop
6. **Testing is critical** - Real devices, accessibility, performance

### Next Steps

1. Review and approve this plan
2. Set up development environment with container query DevTools
3. Begin Phase 1: Foundation work
4. Create testing page for container query validation
5. Schedule weekly review meetings to track progress
6. Allocate resources for device testing
7. Plan rollout strategy (beta route, feature flags, A/B testing)

---

**Document Version**: 1.0
**Date**: October 7, 2025
**Author**: Claude Code Analysis
