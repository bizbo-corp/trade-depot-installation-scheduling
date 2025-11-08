# Conversation Summary: Purpose Framework Page

## Project Context
- **Project**: Bizbo brochure website
- **Framework**: Next.js with React/TypeScript
- **Styling**: Tailwind CSS
- **File**: `app/purpose-framework/page.tsx`

## Page Structure Overview

### Main Layout (Three Responsive Variants)

**Wide Layout (2xl breakpoint and above, ~1536px+)**:
- **Main Container**: `flex-row` (sections side by side)
- **Section A (Left)**: 61.8% width - Main content area with purpose wheel
- **Section B (Right)**: 38.2% width - Sidebar with two sub-sections
  - **Section C**: "How to get there" (top, 61.8% height within B)
  - **Section D**: "Foundations" (bottom, 38.2% height within B)

**Tall Layout (lg-xl breakpoints, ~1024px-1535px)**:
- **Main Container**: `flex-col` (sections stacked vertically)
- **Section A**: Full width, stacked above Section B
- **Section B**: Full width, with C and D in a `flex-row` (side by side)

**Skinny Layout (md and below, <1024px)**:
- **Main Container**: `flex-col` (sections stacked vertically)
- **Section A**: Full width, stacked above Section B
- **Section B**: Full width, with C and D in a `flex-col` (stacked vertically)

## Section A - Main Content Area

**Components**:
1. **Goals Section** (top):
   - Professional Goal (left) and Personal Goal (right)
   - Responsive: Uses `flex-1 min-w-0 max-w-[40%]` for scaling
2. **Purpose Wheel Section** (center):
   - Fixed size: `768px × 768px` (does not scale)
   - Contains 4 quadrants: Learn, Give, Create, Nurture
   - "Purpose" text centered in the middle
   - Passions displayed around the wheel (left and right sides)
3. **Three Layout Variants**:
   - **Wide (2xl+)**: Passions on left/right sides of wheel
   - **Tall (lg-xl)**: Passions above and below wheel in grid
   - **Skinny (md-)**: Passions above and below wheel, smaller spacing

## Section B - Sidebar (Right Column)

**Section C - "How to get there"**:
- Background: `bg-background-2`
- Grid: 3×2 grid of icons and labels:
  - Consistency, Kaizen, Planning & Task breakdown
  - Habits, Measure & monitor, Productivity & Prioritisation

**Section D - "Foundations"**:
- Background: `bg-background-3`
- Grid: 3×2 grid of icons and labels:
  - Growth mindset, Cultivate gratitude, Learning time
  - Keep it simple, Embrace imperfection, Beginners mind

## Golden Ratio Implementation

**Width Proportions (at 2xl)**:
- Section A: `flex-[618_1_0%]` = 61.8% of total width
- Section B: `flex-[382_1_0%]` = 38.2% of total width
- Ratio: 618:382 = 1.618:1 (Golden Ratio)

**Height Proportions within Section B (at 2xl)**:
- Section C: `flex-[1.618_1_0%]` = 61.8% of Section B height
- Section D: `flex-[1_1_0%]` = 38.2% of Section B height

## Critical Technical Details

### Width Constraint Fix
- Problem: `w-full` (width: 100%) conflicted with flex grow values
- Solution: Added `2xl:w-auto` to both Section A and B at 2xl breakpoint
- Result: Flex properties now control width distribution correctly

**Section A classes**: `w-full 2xl:w-auto 2xl:flex-[618_1_0%]`  
**Section B classes**: `w-full 2xl:w-auto 2xl:flex-[382_1_0%]`

### Responsive Flex Directions
- **Main Container**: `flex-col 2xl:flex-row`
- **Section B**: `flex-col lg:flex-row 2xl:flex-col`
  - Skinny/Tall: Column (C above D)
  - Tall: Row (C left, D right)
  - Wide: Column (C above D)

### Fixed Constraints
- Purpose Wheel: Fixed at `768px × 768px` (explicitly should NOT scale)
- Section B height at 2xl: Fixed at `h-[1144px]`
- No scrollbars should appear at any breakpoint

## Components Used

1. **PassionCard**: Reusable component for passion icons/labels
   - Responsive padding, icon sizes, text sizes
   - Used in Tall and Skinny layouts

2. **PurposeQuadrant**: Reusable component for wheel quadrants
   - Four positions: learn, give, create, nurture
   - Fixed dimensions within the wheel

3. **PurposeWheel**: SVG component (from `@/components/purpose-framework/PurposeWheel`)

4. **ThemeSwitcher**: Theme selector component

## Current State

- All responsive breakpoints implemented correctly
- Golden ratio proportions working at 2xl breakpoint
- Width conflicts resolved with `2xl:w-auto`
- Sections scale proportionally together
- Goals section made responsive (replaced fixed widths)
- Purpose text properly centered (replaced fixed positioning)
- Quadrant widths made responsive (use `w-full max-w-[228px]`)

## Debug IDs Added
The user has added temporary debug IDs and background colors:
- Main container: `id="purpose-framework"` with green background
- Section A: `id="purpose-framework-main"` with red background
- Section B: `id="purpose-framework-secondary"`

## Key Files
- **Main Page**: `app/purpose-framework/page.tsx`
- **Styles**: `app/globals.css`
- **Components**: `components/purpose-framework/` directory