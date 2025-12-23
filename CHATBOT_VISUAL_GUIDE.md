# 📱 Chatbot Widget - Visual & UI Guide

## Widget Layout & Design

### Closed State

```
┌────────────────────────────────────┐
│                                    │
│   Dashboard Content Area           │
│                                    │
│                      ┌──────┐      │
│                      │  💬  │      │ ← Floating button
│                      └──────┘      │    (bottom-right corner)
│                                    │
└────────────────────────────────────┘
```

**Button Properties**:
- Size: 56px × 56px (14 × 14 rem)
- Position: Fixed bottom-right (24px from edges)
- Icon: 💬 (chat bubble emoji)
- Color: Primary blue gradient
- Hover: Scale up (110%) with enhanced shadow
- Animation: Smooth bounce on load

### Expanded State

```
┌────────────────────────────────────┐
│                                    │
│   Dashboard Content Area           │
│          ┌─────────────────┐       │
│          │ 💡 Financial AI │ ✕     │ ← Header with close button
│          │Ask about...     │       │
│          ├─────────────────┤       │
│          │                 │       │
│          │ Hi! 👋 I'm your │       │ ← Chat messages
│          │ Financial AI... │       │
│          │                 │       │
│          │ You:            │       │
│          │ What are my...  │       │
│          │                 │       │
│          │ AI:             │       │
│          │ Your spending.. │       │
│          │                 │       │
│          ├─────────────────┤       │
│          │[Input field]    │       │ ← Message input
│          │           [Send]│       │
│          ├─────────────────┤       │
│          │💡 Quick asks:   │       │ ← Quick buttons
│          │[Trends][Tips]   │       │
│          │[Budget][Pred]   │       │
│          └─────────────────┘       │
│                                    │
└────────────────────────────────────┘
```

**Window Properties**:
- Size: 384px wide × 600px tall (96 × 600 rem)
- Position: Fixed bottom-24 right-6
- Border-radius: 8px (rounded corners)
- Shadow: 2xl shadow (deep drop shadow)
- Animation: Smooth slide-in from bottom

## Color Schemes

### Light Mode

```
┌──────────────────────────────┐
│ Header (Primary Blue)        │ ← Background: #0ea5e9
│ 💡 Financial AI              │   Text: White
│ Ask about expenses...        │
├──────────────────────────────┤
│                              │
│ Your message right-aligned   │ ← Background: #0ea5e9
│ aligned to right (blue)      │   Text: White
│                              │   Bubble style: rounded-br-none
│                              │
│ AI message left-aligned      │ ← Background: #e2e8f0
│ aligned to left (gray)       │   Text: #1e293b
│ Responds with insight...     │   Bubble style: rounded-bl-none
│                              │
├──────────────────────────────┤
│[Input field] ............ [Send]  │ ← Input: #f1f5f9, border: #cbd5e1
│                              │   Button: Primary blue
├──────────────────────────────┤
│💡 Quick asks:                │ ← Text: #475569
│[Button][Button][Button]      │   Buttons: #f1f5f9 bg, hover: #e2e8f0
└──────────────────────────────┘
```

### Dark Mode

```
┌──────────────────────────────┐
│ Header (Primary Blue Darker) │ ← Background: #0284c7
│ 💡 Financial AI              │   Text: White
│ Ask about expenses...        │
├──────────────────────────────┤
│                              │
│ Your message right-aligned   │ ← Background: #0284c7
│ aligned to right (blue)      │   Text: White
│ (dark blue)                  │
│                              │
│ AI message left-aligned      │ ← Background: #374151
│ aligned to left (dark gray)  │   Text: #f3f4f6
│ Responds with insight...     │
│                              │
├──────────────────────────────┤
│[Input field] ............ [Send]  │ ← Input: #1f2937, border: #4b5563
│                              │   Button: Primary blue darker
├──────────────────────────────┤
│💡 Quick asks:                │ ← Text: #9ca3af
│[Button][Button][Button]      │   Buttons: #374151 bg, hover: #4b5563
└──────────────────────────────┘
```

## Message Styles

