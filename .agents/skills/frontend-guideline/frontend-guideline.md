# B2B SaaS Frontend Guidelines

## 1. Architecture Principles
- Strictly adhere to the Next.js 14 App Router architecture.
- Use Server Components by default. Only separate the bottom-most node components that require user interaction (e.g., onClick, hooks) with the `"use client"` directive.
- Isolate state changes to prevent them from triggering re-renders of the entire layout.

## 2. Design & UI Principles
- Never overuse colors (avoid the "festival banner" design).
- Use only one Primary color (Blue-based) and one Secondary color.
- Express visual hierarchy for all other UI elements using only achromatic colors (White, Black, Gray 50~900) and spacing (Padding/Margin).
- Prioritize using the `lucide-react` library for all icons.

## 3. Code Conventions
- Use TypeScript and never allow the `any` type (Strict Typing).
- Clearly define parameter and return types for functions, and interface definitions for component Props.
- Write a 1-2 line comment at the very top of each file explaining its purpose.