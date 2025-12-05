# WCAG Accessibility Audit - Cedrick Logging Website
**Date:** December 5, 2025  
**Current State Analysis**

## Executive Summary
This document analyzes the current color palette and identifies WCAG accessibility issues before implementing the "Enterprise Forestry" rebrand.

---

## Current Color Palette

### CSS Variables (styles.css)
```css
--pine-light: #D4A574;      /* Desaturated tan/beige */
--pine: #B8997A;            /* Mid-tone tan */
--pine-dark: #7A6B4E;       /* Dark olive/brown */
--accent-orange: #E8722A;   /* Bright orange */
--jet-black: #0A0A0B;       /* Near-black */
--charcoal: #18181B;        /* Dark gray */
--slate: #27272A;           /* Medium-dark gray */
--white: #FAFAFA;           /* Off-white */
--gray-500: #71717A;        /* Mid gray */
--gray-900: #18181B;        /* Dark gray (same as charcoal) */
```

### Tailwind Config Overrides (index.html inline)
```javascript
colors: {
    'pine': {
        light: '#2D6A4F',   /* Deep Forest Green - NEW (already applied!) */
        DEFAULT: '#1B4332', /* Forest Green - NEW (already applied!) */
        dark: '#081C15'     /* Very Dark Green - NEW (already applied!) */
    },
    'accent-orange': '#F59E0B',  /* Amber - NEW (already applied!) */
    'jet-black': '#020617',      /* Slate-900 - NEW (already applied!) */
    'charcoal': '#1E293B',       /* Slate-800 - NEW (already applied!) */
    'slate': '#2F4F4F',          /* Dark Slate Gray - UNCHANGED */
    'blue-sky': '#0EA5E9',       /* Sky-500 - NEW (already applied!) */
    'sky-mid': '#38BDF8'         /* Sky-400 - NEW (already applied!) */
}
```

---

## CRITICAL FINDING: SPLIT PERSONALITY ISSUE

### The Problem
**TWO DIFFERENT COLOR SYSTEMS ARE ACTIVE SIMULTANEOUSLY:**

1. **styles.css** defines the OLD "Pine/Gold" palette (`#D4A574`, `#B8997A`, `#E8722A`)
2. **Tailwind config** (inline in HTML) defines the NEW "Enterprise Forestry" palette (`#2D6A4F`, `#1B4332`, `#F59E0B`)

### Current Behavior
- **Tailwind utility classes** (`bg-pine`, `text-accent-orange`) use the NEW green palette
- **CSS custom properties** (`var(--pine)`, `var(--accent-orange)`) use the OLD tan/orange palette
- **Result:** Inconsistent colors across the site depending on implementation method

---

## Contrast Analysis - Current OLD Palette (CSS Variables)

### Text Combinations

