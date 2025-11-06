# Folder Overview

This folder contains the Forms showcase page, demonstrating form input components including text inputs, textareas, selects, switches, checkboxes, and radio buttons. The showcase provides interactive examples, code snippets, and usage guidelines for building accessible forms.

## Purpose

This showcase serves as:
- **Form Component Reference**: Visual display of all input types and configurations
- **Usage Examples**: Code snippets showing how to use form components
- **Accessibility Guidelines**: Best practices for accessible form design
- **Interactive Testing**: Live examples for testing form behavior

## Components

### Form Input Types

- **Text Inputs**: Basic text inputs with various types (text, email, password, number, tel, url, search)
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection component
- **Switch**: Toggle switch component
- **Checkbox & Radio**: Selection inputs (native HTML styled)

### Showcase Structure

- `FormsShowcase.tsx`: Main showcase component
- `_elements/`:
  - `TextInputsShowcase.tsx`: Text input examples with types, states, icons
  - `TextareaShowcase.tsx`: Textarea examples
  - `SelectShowcase.tsx`: Select dropdown examples
  - `SwitchShowcase.tsx`: Switch toggle examples
  - `CheckboxRadioShowcase.tsx`: Checkbox and radio examples
  - `FormExamplesShowcase.tsx`: Complete form examples
  - `UsageGuidelinesShowcase.tsx`: Form usage guidelines
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Basic Form Input

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### Form with Validation

Always pair inputs with labels and provide error states:
- Use `Label` component for accessibility
- Show error messages when validation fails
- Use helper text for additional context

## File Location

- Components: `src/components/ui/` (input, label, select, etc.)
- Showcase: `src/app/dashboard/ui/forms/_components/`
- Documentation: This file

## Dependencies

- `@/components/ui/input` - Input component
- `@/components/ui/label` - Label component
- `@/components/ui/select` - Select component
- `@/components/ui/switch` - Switch component
- Radix UI primitives for accessibility

## Best Practices

- Always use labels for form inputs
- Provide clear error messages
- Use appropriate input types for better UX
- Consider mobile keyboard types
- Test form accessibility with screen readers

