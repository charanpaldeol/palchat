# Font Consistency Guide - PalChat Website

## 🎯 **Typography Standards**

### **Primary Font Family**
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Fallback**: System fonts (sans-serif)

### **Font Loading**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

## 📏 **Font Size Hierarchy**

### **Headings**
- **H1 (Main Title)**: `text-5xl lg:text-6xl font-bold` (3rem/3.75rem)
- **H2 (Section Title)**: `text-3xl font-bold` (1.875rem)
- **H3 (Subsection Title)**: `text-2xl font-bold` (1.5rem)
- **H4 (Card Title)**: `text-xl font-bold` (1.25rem)

### **Body Text**
- **Large Body**: `text-xl` (1.25rem) - Hero subtitles, important descriptions
- **Standard Body**: `text-base` (1rem) - Regular content, paragraphs
- **Small Body**: `text-sm` (0.875rem) - Captions, metadata

## 🎨 **Font Weight Standards**

### **Primary Weights**
- **Bold**: `font-bold` (700) - All headings, important text
- **Semibold**: `font-semibold` (600) - Subheadings, labels, buttons
- **Medium**: `font-medium` (500) - Navigation, secondary buttons
- **Regular**: `font-normal` (400) - Body text, descriptions

## 🌈 **Color Standards**

### **Text Colors**
- **Primary Text**: `text-gray-900` (#111827)
- **Secondary Text**: `text-gray-600` (#4B5563)
- **Muted Text**: `text-gray-500` (#6B7280)
- **Light Text**: `text-gray-400` (#9CA3AF)

### **Interactive Colors**
- **Primary Links**: `text-blue-600` (#2563EB)
- **Hover States**: `hover:text-blue-700` (#1D4ED8)
- **Active States**: `text-blue-800` (#1E40AF)

## 📐 **Spacing Standards**

### **Line Height**
- **Tight**: `leading-tight` (1.25) - Headings
- **Relaxed**: `leading-relaxed` (1.625) - Body text
- **Normal**: `leading-normal` (1.5) - Default

### **Margins & Padding**
- **Section Spacing**: `mb-8`, `mb-12`, `py-12`, `py-16`
- **Card Padding**: `p-8`, `p-10`
- **Element Spacing**: `mb-4`, `mb-6`, `gap-4`, `gap-6`

## 🎭 **Component-Specific Standards**

### **Navigation**
```css
/* Desktop Navigation */
font-medium text-gray-700 hover:text-gray-900
/* Active State */
text-blue-600 dark:text-blue-400
/* Logo */
text-xl font-bold text-gray-900
```

### **Buttons**
```css
/* Primary Button */
font-semibold text-lg px-8 py-4
/* Secondary Button */
font-semibold text-base px-6 py-3
/* CTA Button */
font-semibold text-lg px-8 py-4
```

### **Cards**
```css
/* Card Title */
text-2xl font-bold text-gray-900 mb-4
/* Card Content */
text-base text-gray-600 leading-relaxed
/* Card Meta */
text-base text-gray-500 font-medium
```

### **Forms**
```css
/* Form Labels */
text-base font-semibold text-gray-700 mb-3
/* Form Inputs */
text-base px-4 py-3 border-2 border-gray-300 rounded-xl
/* Form Buttons */
font-semibold text-lg px-8 py-4
```

## 🔧 **Implementation Examples**

### **Hero Section**
```html
<h1 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
  Main Title
</h1>
<p class="text-xl text-gray-600 mb-8 leading-relaxed">
  Hero subtitle with consistent styling
</p>
```

### **Section Headers**
```html
<h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
  Section Title
</h2>
<p class="text-lg text-gray-600 leading-relaxed">
  Section description
</p>
```

### **Card Components**
```html
<div class="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
  <h3 class="text-2xl font-bold text-gray-900 mb-4">Card Title</h3>
  <p class="text-gray-600 text-base leading-relaxed mb-6">
    Card content with consistent typography
  </p>
</div>
```

## ✅ **Consistency Checklist**

### **Before Publishing**
- [ ] All headings use `font-bold` weight
- [ ] All body text uses `text-base` size
- [ ] All interactive elements use `font-semibold`
- [ ] Colors follow the defined hierarchy
- [ ] Spacing is consistent across sections
- [ ] Line heights are appropriate for content type
- [ ] Mobile responsiveness is maintained

### **Common Issues to Avoid**
- ❌ Don't use `font-semibold` for main headings
- ❌ Don't mix different gray shades for similar content
- ❌ Don't use inconsistent padding/margins
- ❌ Don't forget `leading-relaxed` for body text
- ❌ Don't use different font sizes for similar elements

## 🚀 **Quick Reference**

| Element | Font Size | Weight | Color | Line Height |
|---------|-----------|--------|-------|-------------|
| H1 | `text-5xl lg:text-6xl` | `font-bold` | `text-gray-900` | `leading-tight` |
| H2 | `text-3xl` | `font-bold` | `text-gray-900` | `leading-tight` |
| H3 | `text-2xl` | `font-bold` | `text-gray-900` | `leading-tight` |
| Body | `text-base` | `font-normal` | `text-gray-600` | `leading-relaxed` |
| Labels | `text-base` | `font-semibold` | `text-gray-700` | `leading-normal` |
| Buttons | `text-lg` | `font-semibold` | `text-white` | `leading-normal` |

This guide ensures consistent typography across all pages and components of the PalChat website. 