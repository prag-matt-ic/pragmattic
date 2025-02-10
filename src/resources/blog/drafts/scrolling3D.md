---
title: 'Dynamic 2D-3D Hybrid Scrolling Site with React Three Fiber and GSAP'
date: '2020-01-01'
tags: 'parallax, js'
videoUrl: 'https://www.youtube.com/watch?v=1GGe3j59aKQ&t=4s'
---

In this mini-project we'll build a visually engaging 2D-3D hybrid scrolling site using **React Three Fiber** and **GSAP**. Our layout will feature 2D content and 3D spheres that move synchronously as the user scrolls, -creating an immersive experience only possible with 3D.

## Overview

1. **Project Setup**  
   I'm using Next.js 14. Configure the GSAP ScrollTrigger plugin to control animations on scroll.

2. **2D HTML Content Setup**  
   Structure HTML content for each section using Tailwind CSS. Animate 2D text elements to fade in as they enter the viewport.

3. **3D Scene and Animations**  
   Set up a Three.js canvas with environment lighting and a pointer-controlled camera. Implement a scrolling group with spheres that fade in and out as they align with the HTML content.

4. **Adding Interactive Elements**  
   Animate spheres using GSAP to appear and disappear as users scroll through the sections. Include links to recommended books, adding interactivity to the site’s content.

5. **Creating the Progress Bar**  
   Implement a progress bar that scales with the scroll position to indicate the user’s place on the page.

---

## Step-by-Step Implementation

### 1. Setting Up the Project

Start by installing the necessary dependencies to set up GSAP with React Three Fiber.

```javascript
// Install dependencies
// npm install @gsap/react @react-three/drei @react-three/fiber gsap
```

## 2D HTML Content Setup

Define the content model for each section.
In this examples each section features a heading, body text and optional url.
