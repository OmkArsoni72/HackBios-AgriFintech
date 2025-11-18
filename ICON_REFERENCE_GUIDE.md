# 🌾 Farmer News Hub - Icon Reference Guide

## Icon Mapping Table

| Category    | Icon | Emoji Code | Usage Context                  | Visual Meaning             |
| ----------- | ---- | ---------- | ------------------------------ | -------------------------- |
| Agriculture | 🌱   | U+1F331    | General agricultural news      | Seedling = Growth, farming |
| Farming     | 🚜   | U+1F69C    | Farming operations & equipment | Tractor = Farm machinery   |
| Crops       | 🌾   | U+1F33E    | Crop production, harvest       | Wheat = Grain cultivation  |
| Livestock   | 🐄   | U+1F404    | Animal farming, dairy          | Cow = Livestock farming    |
| Technology  | 💻   | U+1F4BB    | Agricultural technology, AI    | Computer = Modern tech     |
| All News    | 📰   | U+1F4F0    | General farmer news feed       | Newspaper = News articles  |

## Badge Icons

| Badge Type | Icon | Display Text | Color Scheme   | Trigger Condition |
| ---------- | ---- | ------------ | -------------- | ----------------- |
| Just Now   | 🔥   | JUST NOW     | Red (animated) | < 1 hour old      |
| New        | 🔥   | NEW          | Red-Orange     | < 2 hours old     |
| Trending   | 📈   | TRENDING     | Purple-Pink    | Top 3 articles    |
| Hot        | 🔥   | HOT          | Orange-Yellow  | < 6 hours old     |
| Top Story  | ⭐   | TOP STORY    | Red            | Featured articles |
| Breaking   | 🚨   | BREAKING     | Red (flash)    | Priority news     |

## Page Icons

| Section                 | Icon | Size | Location                        |
| ----------------------- | ---- | ---- | ------------------------------- |
| Page Hero               | 🌾   | 6xl  | Top center of page              |
| Breaking News Section   | 📰   | 4xl  | Section header                  |
| Featured Articles       | ⭐   | 4xl  | Section header                  |
| All News Section        | 📋   | 4xl  | Section header                  |
| Navigation Link         | 🌾   | base | Header menu                     |
| Filter Buttons          | \*   | 2xl  | Category filter bar             |
| News Card Headers       | \*   | 3xl  | Individual article cards        |
| Headline Items          | \*   | 3xl  | Breaking news list              |
| Featured Fallback Image | \*   | 8xl  | When no article image available |

\* Category-specific icon from table above

## Icon Size Reference

```css
text-8xl   - 6rem / 96px   - Featured article fallback backgrounds
text-6xl   - 3.75rem / 60px - Page hero icon
text-4xl   - 2.25rem / 36px - Section headers
text-3xl   - 1.875rem / 30px - News cards, headlines
text-2xl   - 1.5rem / 24px  - Filter buttons
text-xl    - 1.25rem / 20px - (not currently used)
text-base  - 1rem / 16px    - Navigation header
text-sm    - 0.875rem / 14px - Badges (with emoji)
text-xs    - 0.75rem / 12px - Small badges
```

## Color Coding System

### Category Colors (Backgrounds)

```
Agriculture → Green-100    (#dcfce7) - Light green
Farming     → Green-200    (#bbf7d0) - Medium green
Crops       → Yellow-100   (#fef9c3) - Light yellow
Livestock   → Blue-100     (#dbeafe) - Light blue
Technology  → Purple-100   (#f3e8ff) - Light purple
```

### Badge Gradients

```css
/* Just Now / New */
from-red-500 to-orange-500
background: linear-gradient(135deg, #ef4444, #f97316);

/* Trending */
from-purple-500 to-pink-500
background: linear-gradient(135deg, #a855f7, #ec4899);

/* Hot */
from-orange-500 to-yellow-500
background: linear-gradient(135deg, #f97316, #eab308);

/* Top Story */
solid red-500
background: #ef4444;
```

## Implementation Code Snippets

### Get Category Icon Function

```javascript
const getCategoryIcon = (category) => {
  const icons = {
    agriculture: "🌱",
    farming: "🚜",
    crops: "🌾",
    livestock: "🐄",
    technology: "💻",
    all: "📰",
  };
  return icons[category?.toLowerCase()] || "📰";
};
```

### Usage in JSX