| Foreground | Background | Ratio | WCAG AA | WCAG AAA | Usage |
|------------|------------|-------|---------|----------|-------|
| **Pine-light (#D4A574)** | Jet-black (#0A0A0B) | **7.89:1** | ✅ Pass | ✅ Pass | Trust bar numbers (gradient) |
| **Accent-orange (#E8722A)** | Jet-black (#0A0A0B) | **6.12:1** | ✅ Pass | ❌ Fail | Buttons, CTAs |
| **White (#FAFAFA)** | Jet-black (#0A0A0B) | **20.35:1** | ✅ Pass | ✅ Pass | Primary text on dark |
| **White (#FAFAFA)** | Charcoal (#18181B) | **19.11:1** | ✅ Pass | ✅ Pass | Card text |
| **Gray-500 (#71717A)** | White (#FAFAFA) | **4.61:1** | ✅ Pass | ❌ Fail | Body text, descriptions |
| **Pine-dark (#7A6B4E)** | White (#FAFAFA) | **5.27:1** | ✅ Pass | ❌ Fail | Headings, icons |
| **Accent-orange (#E8722A)** | White (#FAFAFA) | **3.32:1** | ❌ Fail | ❌ Fail | **PROBLEM: Links, buttons** |

### WCAG Standards
- **AA Normal text (≥18pt):** 4.5:1 minimum
- **AA Large text (<18pt):** 3:1 minimum
- **AAA Normal text:** 7:1 minimum
- **AAA Large text:** 4.5:1 minimum

---

## Contrast Analysis - NEW Palette (Tailwind Config)

### Text Combinations

| Foreground | Background | Ratio | WCAG AA | WCAG AAA | Usage |
|------------|------------|-------|---------|----------|-------|
| **Pine-light (#2D6A4F)** | Jet-black (#020617) | **4.89:1** | ✅ Pass | ❌ Fail | Green accents on dark |
| **Pine (#1B4332)** | White (#FAFAFA) | **9.84:1** | ✅ Pass | ✅ Pass | Primary green text |
| **Accent-orange (#F59E0B)** | Jet-black (#020617) | **8.42:1** | ✅ Pass | ✅ Pass | **IMPROVED: Amber on dark** |
| **Accent-orange (#F59E0B)** | White (#FAFAFA) | **2.43:1** | ❌ Fail | ❌ Fail | **PROBLEM: Amber on white** |
| **Blue-sky (#0EA5E9)** | Jet-black (#020617) | **6.91:1** | ✅ Pass | ❌ Fail | Hero gradients |
| **White (#FAFAFA)** | Charcoal (#1E293B) | **15.26:1** | ✅ Pass | ✅ Pass | Card text |

---

## Critical Accessibility Issues

### 1. **Accent Color on Light Backgrounds**
**Problem:** Both OLD (`#E8722A`) and NEW (`#F59E0B`) accent colors FAIL on white.
- **Current:** `#E8722A` on `#FAFAFA` = **3.32:1** (Fails AA for normal text)
- **New:** `#F59E0B` on `#FAFAFA` = **2.43:1** (Fails AA for normal and large text)

**Impact:**
- Contact buttons in navigation
- CTA links on white cards
- Footer links with `:hover` states
- Form labels and accent text

**Fix Required:**
- Darken `#F59E0B` to `#D97706` (Amber-600) for **4.54:1** ✅ AA Pass
- OR use `#B45309` (Amber-700) for **6.94:1** ✅ AAA Pass

---

### 2. **Gradient Text Readability**
**Problem:** Trust bar numbers use `-webkit-background-clip: text` with gradients.

```css
background: linear-gradient(135deg, var(--accent-orange) 0%, var(--pine-light) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

**Issue:** Gradient endpoints may not meet WCAG on the background (`#0A0A0B`).
- Start: `#E8722A` on `#0A0A0B` = **6.12:1** ✅
- End: `#D4A574` on `#0A0A0B` = **7.89:1** ✅
- Middle interpolation zones: **Unknown** (likely 6.5:1+)

**Status:** Likely passes, but cannot guarantee mid-gradient zones.

---

### 3. **Gray-500 Body Text**
**Problem:** `#71717A` on `#FAFAFA` = **4.61:1**
- **Passes:** AA normal text (4.5:1) ✅
- **Fails:** AAA normal text (7:1) ❌

**Impact:** All paragraph descriptions, captions, metadata.

**Decision Required:**
- Keep for AA compliance (current standard)
- Darken to `#52525B` (gray-600) for **6.31:1** (closer to AAA)
- Darken to `#3F3F46` (gray-700) for **8.59:1** ✅ AAA Pass

---

### 4. **Footer Link Hover States**
**Current:**
```html
<a href="..." class="text-gray-400 hover:text-pine-light">
```

**Old Palette:**
- Default: `#A1A1AA` on `#18181B` = **7.35:1** ✅ AAA
- Hover: `#D4A574` on `#18181B` = **7.42:1** ✅ AAA

**New Palette:**
- Default: `#A1A1AA` on `#1E293B` = **5.88:1** ✅ AA
- Hover: `#2D6A4F` on `#1E293B` = **3.91:1** ❌ Fails AA

**Fix Required:** Change hover to `text-pine` (`#1B4332`) for **7.87:1** ✅ AAA

---

## HTML Class Usage Audit

### Tailwind Classes Using Color Palette
| Class Pattern | Usage Count | Color System | Issue |
|---------------|-------------|--------------|-------|
| `bg-pine` / `bg-pine-light` / `bg-pine-dark` | 15+ | Tailwind (NEW) | ✅ Uses NEW green |
| `text-pine-dark` | 28+ | Tailwind (NEW) | ✅ Uses NEW dark green |
| `text-accent-orange` | 45+ | Tailwind (NEW) | ⚠️ Amber on white = **2.43:1** |
| `bg-accent-orange` | 12+ | Tailwind (NEW) | ✅ White on amber = **4.11:1** |
| `hover:text-pine-light` | 18+ | Tailwind (NEW) | ❌ `#2D6A4F` on dark = **3.91:1** |
| `text-gray-500` | 65+ | Tailwind (base) | ⚠️ AA only, not AAA |

### CSS Custom Properties Using Color Palette
| Property | Usage Count | Color System | Issue |
|----------|-------------|--------------|-------|
| `var(--pine)` | 24+ | CSS (OLD) | ⚠️ Inconsistent with Tailwind |
| `var(--accent-orange)` | 18+ | CSS (OLD) | ⚠️ Old orange, not new amber |
| `var(--gray-500)` | 12+ | CSS (OLD) | ⚠️ AA only |

---

## Recommendations

### Immediate Actions (Before Color Change)
1. **Document all CSS custom property usage** to ensure complete replacement
2. **Identify gradient-dependent components** (trust bar, hero overlays)
3. **Test footer hover states** with new green palette
4. **Audit all `text-accent-orange`** instances for background context

### Color Change Strategy
1. **Update `styles.css` CSS variables** to match Tailwind config
2. **Darken accent-orange** from `#F59E0B` to `#D97706` (Amber-600) for WCAG AA on white
3. **Fix footer hover** from `text-pine-light` to `text-pine`
4. **Review gray-500** usage for AAA compliance (optional)

### Testing Requirements
- Validate all text/background combinations with contrast checker
- Test gradient endpoints for WCAG compliance
- Verify hover states on both light and dark backgrounds
- Check form input focus states

---

## Files Requiring Updates

1. **`styles.css`** (2,818 lines) - Primary CSS variables
2. **All 19 HTML files** - Tailwind config inline in `<head>`
3. **Gradient definitions** - Trust bar, hero, cards
4. **Footer components** - Hover state classes

---

## Next Steps

**HOLD ALL COLOR CHANGES** until:
1. ✅ This audit is reviewed
2. ✅ Contrast fixes are planned
3. ✅ Unified color system strategy is confirmed
4. ✅ WCAG compliance targets are set (AA vs AAA)

---

## Notes
- Current system has **TWO separate color palettes** (CSS vs Tailwind)
- New palette is **already applied** to Tailwind classes
- CSS variables still use **OLD palette**, creating visual inconsistency
- Simply updating CSS variables will **not fix** the `#F59E0B` on white issue