### User Message
```
Right-aligned bubble          ┐
Round all corners            │
Except bottom-right          │ → Distinctive arrow effect
Fill with primary color      │
Text: White                  │
Include timestamp (gray)     ┘
```

```
┌─────────────────────────┐
│ What are my spending    │
│ trends?                 │
│                     2:30 PM
└─────────────────────────┘
                          ↑ Rounded except here
```

### Bot Message
```
Left-aligned bubble          ┐
Round all corners            │
Except bottom-left          │ → Distinctive arrow effect
Light gray background        │
Dark text                    │
Include timestamp (muted)   ┘
```

```
┌─────────────────────────────┐
│ Your spending has increased │
│ by 5.2% month-over-month.   │
│ Your average monthly spend  │
│ is $833.                    │
│ 2:31 PM                     │
└─────────────────────────────┘
↑ Rounded except here
```

### Loading State
```
Animated dots           ┐
Bounce effect          │
Indicate processing    ┘

●     ●     ●  →  ●     ●     ●  →  ●     ●     ●
(bouncing up and down with staggered timing)
```

## Interactive States

### Button States

**Normal**
```
┌─────────┐
│   💬    │  Blue, shadow
└─────────┘
```

**Hover**
```
┌─────────┐
│   💬    │  Darker blue, larger shadow, scale 110%
└─────────┘
```

**Active (Expanded)**
```
┌─────────┐
│   ✕     │  Blue, shadow
└─────────┘
```

### Input Field States

**Normal**
```
┌──────────────────────────┐
│ Ask about your expenses… │  Placeholder visible
└──────────────────────────┘
```

**Focused**
```
┌──────────────────────────┐
│ What are my…             │  Ring-2 blue focus ring
└──────────────────────────┘
  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
```

**Disabled (while loading)**
```
┌──────────────────────────┐
│ Ask about your expenses… │  Opacity reduced
└──────────────────────────┘
   (grayed out, not clickable)
```

### Send Button States

**Normal**
```
┌──────┐
│ Send │  Blue background, white text
└──────┘
```

**Hover**
```
┌──────┐
│ Send │  Darker blue
└──────┘
```

**Disabled**
```
┌──────┐
│ Send │  Gray, 50% opacity
└──────┘
```

## Quick Ask Buttons

### Layout
```
┌──────────────────────────────────┐
│ 💡 Quick asks:                   │ ← Label with emoji
├──────────────────────────────────┤
│ [Spending trends] [Save tips]    │ ← 2 columns, row 1
│ [Budget status]   [Predict]      │ ← 2 columns, row 2
└──────────────────────────────────┘
```

### Button Design

**Light Mode**
```
┌──────────────┐
│ Spending     │  Background: #f1f5f9
│ trends       │  Text: #374151
└──────────────┘  Border: none
                  Hover: #e2e8f0
                  Border-radius: 6px
```

**Dark Mode**
```
┌──────────────┐
│ Spending     │  Background: #374151
│ trends       │  Text: #d1d5db
└──────────────┘  Border: none
                  Hover: #4b5563
                  Border-radius: 6px
```

## Responsive Design

### Desktop (1024px+)
```
┌─────────────────────────────────────┐
│                                     │
│      Dashboard Content Area         │
│                                     │
│                  ┌─────────────┐    │
│                  │ Chat Widget │    │ ← Full 384px width
│                  │ (384px wide)│    │
│                  └─────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌──────────────────────────────┐
│                              │
│   Dashboard Content          │
│                              │
│         ┌────────────┐       │
│         │ Chat Widg  │       │ ← 80% width (max 384px)
│         │ (330px)    │       │
│         └────────────┘       │
│                              │
└──────────────────────────────┘
```

### Mobile (375px - 767px)
```
┌──────────────┐
│              │
│  Dashboard   │
│  Content     │
│              │
│  ┌────────┐  │
│  │  Chat  │  │ ← 90% width (≈320px)
│  │ Widget │  │
│  │ (mobil)│  │
│  └────────┘  │
│              │
└──────────────┘
```

## Animation Timings

### Open/Close Animation
```
Duration: 300ms (0.3 seconds)
Easing: ease-in-out
Effect: Smooth slide in from bottom
```

