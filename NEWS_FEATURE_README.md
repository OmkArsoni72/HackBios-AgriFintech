# Farmers News Hub Feature - Implementation Guide

## Overview

This document describes the implementation of the **Farmers News Hub** feature in the HackBios-AgriFintech application, integrating real-time farming news with category-based icons (emojis) from the provided `news.zip` file.

## Features Implemented

### ✅ Complete Features

1. **Real-time News Fetching** - Pulls live farming news from NewsData.io API
2. **Category Icons (Emojis)** - Visual representation for each news category:

   - 🌱 Agriculture
   - 🚜 Farming
   - 🌾 Crops
   - 🐄 Livestock
   - 💻 Technology
   - 📰 All News

3. **Three News Sections**:

   - **Breaking News Headlines** (📰) - Top 10 latest headlines with trending badges
   - **Featured Articles** (⭐) - Top 5 stories with images/icons
   - **All Farming News** (📋) - Complete news grid with filters

4. **Trending Badge System**:

   - 🔥 **JUST NOW** - News less than 1 hour old (red, animated)
   - 🔥 **NEW** - News less than 2 hours old (red-orange gradient)
   - 📈 **TRENDING** - Top 3 news items (purple-pink gradient)
   - 🔥 **HOT** - News less than 6 hours old (orange-yellow gradient)
   - **TOP STORY** - Featured articles badge (red)

5. **Category Filtering** - Filter news by:

   - All
   - Agriculture
   - Farming
   - Crops
   - Livestock
   - Technology

6. **Auto-refresh** - News updates every 5 minutes automatically
7. **Responsive Design** - Mobile-friendly grid layout
8. **Fallback Sample News** - 10 sample articles when API fails

## Files Created/Modified

### New Files

```
app/news/page.jsx                  - Main News page component
app/api/farmer-news/route.js       - Backend API endpoint
```

### Modified Files

```
components/Header.jsx              - Added News navigation link with 🌾 icon
.env                              - Added NEWSDATA_API_KEY
```

## Icon Implementation

### Category Icons (Emojis)

```javascript
const getCategoryIcon = (category) => {
  const icons = {
    agriculture: "🌱", // Seedling for agriculture
    farming: "🚜", // Tractor for farming
    crops: "🌾", // Wheat for crops
    livestock: "🐄", // Cow for livestock
    technology: "💻", // Computer for tech
    all: "📰", // Newspaper for all news
  };
  return icons[category?.toLowerCase()] || "📰";
};
```

### Trending Badges

```javascript
// Dynamic badge generation based on article age
if (hoursDiff < 1) {
  return <span className="...animate-pulse">🔥 JUST NOW</span>;
} else if (hoursDiff < 2) {
  return <span className="...animate-pulse">🔥 NEW</span>;
} else if (index < 3) {
  return <span className="...">📈 TRENDING</span>;
} else if (hoursDiff < 6) {
  return <span className="...">🔥 HOT</span>;
}
```

## API Configuration

### NewsData.io API

- **Endpoint**: `https://newsdata.io/api/1/news`
- **API Key**: `pub_21ec913e799c4a468eabebab0ae944f7` (from news.zip)
- **Query**: Farmer-specific queries with category filters
- **Language**: English
- **Categories**: Business, Technology

### Backend API Endpoint

```
GET /api/farmer-news?category={category}
```

**Parameters**:

- `category` (optional): all, agriculture, farming, crops, livestock, technology

**Response**:

```json
{
  "success": true,
  "news": [
    {
      "title": "Article Title",
      "description": "Article description",
      "link": "https://...",
      "source": "Source Name",
      "date": "2025-11-18T10:30:00Z",
      "image": "https://image-url.jpg",
      "category": "crops"
    }
  ],
  "count": 10
}
```

## Visual Design Elements

### Color Scheme

- **Primary Green**: `#2e7d32` (from news.zip)
- **Light Green**: `#4caf50`
- **Earth Brown**: `#795548`
- **Wheat Yellow**: `#ffd54f`
- **Sky Blue**: `#87ceeb`

### Gradients

- Hero Header: `from-green-600 to-green-500`
- Background: `from-blue-100 via-green-50 to-blue-50`
- Trending Badge: `from-red-500 to-orange-500`
- Featured Badge: `from-purple-500 to-pink-500`

### Animations

- **Pulse Animation**: For "NEW" and "JUST NOW" badges
- **Hover Effects**: Scale transform on buttons and cards
- **Auto-refresh Indicator**: Fixed bottom-right with pulsing dot

## Usage

### Accessing the News Page

1. Navigate to: `http://localhost:3000/news`
2. Or click the **🌾 News** link in the header navigation

### Filtering News

- Click any category button to filter news
- Icon appears on each button for visual identification
- Active category has green background with shadow

### Reading Articles

- Click "Read More" or "Read Full Story" on any article
- Opens article link in new tab
- Trending badges indicate article freshness

## Integration with HackBios-AgriFintech

### Navigation Integration

The News link is added to the Header component:

```jsx
<Link
  href="/news"
  className="hover:text-yellow-300 font-semibold flex items-center gap-1"
>
  <span>🌾</span> News
</Link>
```

### Consistent Styling

- Uses existing Header and Footer components
- Matches color scheme with green theme
- Responsive design consistent with other pages

## Environment Variables

Add to `.env` file:

```env
# NewsData.io API for Farming News
NEWSDATA_API_KEY=pub_21ec913e799c4a468eabebab0ae944f7
```

## Testing

### Local Development

1. Start the development server:

   ```bash
   cd C:\news\HackBios-AgriFintech
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/news`

3. Test category filters by clicking different category buttons

4. Verify auto-refresh after 5 minutes

### Sample News Fallback

If API fails or is unavailable, the system automatically shows 10 sample farming news articles.

## Future Enhancements

### Possible Additions

1. **Search Functionality** - Search news by keywords
2. **Bookmarking** - Save favorite articles
3. **Share Buttons** - Social media sharing
4. **Pagination** - Load more news articles
5. **Advanced Filters** - Date range, source filters
6. **Notifications** - Alert for breaking news
7. **Multilingual Support** - News in regional languages

## Credits

- **News Source**: news.zip extracted files
- **API Provider**: NewsData.io
- **Icons**: Unicode emojis (🌾🚜🌱🐄💻📰)
- **Design Inspiration**: Farmers News Hub from news.zip

## License

Part of the HackBios-AgriFintech project - Educational/Open Source

---

**Last Updated**: November 18, 2025  
**Version**: 1.0.0
