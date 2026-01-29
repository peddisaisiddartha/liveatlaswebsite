# LiveAtlas - Virtual Tourism Platform

A cutting-edge 3D interactive website for LiveAtlas, offering live virtual tourism experiences with VR integration and global shopping capabilities.

## 🌟 Features

- **3D Animated Hero Section** with particle effects and interactive canvas
- **Immersive Design** with glassmorphism, gradients, and smooth animations
- **Fully Responsive** for all devices
- **VR Integration Ready** for Meta Quest and other VR headsets
- **Live Tour Booking** integrated with Cal.com
- **Multiple Destination Pages** (India, UAE, Denmark, Antarctica)
- **Interactive Elements** including tilt effects, parallax scrolling, and hover animations
- **Modern Tech Stack** with vanilla JavaScript, CSS3, and HTML5

## 📁 File Structure

```
LiveAtlas/
├── index.html          # Main homepage
├── about.html          # About LiveAtlas page
├── roadmap.html        # Company roadmap and vision
├── india.html          # India destination page
├── uae.html           # UAE destination page
├── denmark.html       # Denmark destination page
├── antarctica.html    # Antarctica destination page
├── style.css          # Main stylesheet with all styles
├── app.js            # Primary JavaScript (3D canvas, animations)
├── script.js         # Additional interactivity and effects
├── logo.png          # LiveAtlas logo
└── README.md         # This file
```

## 🚀 Setup Instructions

### 1. Replace Files on GitHub

Copy and paste the code into your existing GitHub files:

- **index.html** → Paste the code into your existing `index.html`
- **style.css** → Paste the code into your existing `style.css`
- **app.js** → Paste the code into your existing `app.js`
- **script.js** → Paste the code into your existing `script.js`
- **india.html** → Paste the code into your existing `india.html`
- **uae.html** → Paste the code into your existing `uae.html`
- **denmark.html** → Paste the code into your existing `denmark.html`
- **antarctica.html** → Paste the code into your existing `antarctica.html`
- **about.html** → Paste the code into your existing `about.html`
- **roadmap.html** → Paste the code into your existing `roadmap.html`
- **README.md** → Paste the code into your existing `README.md`

### 2. Logo File

Make sure your `logo.png` is in the root directory. If you don't have one, you can:
- Create a simple logo using Canva or similar tools
- Use a placeholder until you have your official logo
- The website will still work without it, but navigation will look better with the logo

### 3. Deploy

Once all files are updated on GitHub:
- Commit the changes
- Push to your repository
- If using GitHub Pages, enable it in repository settings
- Your site will be live!

## 🎨 Customization

### Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-color: #00d4ff;
    --secondary-color: #ff0080;
    --accent-color: #7b2cbf;
    /* ... */
}
```

### Booking Link
The booking link is currently set to: `https://cal.com/live-atlas/60min`
To change it, search for this URL in all HTML files and replace it.

### Images
The destination pages use Unsplash images. You can replace them with your own images by updating the URLs in the HTML files.

## 🛠️ Technical Details

### Technologies Used
- HTML5 with semantic markup
- CSS3 with modern features (Grid, Flexbox, Animations)
- Vanilla JavaScript (no frameworks required)
- Canvas API for 3D particle effects
- Intersection Observer API for scroll animations

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Optimized animations using requestAnimationFrame
- Lazy loading for images
- Efficient CSS with minimal repaints
- Smooth 60fps animations

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🔗 Key Links

All "Book Now" and "Book Tour" buttons link to:
`https://cal.com/live-atlas/60min`

## 💡 Features Explained

### 3D Canvas Animation
The hero section features a dynamic 3D particle system that creates an immersive starfield effect.

### Glassmorphism
Modern frosted-glass effect used throughout cards and navigation for a premium feel.

### Tilt Effect
Feature cards respond to mouse movement with realistic 3D tilt.

### Scroll Animations
Elements fade in and animate as you scroll down the page.

### Mobile Menu
Hamburger menu for mobile devices with smooth transitions.

## 🐛 Troubleshooting

**Issue**: Animations not working
- **Solution**: Make sure both `app.js` and `script.js` are properly linked in HTML

**Issue**: Booking links not working
- **Solution**: Verify the Cal.com booking URL is correct

**Issue**: Images not loading
- **Solution**: Check internet connection (images are loaded from Unsplash CDN)

## 📝 License

All rights reserved © 2026 LiveAtlas

## 🤝 Support

For questions or issues, please contact the LiveAtlas team.

---

Built with ❤️ for the future of virtual tourism
