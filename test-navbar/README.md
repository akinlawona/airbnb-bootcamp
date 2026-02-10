# Animated Scroll Navbar - Airbnb Style

This folder contains test implementations of an animated navbar that transforms on scroll, similar to Airbnb's website.

## 🎯 Features

- **Smooth transitions** between expanded and compact states
- **Scroll-triggered animations** that activate at a configurable threshold
- **Responsive design** that works on all screen sizes
- **Performance optimized** with passive scroll listeners
- **Easy to integrate** into your existing Next.js app

## 📁 Files

1. **index.html** - Standalone HTML demo (no framework required)
   - Open directly in browser to test the animation
   - Pure HTML/CSS/JavaScript implementation
   - Great for understanding the core concept

2. **ScrollNavbar.tsx** - React/Next.js component
   - Drop-in replacement for your current navbar
   - Uses your existing UI components
   - Fully typed with TypeScript

## 🚀 How to Test

### Option 1: HTML Demo

```bash
cd test-navbar
open index.html
# Or drag the file into your browser
```

### Option 2: React Component in Next.js

1. Create a test page:

```bash
mkdir -p src/app/navbar-test
```

2. Create `src/app/navbar-test/page.tsx`:

```tsx
import ScrollNavbar from "@/../../test-navbar/ScrollNavbar";

export default function NavbarTestPage() {
  return (
    <div>
      <ScrollNavbar />
      <div className="pt-40 px-6">
        <h1 className="text-4xl font-bold mb-8">
          Scroll down to see the navbar animation!
        </h1>
        {/* Add lots of content here to make page scrollable */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white p-8 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Section {i + 1}</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

3. Visit `http://localhost:3000/navbar-test`

## 🎨 How It Works

### 1. Scroll Detection

```javascript
useEffect(() => {
  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    setIsScrolled(currentScroll > scrollThreshold); // Default: 80px
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

### 2. State-Based Rendering

- **isScrolled = false**: Show expanded search bar with full inputs
- **isScrolled = true**: Show compact search button

### 3. CSS Transitions

```css
transition-all duration-300 ease-in-out
```

- Smooth opacity changes
- Height animations
- Shadow transitions

## 🔧 Customization

### Change Scroll Threshold

```tsx
const scrollThreshold = 80; // Change this value (pixels)
```

### Adjust Animation Speed

```tsx
// Change duration-300 to duration-200 (faster) or duration-500 (slower)
className = "transition-all duration-300 ease-in-out";
```

### Modify Colors

Replace `rose-500` with your brand color:

```tsx
className = "bg-rose-500"; // Change to bg-blue-500, bg-green-500, etc.
```

## 📦 Integration Steps

To integrate into your main app:

1. **Copy the component**:

```bash
cp test-navbar/ScrollNavbar.tsx src/components/desktop/AnimatedNavbar.tsx
```

2. **Update imports** to match your existing components:

```tsx
import Logo from "../logo/Logo";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
// etc.
```

3. **Replace in layout**:

```tsx
// src/app/layout.tsx
import AnimatedNavbar from "@/components/desktop/AnimatedNavbar";

// Replace <Navbar /> with <AnimatedNavbar />
```

## 🎯 Key Differences from Current Navbar

| Current Navbar      | Animated Navbar                |
| ------------------- | ------------------------------ |
| Fixed appearance    | Two states (expanded/compact)  |
| No scroll detection | Scroll-triggered transitions   |
| Static height       | Dynamic height based on scroll |
| Basic shadow        | Shadow intensity changes       |

## 💡 Tips

1. **Test on mobile** - The compact state is especially important for mobile UX
2. **Adjust threshold** - Different page layouts may need different scroll thresholds
3. **Performance** - Uses `passive: true` on scroll listener for 60fps animations
4. **Accessibility** - All interactive elements remain keyboard accessible

## 🐛 Troubleshooting

**Navbar jumps/flickers:**

- Ensure both states have consistent height calculations
- Check for conflicting CSS transitions

**Scroll feels laggy:**

- Verify `passive: true` is set on scroll listener
- Reduce complexity of navbar content

**States don't switch:**

- Check scroll threshold value
- Verify scroll position is being calculated correctly

## 📝 Next Steps

After testing, you can:

1. Integrate this into your main navbar
2. Add your existing search functionality
3. Connect to your auth system
4. Add category filters that hide/show on scroll
5. Implement click handlers for the compact search button

Enjoy your smooth, professional navbar animation! 🎉