```jsx
{
  /* Filter Button with Icon */
}
<button className="...">
  <span className="text-2xl">{getCategoryIcon("crops")}</span>
  <span>Crops</span>
</button>;

{
  /* News Card Category Badge */
}
<span className="bg-green-100 text-green-700">
  {getCategoryIcon(news.category)} {news.category}
</span>;

{
  /* Featured Article Fallback */
}
<div className="h-48 bg-gradient-to-br from-green-400 to-green-600">
  <span className="text-8xl">{getCategoryIcon(news.category)}</span>
</div>;

{
  /* Navigation Link */
}
<Link href="/news" className="...">
  <span>🌾</span> News
</Link>;
```

### Dynamic Badge Rendering

```javascript
const getTrendingBadge = (date, index) => {
  const hoursDiff = getHoursDifference(date);

  if (hoursDiff < 1) {
    return <span className="animate-pulse">🔥 JUST NOW</span>;
  } else if (hoursDiff < 2) {
    return <span className="animate-pulse">🔥 NEW</span>;
  } else if (index < 3) {
    return <span>📈 TRENDING</span>;
  } else if (hoursDiff < 6) {
    return <span>🔥 HOT</span>;
  }
  return null;
};
```

## Visual Hierarchy

### Icon Sizes by Context

```
Largest  → Featured fallback images (8xl) - Primary visual focus
         ↓
Large    → Page hero (6xl) - Page identity
         ↓
Medium   → Section headers (4xl) - Section markers
         ↓
Standard → News cards (3xl) - Content indicators
         ↓
Small    → Filter buttons (2xl) - Navigation aids
         ↓
Smallest → Header link (base) - Menu integration
```

### Icon Density

- **High Density**: Filter bar (6 icons)
- **Medium Density**: News grid (3 per row × multiple rows)
- **Low Density**: Section headers (1 per section)
- **Single**: Page hero (1 large icon)

## Accessibility Considerations

### ARIA Labels

```jsx
<button aria-label="Filter news by Crops category">
  <span role="img" aria-label="wheat icon">
    🌾
  </span>
  <span>Crops</span>
</button>
```

### Screen Reader Text

```jsx
<span className="sr-only">
  {getCategoryIcon(category)} represents {category} category
</span>
```

### Semantic HTML

```html
<!-- Icon as decorative element -->
<span aria-hidden="true">🌱</span>

<!-- Icon with meaning -->
<span role="img" aria-label="agriculture">🌱</span>
```

## Browser Compatibility

### Emoji Support

✅ **Modern Browsers**: Full color emoji support

- Chrome 70+
- Firefox 68+
- Safari 12+
- Edge 79+

### Fallback Strategy

If emojis don't render:

1. System will show text labels only
2. Category colors still differentiate content
3. Layout remains intact

## Performance Notes

### Emoji Rendering

- **Lightweight**: Emojis are Unicode characters (no image files)
- **Fast**: Instant rendering, no HTTP requests
- **Scalable**: Vector-based, sharp at any size
- **Accessible**: Native screen reader support

### Comparison to Icon Libraries

```
Emoji Icons:
- Size: 0 bytes (Unicode)
- Load time: Instant
- Requests: 0
- Customization: Color via text color only

SVG Icons:
- Size: ~500 bytes per icon
- Load time: Depends on bundle
- Requests: 1 (bundled) or many
- Customization: Full control

Font Icons:
- Size: ~50KB font file
- Load time: 1 HTTP request
- Requests: 1
- Customization: Limited
```

## Quick Reference Chart

```
Category        Icon    Code        Usage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agriculture     🌱      U+1F331     General farming topics
Farming         🚜      U+1F69C     Equipment, operations
Crops           🌾      U+1F33E     Harvest, production
Livestock       🐄      U+1F404     Animals, dairy
Technology      💻      U+1F4BB     Innovation, AI
All News        📰      U+1F4F0     Uncategorized

Badge          Icon    Condition   Color
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Just Now       🔥      < 1hr       Red (pulse)
New            🔥      < 2hr       Red-Orange (pulse)
Trending       📈      Top 3       Purple-Pink
Hot            🔥      < 6hr       Orange-Yellow
Top Story      ⭐      Featured    Red
```

---

**Icon Set**: Unicode Emoji Standard  
**Total Icons**: 6 category + 5 badge types  
**Implementation**: Pure CSS + JavaScript  
**Fallback**: Text labels
