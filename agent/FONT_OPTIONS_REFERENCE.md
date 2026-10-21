# Font Options Reference - PaiTech Theme System

## 📚 Available Fonts

Admin dapat memilih dari **13 font options** yang sudah dikurasi:

---

### 1. **Inter** ⭐ DEFAULT
- **Style:** Modern, Clean, Professional
- **Best For:** Tech companies, SaaS, Modern businesses
- **Character:** Geometric, readable at all sizes
- **Mood:** Contemporary, approachable
- **Google Fonts:** [View Inter](https://fonts.google.com/specimen/Inter)

---

### 2. **Roboto**
- **Style:** Google's signature font
- **Best For:** Android-style apps, Google ecosystem
- **Character:** Mechanical, friendly
- **Mood:** Neutral, trustworthy
- **Google Fonts:** [View Roboto](https://fonts.google.com/specimen/Roboto)

---

### 3. **Poppins**
- **Style:** Rounded, Friendly, Playful
- **Best For:** Creative agencies, lifestyle brands, children's products
- **Character:** Geometric with rounded edges
- **Mood:** Warm, welcoming, fun
- **Google Fonts:** [View Poppins](https://fonts.google.com/specimen/Poppins)

---

### 4. **Montserrat**
- **Style:** Geometric, Urban, Bold
- **Best For:** Fashion, architecture, modern brands
- **Character:** Based on urban typography
- **Mood:** Confident, stylish, contemporary
- **Google Fonts:** [View Montserrat](https://fonts.google.com/specimen/Montserrat)

---

### 5. **Open Sans**
- **Style:** Neutral, Humanist, Optimized
- **Best For:** Body text, long-form content, accessibility
- **Character:** Friendly, readable
- **Mood:** Open, approachable, clear
- **Google Fonts:** [View Open Sans](https://fonts.google.com/specimen/Open+Sans)

---

### 6. **Lato**
- **Style:** Corporate, Professional, Warm
- **Best For:** Business sites, corporate communications
- **Character:** Semi-rounded, balanced
- **Mood:** Stable, reliable, friendly
- **Google Fonts:** [View Lato](https://fonts.google.com/specimen/Lato)

---

### 7. **Raleway**
- **Style:** Elegant, Thin, Sophisticated
- **Best For:** Luxury brands, portfolios, minimal designs
- **Character:** Elegant with thin weights
- **Mood:** Refined, stylish, upscale
- **Google Fonts:** [View Raleway](https://fonts.google.com/specimen/Raleway)

---

### 8. **Nunito**
- **Style:** Soft, Rounded, Balanced
- **Best For:** Education, wellness, friendly brands
- **Character:** Well-balanced rounded terminals
- **Mood:** Gentle, approachable, soft
- **Google Fonts:** [View Nunito](https://fonts.google.com/specimen/Nunito)

---

### 9. **Source Sans Pro**
- **Style:** Adobe's first open source font
- **Best For:** Professional documents, technical content
- **Character:** Clean, readable, professional
- **Mood:** Serious, authoritative, clear
- **Google Fonts:** [View Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro)

---

### 10. **Work Sans**
- **Style:** Technical, Geometric, Versatile
- **Best For:** Tech startups, design agencies, portfolios
- **Character:** Slightly condensed, optimized for screens
- **Mood:** Modern, efficient, technical
- **Google Fonts:** [View Work Sans](https://fonts.google.com/specimen/Work+Sans)

---

### 11. **Playfair Display** (SERIF)
- **Style:** High contrast, Elegant, Classic
- **Best For:** Editorial, luxury, traditional brands
- **Character:** Large x-height, short descenders
- **Mood:** Sophisticated, traditional, elegant
- **Google Fonts:** [View Playfair Display](https://fonts.google.com/specimen/Playfair+Display)

---

### 12. **Merriweather** (SERIF)
- **Style:** Readable serif, Traditional, Bookish
- **Best For:** Blogs, publishing, long-form reading
- **Character:** Condensed letterforms for readability
- **Mood:** Scholarly, traditional, readable
- **Google Fonts:** [View Merriweather](https://fonts.google.com/specimen/Merriweather)

---

### 13. **System Default**
- **Style:** Native OS fonts
- **Best For:** Maximum performance, native look
- **Character:** Varies by OS (SF Pro on Mac, Segoe UI on Windows)
- **Mood:** Familiar, native, fast
- **Fallback:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

---

## 🎨 Font Selection Guide

### By Industry:

| Industry | Recommended Fonts |
|----------|-------------------|
| **Tech/SaaS** | Inter, Work Sans, Roboto |
| **E-commerce** | Poppins, Montserrat, Inter |
| **Corporate** | Lato, Source Sans Pro, Roboto |
| **Creative/Design** | Montserrat, Raleway, Work Sans |
| **Education** | Nunito, Open Sans, Poppins |
| **Luxury/Fashion** | Raleway, Playfair Display, Montserrat |
| **Publishing/Blog** | Merriweather, Playfair Display, Lato |
| **Health/Wellness** | Nunito, Lato, Open Sans |

---

### By Brand Personality:

| Personality | Recommended Fonts |
|-------------|-------------------|
| **Professional** | Inter, Lato, Source Sans Pro |
| **Friendly** | Poppins, Nunito, Open Sans |
| **Modern** | Inter, Montserrat, Work Sans |
| **Elegant** | Raleway, Playfair Display, Merriweather |
| **Playful** | Poppins, Nunito, Montserrat |
| **Traditional** | Merriweather, Playfair Display, Lato |
| **Technical** | Work Sans, Roboto, Source Sans Pro |

---

### By Use Case:

| Use Case | Recommended Fonts |
|----------|-------------------|
| **Body Text (readability)** | Open Sans, Lato, Merriweather |
| **Headings (impact)** | Montserrat, Raleway, Playfair Display |
| **All-purpose** | Inter, Roboto, Poppins |
| **Long-form content** | Merriweather, Open Sans, Source Sans Pro |
| **UI Elements** | Inter, Work Sans, Roboto |
| **Mobile-first** | Inter, Open Sans, Roboto |

---

## ⚡ Performance Notes

### Font Weights Loaded:
- **Most fonts:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Optimized for web:** `display=swap` parameter for faster rendering
- **Fallback fonts:** Every font has system fallback untuk instant display

### Loading Strategy:
1. **Preconnect** ke Google Fonts CDN
2. Load font CSS dengan `display=swap`
3. Browser shows fallback font immediately
4. Google font swaps in when loaded
5. **Result:** No FOIT (Flash of Invisible Text)

---

## 🔧 Technical Implementation

### Database Storage:
```php
// Font disimpan sebagai slug
$shopSetting->theme_font_family = 'inter'; // Not the full CSS string
```

### Font Mapping:
```php
const FONT_MAP = [
    'inter' => [
        'name' => 'Inter',
        'url' => 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'fallback' => 'system-ui, -apple-system, sans-serif',
    ],
    // ... more fonts
];
```

### CSS Output:
```css
/* Applied to root element */
:root {
    --font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Used in TailwindCSS */
.font-theme {
    font-family: var(--font-family);
}
```

---

## 📝 Admin Usage Instructions

### How to Change Font:

1. **Login** to admin panel (`/admin`)
2. Navigate to **Shop Settings**
3. Click **Theme Colors** tab
4. Find **Font Family** dropdown
5. **Browse** available fonts (searchable!)
6. **Select** your preferred font
7. **Save** changes
8. **✅ Done!** - Font applies immediately to entire website

### Tips:
- **Preview:** Check font on [Google Fonts](https://fonts.google.com) first
- **Test:** View website after changing to ensure readability
- **Consistency:** Stick to one font family for professional look
- **Performance:** System Default = fastest option

---

## 🎯 Recommendations for PaiTech

### Scenario 1: Modern Tech Company
**Primary:** Inter (DEFAULT)
- Clean, professional, widely used in tech
- Excellent readability on screens
- Modern geometric design

### Scenario 2: Friendly E-commerce
**Primary:** Poppins
- Rounded, approachable
- Great for product-focused sites
- Warm and welcoming vibe

### Scenario 3: Corporate/Professional
**Primary:** Lato or Source Sans Pro
- Business-friendly
- Professional yet approachable
- Good for B2B

### Scenario 4: Luxury/Premium Brand
**Primary:** Raleway or Playfair Display
- Elegant and sophisticated
- High-end feel
- Great for premium products

---

## 🌐 Browser Compatibility

All fonts are compatible with:
- ✅ Chrome/Edge (Chromium) - All versions
- ✅ Firefox - All versions
- ✅ Safari - All versions
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Even older browsers (with fallback fonts)

---

## 🚀 Future Enhancements

**Phase 2 (Optional):**
- [ ] Expand to 50+ Google Fonts
- [ ] Allow custom font upload (WOFF2 files)
- [ ] Font pairing (different fonts for headings vs body)
- [ ] Font preview in admin panel
- [ ] Font weight customization
- [ ] Variable fonts support

---

**Last Updated:** 2026-09-20  
**Document Version:** 1.0
