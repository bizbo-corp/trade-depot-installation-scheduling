# ShadCN UI Setup

## Overview

This document outlines the ShadCN UI components and dark mode setup for the Bizbo Brochure project.

## Installed Components

### Core UI Components

1. **Alert Dialog** - Modal dialogs for critical confirmations
2. **Badge** - Status indicators and labels
3. **Button** - Primary button component with variants
4. **Card** - Container component for content sections
5. **Command** - Command palette component (can be used as Combobox)
6. **Dialog** - Modal dialog component
7. **Dropdown Menu** - Contextual menu for actions
8. **Form** - Form handling with react-hook-form
9. **Input** - Text input component
10. **Label** - Form label component
11. **Navigation Menu** - Navigation component with submenus
12. **Popover** - Floating content overlay
13. **Progress** - Progress indicator component
14. **Radio Group** - Radio button group component
15. **Select** - Select dropdown component
16. **Skeleton** - Loading placeholder component
17. **Sonner (Sonar)** - Toast notifications component
18. **Tabs** - Tab navigation component
19. **Textarea** - Multi-line text input component

### Theme Components

- **ThemeProvider** - Dark mode provider using next-themes
- **ThemeToggle** - Dropdown menu to switch between light, dark, and system themes

## Dependencies

### UI Framework Dependencies

- **@radix-ui/react-alert-dialog**
- **@radix-ui/react-dialog**
- **@radix-ui/react-dropdown-menu**
- **@radix-ui/react-label**
- **@radix-ui/react-navigation-menu**
- **@radix-ui/react-popover**
- **@radix-ui/react-progress**
- **@radix-ui/react-radio-group**
- **@radix-ui/react-select**
- **@radix-ui/react-slot**
- **@radix-ui/react-tabs**

### Utility Dependencies

- **class-variance-authority** - Component variant management
- **clsx** - Conditional class names
- **cmdk** - Command palette library
- **lucide-react** - Icon library
- **next-themes** - Theme switching
- **sonner** - Toast notifications
- **tailwind-merge** - Tailwind class merging
- **react-hook-form** - Form handling
- **@hookform/resolvers** - Form validation resolvers
- **zod** - Schema validation

## Configuration Files

### components.json

ShadCN configuration file specifying:
- Style: default
- RSC: enabled
- TSX: enabled
- Tailwind config: tailwind.config.ts
- CSS file: app/globals.css
- Path aliases configured for components, utils, ui, lib, and hooks

### app/globals.css

Contains CSS variables for theming:
- Light theme variables
- Dark theme variables
- Sidebar-specific variables
- All variables in OKLCH colour space

## Dark Mode Implementation

### Setup

1. **ThemeProvider** wraps the app in `app/layout.tsx`
2. **ThemeToggle** component provides a dropdown to switch themes
3. Supports three modes:
   - Light
   - Dark
   - System (follows OS preference)

### Usage

To add the theme toggle to a page:

```tsx
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  return (
    <div>
      <ThemeToggle />
      {/* Your content */}
    </div>
  )
}
```

## Component Usage Examples

### Button

```tsx
import { Button } from "@/components/ui/button"

<Button>Click me</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Toast Notifications (Sonner)

```tsx
import { toast } from "sonner"

// In your component
toast.success("Success message")
toast.error("Error message")
toast("Default message")
```

### Form

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Notes

1. **Field Input Group**: The requested "Field Input Group" component doesn't exist as a standalone component in ShadCN. Instead, this is achieved using the **Form** component with **FormField**, **FormItem**, **FormLabel**, and **FormControl** components together.

2. **Combobox**: The requested "Combobox" component uses the **Command** and **Popover** components together to create a searchable select dropdown.

3. **Sonar vs Toast**: The ShadCN toast component is deprecated. **Sonner** is the recommended replacement and has been installed.

4. **Build Compatibility**: All components have been tested and the project builds successfully with no errors.

## Next Steps

To add more ShadCN components:

```bash
npx shadcn@latest add [component-name]
```

Common additional components you might want:
- Avatar
- Checkbox
- Separator
- Switch
- Table
- Tooltip
- Scroll Area
- Sheet (Sidebar)

## References

- [ShadCN UI Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Next Themes Documentation](https://github.com/pacocoursey/next-themes)
- [Sonner Documentation](https://sonner.emilkowal.ski/)













