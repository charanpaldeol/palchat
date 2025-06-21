# Landing Page Components

This directory contains reusable components for the landing page. Each component is self-contained and can be easily customized without affecting other sections.

## Components Overview

### 1. HeroSection.astro
The main hero section with customizable title, subtitle, and call-to-action buttons.

**Props:**
- `title` (string): Main headline (default: "Technology that serves humanity, not profit")
- `subtitle` (string): Supporting text (default: vision statement)
- `primaryButtonText` (string): Primary CTA button text (default: "Our Vision")
- `primaryButtonLink` (string): Primary button link (default: "#vision")
- `secondaryButtonText` (string): Secondary CTA button text (default: "Our Mission")
- `secondaryButtonLink` (string): Secondary button link (default: "#mission")

**Usage:**
```astro
<HeroSection 
  title="Custom Title"
  subtitle="Custom subtitle"
  primaryButtonText="Get Started"
  primaryButtonLink="/signup"
/>
```

### 2. VisionSection.astro
Displays the vision with customizable vision items and icons.

**Props:**
- `title` (string): Section title (default: "Our Vision")
- `subtitle` (string): Section description (default: vision description)
- `backgroundColor` (string): Background color classes (default: "bg-white dark:bg-gray-900")
- `visionItems` (array): Array of vision items with title, description, icon, iconColor, and bgColor

**Usage:**
```astro
<VisionSection 
  title="Custom Vision Title"
  visionItems={[
    {
      title: "Custom Vision",
      description: "Custom description",
      icon: "M...", // SVG path
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ]}
/>
```

### 3. MissionSection.astro
Shows the mission with customizable mission items and bullet points.

**Props:**
- `title` (string): Section title (default: "Our Mission")
- `subtitle` (string): Section description (default: mission description)
- `backgroundColor` (string): Background color classes (default: gradient background)
- `missionItems` (array): Array of mission items with title, description, bulletPoints, and accentColor

**Usage:**
```astro
<MissionSection 
  title="Custom Mission Title"
  missionItems={[
    {
      title: "Custom Mission",
      description: "Custom description",
      bulletPoints: ["Point 1", "Point 2"],
      accentColor: "bg-red-500"
    }
  ]}
/>
```

### 4. ValuesSection.astro
Displays core values in a grid layout.

**Props:**
- `title` (string): Section title (default: "Our Values")
- `subtitle` (string): Section description (default: "These core values guide everything we do.")
- `backgroundColor` (string): Background color classes (default: "bg-white dark:bg-gray-900")
- `cardBackgroundColor` (string): Card background color (default: "bg-gray-50 dark:bg-gray-800")
- `values` (array): Array of value objects with title and description

**Usage:**
```astro
<ValuesSection 
  title="Custom Values"
  values={[
    { title: "Custom Value", description: "Custom description" }
  ]}
/>
```

### 5. CTASection.astro
Call-to-action section with customizable buttons and styling.

**Props:**
- `title` (string): CTA title (default: "Join the Movement")
- `subtitle` (string): CTA description (default: "Be part of building a better digital future.")
- `primaryButtonText` (string): Primary button text (default: "Get Involved")
- `primaryButtonLink` (string): Primary button link (default: "/contact")
- `secondaryButtonText` (string): Secondary button text (default: "Learn More")
- `secondaryButtonLink` (string): Secondary button link (default: "/about")
- `backgroundColor` (string): Background color classes (default: dark gradient)

**Usage:**
```astro
<CTASection 
  title="Custom CTA"
  primaryButtonText="Sign Up"
  primaryButtonLink="/signup"
/>
```

## Benefits of Component-Based Structure

1. **Easy Maintenance**: Each section can be modified independently
2. **Reusability**: Components can be used on other pages
3. **Customization**: Props allow easy customization without code changes
4. **Consistency**: Maintains design consistency across sections
5. **Testing**: Each component can be tested in isolation
6. **Collaboration**: Different team members can work on different components

## Making Changes

### To modify a specific section:
1. Open the corresponding component file (e.g., `VisionSection.astro`)
2. Make your changes to the component
3. The changes will automatically apply to the index page

### To customize content without code changes:
1. Open `index.astro`
2. Pass custom props to the component
3. Example: `<VisionSection title="Custom Title" />`

### To add new sections:
1. Create a new component file
2. Import it in `index.astro`
3. Add it to the layout

## File Structure
```
src/components/
├── HeroSection.astro      # Main hero section
├── VisionSection.astro    # Vision display
├── MissionSection.astro   # Mission display
├── ValuesSection.astro    # Values grid
├── CTASection.astro       # Call to action
└── README.md             # This documentation
``` 