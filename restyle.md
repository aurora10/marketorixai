# Constructief Bouw -- Visual Breakdown, Restyling & GSAP Animation Plan

# 1. Current Visual Style Analysis

## Overall Impression

The website feels: - Functional - Corporate - Straightforward -
Trust-oriented - Minimal animation

It prioritizes clarity over modern visual polish.

# 2. Current Style Breakdown

## Color Palette (Observed Style)

-   Primary: Dark blue / deep navy
-   Accent: Orange (construction tone)
-   Background: White
-   Text: Dark gray / near black
-   Secondary backgrounds: Light gray

## Typography

-   Sans-serif
-   Bold headers
-   Standard spacing
-   Limited hierarchy scaling

## Layout

-   Standard centered container
-   Grid-based cards
-   Equal section spacing
-   Limited visual depth

## Animation

-   Minimal
-   No motion hierarchy
-   Basic hover interactions

# 3. Why It Feels Dated

1.  Limited whitespace rhythm
2.  Static layout blocks
3.  No depth layers
4.  No motion identity
5.  Standard button styling
6.  Uniform section styling

# 4. Restyling Strategy

## Step 1 --- Increase Spacing System

Adopt 8px scale system.

Use: - py-24 / py-32 - gap-12 / gap-16 - Large hero spacing

Goal: Airy, confident layout.

## Step 2 --- Typography Upgrade

Hero: - 56--72px - Tight line-height - Slight negative tracking

Section titles: - 36--48px

Body: - 18px - line-height 1.6--1.8

Optional: Inter or Manrope variable font.

## Step 3 --- Introduce Depth

Cards: - border-radius: 16px - box-shadow: 0 10px 30px rgba(0,0,0,0.05)

Sections: - Subtle background tint alternation - Soft gradients

## Step 4 --- Modern Buttons

Add: - Larger padding - Hover lift (translateY -2px) - 300ms
transition - Subtle shadow growth

# 5. GSAP Animation Plan (Professional Structure)

## 5.1 Animation Philosophy

Goal: - Smooth - Confident - Slightly slow - Premium feel - Never flashy

Defaults: - Duration: 0.8 -- 1.2s - Ease: power3.out - Stagger: 0.1 --
0.15s

## 5.2 Project Structure

Create:

/lib/animations - config.ts - useGsap.ts - fadeUp.ts - staggerText.ts -
scrollReveal.ts - heroTimeline.ts

## 5.3 Global GSAP Config

config.ts: - Set default ease - Set default duration - Register
ScrollTrigger

## 5.4 Hero Animation Plan

Sequence: 1. Fade + slide up headline 2. Stagger subtext 3. Animate
buttons with slight delay 4. Optional background fade

Motion Rules: - y: 60 → 0 - opacity: 0 → 1 - stagger 0.12

## 5.5 Scroll Reveal System

Apply to all sections except hero.

Trigger: - start: top 85%

Animation: - y: 40 → 0 - opacity: 0 → 1 - duration: 1s

Cards: - Stagger 0.15

## 5.6 Card Hover Animation

On hover: - scale 1 → 1.03 - shadow increase - 250ms smooth ease

Optional micro tilt effect (subtle).

## 5.7 Button Hover Motion

Add micro interaction: - y: 0 → -2 - ease: power2.out - duration: 0.3

## 5.8 Page Transition (Optional Advanced)

Wrap layout with transition container.

On route change: - Fade old page out (0.4s) - Fade new page in (0.6s) -
Slight upward reveal

Only if premium feel is desired.

# 6. Implementation Order (Safe Migration Plan)

1.  Update spacing system
2.  Upgrade typography scale
3.  Refactor buttons
4.  Add depth to cards
5.  Implement hero animation
6.  Add scroll reveal system
7.  Add hover micro-interactions
8.  Optional: Add page transitions

# 7. Final Target Result

From: Static corporate recruitment site

To: Modern, confident, motion-polished recruitment platform

Visual traits: - Strong whitespace - Clear hierarchy - Smooth stagger
animations - Depth layers - Micro-interactions - Calm premium motion

END OF RESTYLE & GSAP PLAN
