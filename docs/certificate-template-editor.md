# Certificate Template Editor - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Components](#components)
4. [Data Structures](#data-structures)
5. [State Management](#state-management)
6. [Features](#features)
7. [Payload Structures](#payload-structures)
8. [User Interactions](#user-interactions)
9. [Styling & Theming](#styling--theming)
10. [Setup & Usage](#setup--usage)

---

## Overview

The Certificate Template Editor is an advanced visual editor for creating and customizing certificate templates. It allows users to:

- Upload certificate templates (images or PDFs)
- Place and position draggable text/data tags on the template
- Customize tag properties (font family, size, color, weight, opacity)
- Optionally add a draggable digital signature image with adjustable size, opacity, and rotation
- Preview the template with sample values
- Use a grid overlay for precise alignment
- Edit positions with both mouse drag and keyboard arrow keys

**Technology Stack:**
- React + Next.js (TypeScript)
- Framer Motion (animations, drag-and-drop)
- Radix UI (accessible components)
- Tailwind CSS (styling)
- Sonner (toast notifications)

---

## Architecture

### High-Level Flow

```
AddCertificatePanel (Main Side Panel)
    ├── State Management (tagPositions, signatureState, gridVisible, etc.)
    ├── File Upload & Preview
    ├── Digital Signature (optional toggle + upload)
    ├── Editor Controls Toolbar
    ├── Preview Container
    │   ├── GridOverlay (visual grid)
    │   ├── CertificatePreviewTags (draggable tags)
    │   ├── DraggableSignature (optional draggable image)
    │   └── TagPropertiesPanel / SignaturePropertiesPanel
    └── Expanded Preview Modal (full-screen editor)
        ├── Minimal Header
        ├── Unified Toolbar
        ├── Preview Area (always visible)
        │   └── DraggableSignature (if enabled)
        └── Properties Sidebar (always in-flow)
```

### File Structure

```
components/certificate-management/modals/
├── certificate-editor-shared.tsx      (shared types, constants, components)
├── AddCertificatePanel.tsx             (main panel with file upload)
├── ExpandedPreviewModal.tsx            (full-screen editor modal)
└── index.ts                            (exports)
```

---

## Components

### 1. **AddCertificatePanel.tsx** (~520 lines)

**Purpose:** Main side panel for creating certificate templates

**Key Props:**
```typescript
interface AddCertificatePanelProps {
  isOpen: boolean;          // Panel visibility state
  onClose: () => void;      // Callback to close panel
}
```

**Key State:**
- `isDirty` — unsaved changes flag
- `showDiscardModal` — confirmation modal visibility
- `previewUrl` — data URL of uploaded template
- `fileType` — MIME type ('image/png', 'image/jpeg', 'image/webp', 'application/pdf')
- `selectedFileName` — displayed file name
- `tagPositions` — position & properties of all tags
- `isExpandedPreviewOpen` — expanded modal visibility
- `selectedTag` — currently selected tag key
- `signatureState` — digital signature configuration (enabled, imageUrl, position, size, opacity, rotation)
- `isSignatureSelected` — whether the signature element is currently selected for editing
- `snapEnabled` — align-to-grid toggle
- `gridVisible` — grid overlay toggle
- `gridDensity` — grid granularity (1-20)
- `showSampleValues` — preview mode toggle
- `imageAspectRatio` — natural aspect ratio of uploaded image

**Key Features:**
- File upload (PNG, JPEG, WebP, PDF)
- Digital signature section (optional toggle + image upload)
- Editor controls toolbar (toggles for grid, snap, preview)
- Grid density selector (10 options)
- Tag quick-select chips (including Signature chip when enabled)
- Inline tag properties panel / signature properties panel
- Reset positions button

**Animations:**
- Side panel slides in from right (`x: 100% → 0`)
- Backdrop fades in (`opacity: 0 → 1`)

---

### 2. **ExpandedPreviewModal.tsx** (~280 lines)

**Purpose:** Full-screen modal for detailed template editing

**Key Props:**
```typescript
interface ExpandedPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewUrl: string;
  tagPositions: TagPositions;
  onPositionChange: (key: string, x: number, y: number) => void;
  onTagUpdate: (key: string, updates: Partial<TagState>) => void;
  onResetPositions: () => void;
  selectedTag: string | null;
  onSelectTag: (key: string | null) => void;
  snapEnabled: boolean;
  onSnapChange: (v: boolean) => void;
  gridVisible: boolean;
  onGridVisibleChange: (v: boolean) => void;
  gridDensity: number;
  onGridDensityChange: (v: number) => void;
  showSampleValues: boolean;
  onShowSampleValuesChange: (v: boolean) => void;
  // Signature
  signatureState: SignatureState;
  onSignaturePositionChange: (x: number, y: number) => void;
  onSignatureUpdate: (updates: Partial<SignatureState>) => void;
  onRemoveSignatureImage: () => void;
  onSignatureUploadClick: () => void;
  isSignatureSelected: boolean;
  onSelectSignature: () => void;
  onDeselectSignature: () => void;
}
```

**Layout:**
- **Header** (minimal): Title + Close button
- **Toolbar** (unified): Grid/Snap/Preview toggles, Density selector (when grid on), Reset button
- **Body**:
  - Preview area (always visible, left side)
  - Properties sidebar (right side, always in-flow, never overlays image)

**Key Features:**
- Unified toolbar for all screen sizes with flex-wrap
- Properties panel is part of the flex row (doesn't cover preview)
- Supports both tag and signature properties panels
- Sticky sidebar header for easy navigation
- Tag quick-select chips in properties panel (includes Signature chip)
- Smooth animations (spring for panel, ease for tags)

**Animations:**
- Properties panel: Spring animation (`opacity: 0 → 1`, `x: 60 → 0`)
- Footer tag chips: Ease-out fade & slide up (`opacity: 0 → 1`, `y: 12 → 0`)

---

### 3. **certificate-editor-shared.tsx** (~1100 lines)

**Purpose:** All shared types, constants, and reusable components

#### Key Constants:

**Font Families:**
```typescript
FONT_FAMILY_OPTIONS = [
  // Sans-serif: Inter, Arial, Verdana, Trebuchet MS, Helvetica
  // Serif: Georgia, Times New Roman, Palatino, Garamond, Book Antiqua
  // Cursive: Brush Script, Lucida Handwriting, Segoe Script, Palace Script, etc.
  // Display: Copperplate, Papyrus, Impact
  // Monospace: Courier New, Consolas
]
```

**Grid & Colors:**
```typescript
GRID_DENSITY_OPTIONS = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  // ... up to 20
]

DRAGGABLE_TAGS = [
  { key: 'student_name', label: 'Student Name' },
  { key: 'course_name', label: 'Course Name' },
  // ... more tags
]

COLORS = {
  pink600: '#E60076',    // Primary
  pink500: '#F6339A',
  slate100: '#F1F5F9',
  slate400: '#94A3B8',
  // ... more colors
}
```

**Nudge Steps:**
```typescript
NUDGE_STEP = 0.5           // % per arrow key
NUDGE_STEP_SHIFT = 5       // % with Shift + arrow key
```

#### Key Types:

```typescript
interface TagState {
  x: number;                    // X position (% of container)
  y: number;                    // Y position (% of container)
  sampleValue: string;          // Preview text
  properties: TagProperties;    // Font, color, etc.
}

interface TagProperties {
  fontSize: number;             // em
  fontColor: string;            // hex color
  fontFamily: string;           // font name
  fontWeight: 'normal' | 'bold' | '600' | '700';
  opacity: number;              // 0-1
}

type TagPositions = Record<string, TagState>;

interface SignatureState {
  enabled: boolean;               // Whether signature is active
  imageUrl: string | null;        // Data URL of uploaded signature image
  x: number;                      // X position (% of container)
  y: number;                      // Y position (% of container)
  width: number;                  // Width as % of container width
  opacity: number;                // 0-100
  rotation: number;               // Degrees (-180 to 180)
}

interface GridDensityOption {
  value: number;
  label: string;
}
```

#### Key Components:

**ToggleSwitch:**
```typescript
interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}
```

**GridOverlay:**
- Renders CSS grid pattern behind tags
- Density controlled via density prop

**CertificatePreviewTags:**
- Renders all draggable tags
- Handles position changes and snap-to-grid
- Supports arrow key movement, +/- button adjustment

**DraggableTag:**
- Individual tag with framer-motion drag
- Supports arrow keys, click selection
- Click-outside to deselect

**TagPropertiesPanel:**
- Font family selector (Radix Select with grouped fonts)
- Font size, color, weight, opacity inputs
- X/Y position inputs with +/- adjuster buttons

**DraggableSignature:**
- Renders uploaded signature image as draggable overlay
- Supports arrow keys, click selection, snap-to-grid
- Scales proportionally with containerWidth like DraggableTag
- Only visible when `signatureState.enabled && signatureState.imageUrl`

**SignaturePropertiesPanel:**
- Upload / Replace / Remove signature image buttons
- X/Y position inputs with +/- adjusters
- Width slider (5%–50% of container)
- Rotation slider (-180° to 180°)
- Opacity slider (10%–100%)
- Tip: recommends PNG with transparent background

---

## Data Structures

### TagState Structure

```typescript
{
  student_name: {
    x: 50,                          // 50% from left
    y: 30,                          // 30% from top
    sampleValue: "John Doe",
    properties: {
      fontSize: 2,                  // em units
      fontColor: "#000000",
      fontFamily: "Georgia",
      fontWeight: "bold",
      opacity: 1
    }
  },
  course_name: {
    x: 50,
    y: 55,
    sampleValue: "Web Development 101",
    properties: {
      fontSize: 1.5,
      fontColor: "#1a1a1a",
      fontFamily: "Inter",
      fontWeight: "600",
      opacity: 0.95
    }
  }
  // ... more tags
}
```

### Signature Data Structure

```typescript
{
  enabled: true,
  imageUrl: "blob:https://example.com/sig123...",
  x: 70,           // 70% from left
  y: 85,           // 85% from top
  width: 15,       // 15% of container width
  opacity: 100,    // fully opaque
  rotation: 0      // no rotation
}
```

### Image Data Structure

```typescript
{
  previewUrl: "blob:https://example.com/abc123...",
  fileType: "image/png",
  selectedFileName: "certificate_template.png",
  imageAspectRatio: 1.414                        // width/height
}
```

### Grid Settings

```typescript
{
  gridVisible: true,
  gridDensity: 10,              // Controls granularity
  snapEnabled: true             // Snap positions to grid
}
```

---

## State Management

### AddCertificatePanel State Flow

```
User Action → State Update → Child Component Re-render → Visual Update
```

**Key State Updates:**

1. **File Upload:**
   ```
   handleFileChange
   → setSelectedFileName(file.name)
   → setFileType(file.type)
   → setPreviewUrl(objectUrl)
   → setImageAspectRatio(null)  // reset, will be set on image load
   → markDirty()
   ```

2. **Position Change (drag/arrow/button):**
   ```
   onPositionChange(key, x, y)
   → setTagPositions(prev => ({
       ...prev,
       [key]: { ...prev[key], x, y }
     }))
   → markDirty()
   ```

3. **Property Update (font, color, etc.):**
   ```
   onTagUpdate(key, updates)
   → setTagPositions(prev => ({
       ...prev,
       [key]: {
         ...prev[key],
         properties: { ...prev[key].properties, ...updates.properties }
       }
     }))
   → markDirty()
   ```

4. **Reset:**
   ```
   handleResetPositions()
   → setTagPositions(DEFAULT_TAG_POSITIONS)
   → setSelectedTag(null)
   → setSignatureState(reset position/width/opacity/rotation to defaults)
   → setIsSignatureSelected(false)
   → markDirty()
   → toast('Tag positions reset')
   ```

5. **Signature Toggle:**
   ```
   onToggleSignature(enabled)
   → setSignatureState(prev => ({ ...prev, enabled }))
   → if (!enabled) setIsSignatureSelected(false)
   → markDirty()
   ```

6. **Signature Image Upload:**
   ```
   handleSignatureFileChange(e)
   → validate file type (image/*)
   → setSignatureState({ imageUrl: objectUrl, enabled: true })
   → markDirty()
   ```

7. **Signature Position / Property Change:**
   ```
   handleSignatureUpdate(updates)
   → setSignatureState(prev => ({ ...prev, ...updates }))
   → markDirty()
   ```

---

## Features

### 1. Drag & Drop

**Implementation:**
- Framer Motion `motion.div` with `drag` prop
- `useMotionValue` for X/Y offset tracking
- `useLayoutEffect` + `pendingResetRef` to reset position each drag start (zero-frame reset)
- `PanInfo.point.x/y` for accurate pointer tracking

**Snap to Grid:**
```typescript
const snappedX = snapEnabled ? Math.round(x / gridStep) * gridStep : x;
const snappedY = snapEnabled ? Math.round(y / gridStep) * gridStep : y;
```

**Grid Step Calculation:**
```typescript
const gridStep = 100 / gridDensity;  // 100/10 = 10% per grid cell
```

### 2. Keyboard Navigation

**Arrow Keys:**
- ArrowUp: y -= NUDGE_STEP (0.5%)
- ArrowDown: y += NUDGE_STEP (0.5%)
- ArrowLeft: x -= NUDGE_STEP (0.5%)
- ArrowRight: x += NUDGE_STEP (0.5%)
- Shift + Arrow: Use NUDGE_STEP_SHIFT (5%) instead

**Implementation:**
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (!selectedTag) return;
  
  const step = e.shiftKey ? NUDGE_STEP_SHIFT : NUDGE_STEP;
  let deltaX = 0, deltaY = 0;
  
  switch (e.key) {
    case 'ArrowUp': deltaY = -step; break;
    case 'ArrowDown': deltaY = step; break;
    case 'ArrowLeft': deltaX = -step; break;
    case 'ArrowRight': deltaX = step; break;
  }
  
  if (deltaX || deltaY) {
    e.preventDefault();
    const newX = Math.round((x + deltaX) * 100) / 100;
    const newY = Math.round((y + deltaY) * 100) / 100;
    onPositionChange(selectedTag, newX, newY);
  }
};
```

### 3. Grid Overlay

**Visual Grid:**
- CSS Grid pattern behind tags
- Line width: 1px
- Color: `#E2E8F0` (slate-200)
- Density: Adjustable 5-20 options

**Implementation:**
```typescript
function GridOverlay({ visible, density }) {
  if (!visible) return null;
  
  const gridSize = 100 / density;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(0deg, #E2E8F0 1px, transparent 1px),
          linear-gradient(90deg, #E2E8F0 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}% ${gridSize}%`
      }}
    />
  );
}
```

### 4. Preview Mode

**Sample Values:**
- Each tag has a `sampleValue` string
- When `showSampleValues` is true, displays sample instead of placeholder text
- Useful for visualizing final output

### 5. Responsive Layout

**Mobile (`< sm`):**
- Side panel takes full width
- Toolbar items wrap with `flex-wrap`
- Expand Preview button hidden

**Tablet (`sm` - `lg`):**
- Side panel 540px max-width
- Toolbar wraps intelligently
- Expand Preview button visible (primary pink color)
- Properties panel always visible

**Desktop (`lg+`):**
- Side panel 540px width
- Expanded modal shows properties as right sidebar
- All controls visible

### 6. Digital Signature (Optional)

**Feature overview:**
- Toggle on/off via switch in the "Digital Signature" section
- Upload a signature image (PNG with transparent background recommended)
- Signature appears as a draggable overlay on the certificate preview
- Adjustable properties: position (x/y), width, rotation, opacity
- Signature chip appears in quick-select chips when enabled
- Properties panel shows upload/replace/remove + all adjusters
- Arrow keys work for nudging the signature too
- Scales proportionally with the preview container

---

## Payload Structures

### 1. Certificate Creation Payload

**Endpoint:** `POST /api/certificates`

```json
{
  "name": "Web Development Certificate",
  "price": 5000,
  "templateFile": "blob:...",
  "fileType": "image/png",
  "tagPositions": {
    "student_name": {
      "x": 50,
      "y": 30,
      "sampleValue": "John Doe",
      "properties": {
        "fontSize": 2,
        "fontColor": "#000000",
        "fontFamily": "Georgia",
        "fontWeight": "bold",
        "opacity": 1
      }
    },
    "course_name": {
      "x": 50,
      "y": 55,
      "sampleValue": "Web Development 101",
      "properties": {
        "fontSize": 1.5,
        "fontColor": "#1a1a1a",
        "fontFamily": "Inter",
        "fontWeight": "600",
        "opacity": 0.95
      }
    },
    "date_issued": {
      "x": 70,
      "y": 85,
      "sampleValue": "2026-03-05",
      "properties": {
        "fontSize": 1,
        "fontColor": "#666666",
        "fontFamily": "Arial",
        "fontWeight": "normal",
        "opacity": 0.8
      }
    }
  },
  "signature": {
    "enabled": true,
    "x": 70,
    "y": 85,
    "width": 15,
    "opacity": 100,
    "rotation": 0,
    "signatureFile": "<binary file upload>"
  }
}
```

### 2. Tag Position Update Payload

**Endpoint:** `PATCH /api/certificates/:id/tags/:tagKey`

```json
{
  "x": 52.5,
  "y": 31.25
}
```

### 3. Tag Properties Update Payload

**Endpoint:** `PATCH /api/certificates/:id/tags/:tagKey/properties`

```json
{
  "fontSize": 2.5,
  "fontColor": "#E60076",
  "fontFamily": "Georgia",
  "fontWeight": "bold",
  "opacity": 0.95
}
```

### 4. Sample Value Update Payload

**Endpoint:** `PATCH /api/certificates/:id/tags/:tagKey/sample`

```json
{
  "sampleValue": "Jane Smith"
}
```

### 5. Batch Reset Payload

**Endpoint:** `POST /api/certificates/:id/reset-positions`

```json
{
  "templateId": "cert-123"
}
```

### 6. Template Fetch Payload

**Response:** `GET /api/certificates/:id`

```json
{
  "id": "cert-123",
  "name": "Web Development Certificate",
  "price": 5000,
  "templateUrl": "https://bucket.com/templates/cert-123.png",
  "fileType": "image/png",
  "imageAspectRatio": 1.414,
  "tagPositions": {
    "student_name": {
      "x": 50,
      "y": 30,
      "sampleValue": "John Doe",
      "properties": {
        "fontSize": 2,
        "fontColor": "#000000",
        "fontFamily": "Georgia",
        "fontWeight": "bold",
        "opacity": 1
      }
    }
    // ... more tags
  },
  "createdAt": "2026-03-05T10:30:00Z",
  "updatedAt": "2026-03-05T11:45:00Z"
}
```

---

## User Interactions

### Standard Workflow

1. **Open Panel** → Click "Create Certificate" or "Edit Template"
2. **Upload Template** → Click "Choose file", select image/PDF
3. **Select Tag** → Click on preview or use quick-select chips
4. **Optionally Add Signature** → Toggle "Digital Signature" on, upload image, drag to position
5. **Adjust Position**:
   - **Mouse:** Click + drag tag
   - **Arrow Keys:** Use Up/Down/Left/Right (Shift for larger steps)
   - **Buttons:** Click ±X/±Y buttons next to position inputs
5. **Customize Properties**:
   - Font family dropdown
   - Font size slider/input
   - Color picker
   - Font weight selector
   - Opacity slider
6. **Preview** → Toggle "Preview Values" to see sample text
7. **Expand View** → Click "Expand Preview" button (tablet/desktop)
8. **Reset** → Click "Reset All" to restore default positions (resets signature position too)
9. **Save** → Click "Create" button at bottom

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow Keys | Move selected tag (0.5% per step) |
| Shift + Arrow | Move selected tag (5% per step) |
| Escape | Deselect tag |
| Click Outside | Deselect tag (if not in drag mode) |

### Mobile vs Desktop

**Mobile:**
- No "Expand Preview" button
- All editing in side panel
- Properties panel always visible below preview
- Limited screen width (full width with max-width wrapper)

**Tablet:**
- "Expand Preview" button visible
- Can use modal for larger editing area
- Side panel 540px (may overflow screen)

**Desktop:**
- Full expanded modal with properties sidebar
- All controls visible
- Optimal for precise positioning

---

## Styling & Theming

### Theme Constants (theme.ts)

```typescript
export const COLORS = {
  // Primary (Pink)
  pink600: '#E60076',
  pink500: '#F6339A',
  
  // Neutrals (Slate)
  slate100: '#F1F5F9',
  slate400: '#94A3B8',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',
  
  // Functional
  error: '#DC2626',
  line: '#E2E8F0',
};

export const AUTH_INPUT = {
  base: 'h-10 text-sm rounded-md border-gray-300 focus-visible:ring-[#E60076]',
  placeholder: 'placeholder:text-[#90A1B9]',
};

export const BUTTON_STYLES = {
  primary: {
    full: 'bg-[#E60076] text-white hover:bg-[#F6339A]',
  }
};
```

### Component Classes

```tsx
// Input styling pattern
<Input className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)} />

// Color usage
className={`text-[${COLORS.slate900}]`}
className={`border-[${COLORS.line}]`}
className={`bg-[${COLORS.pink600}]`}

// Tailwind dynamic values
// Note: When using template literals, prefer backticks:
className={`bg-white border-l border-[${COLORS.line}]`}
// ✅ Correct: backticks for dynamic values
// ❌ Wrong: double quotes for dynamic values
```

### Animations

**Framer Motion:**
```typescript
// Side panel slide-in
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
transition={{ type: "spring", damping: 25, stiffness: 200 }}

// Properties panel
initial={{ opacity: 0, x: 60 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: 60 }}
transition={{ type: "spring", stiffness: 300, damping: 30 }}

// Tag chips fade-in + slide-up
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 12 }}
transition={{ ease: "easeOut", duration: 0.2 }}
```

---

## Setup & Usage

### Installation

```bash
# Already included in project
npm install framer-motion @radix-ui/react-dialog sonner
```

### Basic Implementation

```tsx
import { AddCertificatePanel } from '@/components/certificate-management/modals/AddCertificatePanel';