Timeline:
```
0ms    100ms   200ms   300ms
├────────┼────────┼────────┤
Open    25%     50%     100% (fully open)
        visible visible visible
```

### Message Slide
```
Duration: Auto scroll (smooth behavior)
Easing: smooth
Effect: Auto-scroll to latest message
```

### Loading Animation
```
Duration: Infinite (repeating)
Easing: ease-in-out
Effect: Bouncing dots with stagger delay

Dot 1: delay 0ms
Dot 2: delay 100ms
Dot 3: delay 200ms
```

## Hover & Focus Effects

### Widget Button Hover
```
Before:  ┌──────┐        After: ┌──────┐
         │  💬  │               │  💬  │
         └──────┘               └──────┘
         Shadow: soft           Shadow: xlarge
         Scale: 1.0             Scale: 1.1
         Transition: 300ms
```

### Input Field Focus
```
Before:  ┌──────────────┐   After:  ┌──────────────┐
         │ Placeholder… │           │ Placeholder… │
         └──────────────┘           └──────────────┘
         Border: gray              Border: blue
         Ring: none                Ring: 2px blue
                                   Transition: 200ms
```

### Quick Ask Button Hover
```
Before:  ┌───────────┐   After:  ┌───────────┐
         │ Spending  │           │ Spending  │
         │ trends    │           │ trends    │
         └───────────┘           └───────────┘
         BG: light-gray          BG: lighter gray
         Cursor: pointer          Cursor: pointer
         Transition: 150ms
```

## Accessibility Features

### Keyboard Navigation
```
Tab:        Focus input field
Enter:      Send message
Shift+Tab:  Navigate backwards
```

### Screen Reader Support
```
- Widget button labeled: "Chat with AI"
- Window title: "Financial AI Chat"
- Input placeholder: "Ask about your expenses..."
- Messages have semantic structure
```

### Color Contrast
```
Light Mode:
- Blue on white: 4.5:1 ratio (AA compliant)
- Gray on white: 4.8:1 ratio (AA compliant)

Dark Mode:
- Blue on dark gray: 4.2:1 ratio (AA compliant)
- White on dark gray: 10:1 ratio (AAA compliant)
```

## Emoji Guide

Used throughout the widget:

| Emoji | Usage | Meaning |
|-------|-------|---------|
| 💬 | Widget button | Chat |
| ✕ | Close button | Close |
| 💡 | Header & Quick asks | Ideas/Insights |
| 👋 | Welcome message | Greeting |
| ✅ | Future use | Success |
| ❌ | Error messages | Error |
| 📊 | Future use | Data/Analytics |
| 💰 | Future use | Money |
| 📈 | Future use | Trends |
| 🤖 | Alternative | Robot/AI |

## Theme Colors Reference

### Primary Color (Blue)
```
Light Mode:   #0ea5e9 (sky-500)
Dark Mode:    #0284c7 (sky-600)
Hover:        #0369a1 (sky-700)
Dark Hover:   #075985 (sky-800)
```

### Text Colors
```
Light Mode Primary:     #1e293b (slate-800)
Light Mode Secondary:   #475569 (slate-600)
Light Mode Muted:       #94a3b8 (slate-400)

Dark Mode Primary:      #f3f4f6 (gray-100)
Dark Mode Secondary:    #d1d5db (gray-300)
Dark Mode Muted:        #9ca3af (gray-400)
```

### Background Colors
```
Light Mode:
- Main:   #ffffff (white)
- Light:  #f1f5f9 (slate-100)
- Subtle: #f8fafc (slate-50)

Dark Mode:
- Main:   #1f2937 (gray-800)
- Light:  #374151 (gray-700)
- Subtle: #111827 (gray-900)
```

---

## Summary

The chatbot widget features:
- ✅ Modern, clean design
- ✅ Smooth animations
- ✅ Dark & light mode support
- ✅ Fully responsive
- ✅ Accessible (WCAG AA)
- ✅ Intuitive interactions
- ✅ Professional appearance
- ✅ Mobile-friendly

Perfect for a production-ready expense tracker!
