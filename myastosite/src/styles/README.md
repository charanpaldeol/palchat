# Component CSS Structure

This directory contains all the CSS styles for the landing page components, organized for easy maintenance and customization.

## 📁 File Structure

```
src/styles/
├── components.css              # Main CSS import file
├── components/                 # Individual component styles
│   ├── hero-section.css       # Hero section styles
│   ├── vision-section.css     # Vision section styles
│   ├── mission-section.css    # Mission section styles
│   ├── values-section.css     # Values section styles
│   └── cta-section.css        # CTA section styles
└── README.md                  # This documentation
```

## 🎨 CSS Organization

### **Main Import File: `components.css`**
- Imports all component styles
- Contains global component utilities
- Provides consistent spacing and typography classes

### **Individual Component Files**
Each component has its own CSS file with:
- **Base styles** for the component structure
- **Dark mode support** with `.dark` selectors
- **Responsive design** with media queries
- **Interactive states** (hover, focus, etc.)
- **Color variants** for customization

## 🛠 **How to Customize Styles**

### **1. Modify a Specific Component**
To change styles for a specific component:

1. **Open the component's CSS file** (e.g., `hero-section.css`)
2. **Find the relevant class** (e.g., `.hero-title`)
3. **Make your changes** to colors, spacing, typography, etc.
4. **Save the file** - changes apply immediately

### **2. Add New Color Variants**
Each component supports color variants:

```css
/* In hero-section.css */
.hero-primary-button-blue {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.hero-primary-button-green {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}
```

### **3. Customize Dark Mode**
All components support dark mode:

```css
/* Light mode */
.component-title {
  color: #111827;
}

/* Dark mode */
.dark .component-title {
  color: #ffffff;
}
```

### **4. Add New Components**
To add a new component:

1. **Create CSS file**: `src/styles/components/new-component.css`
2. **Add import**: Add to `components.css`
3. **Create component**: Create `.astro` file in `src/components/`
4. **Use classes**: Apply CSS classes in the component

## 🎯 **Component-Specific Styles**

### **HeroSection**
- **Classes**: `.hero-section`, `.hero-title`, `.hero-subtitle`, `.hero-buttons`
- **Features**: Gradient backgrounds, responsive typography, button animations
- **Customization**: Title gradients, button colors, background patterns

### **VisionSection**
- **Classes**: `.vision-section`, `.vision-grid`, `.vision-item`, `.vision-icon-container`
- **Features**: Icon backgrounds, grid layouts, color-coded items
- **Customization**: Icon colors, grid layouts, spacing

### **MissionSection**
- **Classes**: `.mission-section`, `.mission-card`, `.mission-bullet-list`
- **Features**: Card layouts, bullet points, accent colors
- **Customization**: Card styles, bullet colors, background gradients

### **ValuesSection**
- **Classes**: `.values-section`, `.values-grid`, `.values-card`
- **Features**: Hover effects, grid layouts, color variants
- **Customization**: Card colors, hover animations, grid columns

### **CTASection**
- **Classes**: `.cta-section`, `.cta-buttons`, `.cta-primary-button`
- **Features**: Dark backgrounds, button animations, responsive layouts
- **Customization**: Background gradients, button styles, spacing

## 🌈 **Color System**

### **Primary Colors**
- **Blue**: `#2563eb` (Primary actions)
- **Green**: `#059669` (Success states)
- **Purple**: `#7c3aed` (Accent elements)
- **Red**: `#dc2626` (Error states)

### **Neutral Colors**
- **Light Gray**: `#f9fafb` (Backgrounds)
- **Medium Gray**: `#6b7280` (Text)
- **Dark Gray**: `#111827` (Headings)

### **Dark Mode Colors**
- **Background**: `#0f172a` (Primary), `#1e293b` (Secondary)
- **Text**: `#f1f5f9` (Primary), `#cbd5e1` (Secondary)

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### **Responsive Classes**
```css
/* Mobile first approach */
.component-title {
  font-size: 2rem; /* Mobile */
}

@media (min-width: 768px) {
  .component-title {
    font-size: 2.5rem; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .component-title {
    font-size: 3rem; /* Desktop */
  }
}
```

## 🔧 **Best Practices**

### **1. Naming Conventions**
- Use BEM methodology: `.component-element--modifier`
- Prefix component classes: `.hero-`, `.vision-`, `.mission-`
- Use semantic names: `.primary-button`, `.card-title`

### **2. Organization**
- Group related styles together
- Use comments to separate sections
- Keep specificity low for easy overrides

### **3. Performance**
- Use CSS custom properties for repeated values
- Minimize nested selectors
- Use efficient selectors (class over tag)

### **4. Maintainability**
- Keep styles modular and focused
- Use consistent spacing and typography
- Document complex animations or layouts

## 🚀 **Quick Customization Examples**

### **Change Hero Background**
```css
/* In hero-section.css */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### **Add New Button Style**
```css
/* In cta-section.css */
.cta-primary-button-outlined {
  background: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
}
```

### **Customize Card Hover**
```css
/* In values-section.css */
.values-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
```

## 📚 **Additional Resources**

- **CSS Custom Properties**: Use for theme colors and spacing
- **CSS Grid**: For complex layouts
- **Flexbox**: For alignment and spacing
- **CSS Animations**: For smooth interactions
- **Media Queries**: For responsive design

This structure makes it easy to maintain, customize, and extend your component styles while keeping everything organized and performant. 