export function CertificateManagement() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsPanelOpen(true)}>
        Create Certificate
      </button>
      
      <AddCertificatePanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
}
```

### Customization

**Add New Tag Type:**

1. Update `DRAGGABLE_TAGS` in `certificate-editor-shared.tsx`:
   ```typescript
   {
     key: 'custom_field',
     label: 'Custom Field'
   }
   ```

2. Update `DEFAULT_TAG_POSITIONS`:
   ```typescript
   custom_field: {
     x: 50,
     y: 60,
     sampleValue: 'Sample Text',
     properties: { ... }
   }
   ```

**Change Grid Density Options:**

```typescript
GRID_DENSITY_OPTIONS = [
  { value: 5, label: '5' },
  { value: 8, label: '8' },
  // Custom densities
  { value: 15, label: '15' },
];
```

**Adjust Nudge Steps:**

```typescript
NUDGE_STEP = 1        // Change from 0.5%
NUDGE_STEP_SHIFT = 10 // Change from 5%
```

---

## Error Handling & Edge Cases

### File Upload Validation

```typescript
// Accepted file types
accept="image/png,image/jpeg,image/webp,.pdf"

// File size validation (implement if needed)
if (file.size > 10 * 1024 * 1024) { // 10MB
  toast.error('File too large');
  return;
}
```

### Unsaved Changes

```typescript
// Before closing, check isDirty flag
if (isDirty) {
  setShowDiscardModal(true);
  // User must confirm or go back to save
}
```

### Drag Boundary Constraints

```typescript
// Positions are clamped to 0-100%
const clampedX = Math.max(0, Math.min(100, x));
const clampedY = Math.max(0, Math.min(100, y));
```

### Grid Snap Rounding

```typescript
// Snap position to nearest grid line
const snappedPos = Math.round(position / gridStep) * gridStep;
```

---

## Performance Considerations

- **Memoization:** Use `useCallback` for event handlers to prevent unnecessary child re-renders
- **Drag Performance:** Framer Motion uses GPU-accelerated transforms (not affecting layout)
- **Image Aspect Ratio:** Calculated on image load, prevents layout shift
- **AnimatePresence:** Uses `initial={false}` to skip initial animation on mount
- **Portal Rendering:** Modals use createPortal to avoid stacking context issues

---

## Accessibility

- **Keyboard Navigation:** Arrow keys for position adjustment, Escape to deselect
- **ARIA Labels:** All buttons have title/aria-label attributes
- **Tab Order:** Maintained through tabIndex management
- **Focus Management:** Selected tags receive visual/keyboard focus
- **Color Contrast:** Theme colors meet WCAG AA standards
- **Semantic HTML:** Proper heading levels, button types, form labels

---

## Common Tasks

### Programmatically Select a Tag

```typescript
setSelectedTag('student_name');
```

### Update Preview Mode

```typescript
setShowSampleValues(true);  // Show sample values
```

### Change Grid Visibility

```typescript
setGridVisible(!gridVisible);
```

### Reset All Positions

```typescript
handleResetPositions();
// Resets to DEFAULT_TAG_POSITIONS
```

### Show Expanded Modal

```typescript
setIsExpandedPreviewOpen(true);
```

---

## Recent Updates (Turn 8+)

### Turn 8: Mobile Responsiveness & Layout Fix
- Properties panel changed from `absolute` overlay to always in-flow
- Toolbar unified across all screen sizes with `flex-wrap`
- Header simplified to title + close only
- Image never covered by properties panel

### Previous: Features Added
- Drag & drop positioning with framer-motion
- Arrow key movement (0.5% base, 5% with Shift)
- +/- quantity adjuster buttons for X/Y
- Font family selector (22 fonts in 5 groups)
- Color, weight, opacity, font size customization
- Grid overlay with adjustable density
- Snap-to-grid alignment
- Sample value preview mode
- Smooth animations (spring panel, ease chips)
- Image aspect ratio adaptation
- Radix UI Select for accessible dropdowns

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Select dropdown hidden by modal | zIndex: 99999999 on SelectContent |
| Tag not responding to arrow keys | Click tag first to select, ensure focus |
| Image doesn't adapt to aspect ratio | Check imageAspectRatio state on img onLoad |
| Positions not snapping to grid | Check snapEnabled flag |
| Properties overlay image (mobile) | Use static positioning, never absolute |
| Parse error with color template literals | Use backticks: `` `bg-[${COLORS.line}]` `` |

---

**Last Updated:** March 5, 2026  
**Component Version:** 4.0 (Digital Signature Support)
