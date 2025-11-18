"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NewsPage = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [headlinesData, setHeadlinesData] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);

  // Fetch news from backend API
  useEffect(() => {
    loadNews();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/farmer-news?category=${selectedCategory}`);
      const data = await response.json();
      
      if (data.success && data.news) {
        setNewsData(data.news);
        setHeadlinesData(data.news.slice(0, 10));
        setFeaturedData(data.news.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get category icon (emoji)
  const getCategoryIcon = (category) => {
    const icons = {
      agriculture: '🌱',
      farming: '🚜',
      crops: '🌾',
      livestock: '🐄',
      technology: '💻',
      all: '📰'
    };
    return icons[category?.toLowerCase()] || '📰';
  };

  // Calculate time difference for badges
  const getHoursDifference = (dateString) => {
    if (!dateString) return 999;
    const now = new Date();
    const newsDate = new Date(dateString);
    return Math.floor((now - newsDate) / (1000 * 60 * 60));
  };

  // Render trending badge based on time
  const getTrendingBadge = (date, index) => {
    const hoursDiff = getHoursDifference(date);
    
    if (hoursDiff < 1) {
      return <span className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full ml-2 animate-pulse">🔥 JUST NOW</span>;
    } else if (hoursDiff < 2) {
      return <span className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full ml-2 animate-pulse">🔥 NEW</span>;
    } else if (index < 3) {
      return <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full ml-2">📈 TRENDING</span>;
    } else if (hoursDiff < 6) {
      return <span className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full ml-2">🔥 HOT</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
      <Header />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-12 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-400"></div>
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-4 animate-bounce">🌾</div>
          <h1 className="text-5xl font-bold mb-3 text-shadow-lg">Farmers News Hub</h1>
          <p className="text-xl opacity-90">Stay Updated with the Latest Farming & Agriculture News</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-green-300">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Filter by Category</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {['all', 'agriculture', 'farming', 'crops', 'livestock', 'technology'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-2`}
              >
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <span className="capitalize">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading latest farming news...</p>
          </div>
        )}

        {/* Breaking News Headlines */}
        {!loading && headlinesData.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📰</span>
              <h2 className="text-3xl font-bold text-gray-800">Breaking News Headlines</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-8 border-red-500">
              <div className="space-y-4">
                {headlinesData.map((news, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-0 pb-4 last:pb-0 hover:bg-gray-50 p-4 rounded-lg transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">{getCategoryIcon(news.category)}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 hover:text-green-600 transition-colors leading-tight">
                          {news.title}
                          {getTrendingBadge(news.date, index)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                          {news.source} • {new Date(news.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Articles */}
        {!loading && featuredData.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">⭐</span>
              <h2 className="text-3xl font-bold text-gray-800">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData.map((news, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {news.image ? (
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
                    style={{display: news.image ? 'none' : 'flex'}}
                  >
                    <span className="text-8xl">{getCategoryIcon(news.category)}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {getCategoryIcon(news.category)} {news.category || 'Farming'}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        TOP STORY
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{news.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{news.source}</span>
                      <span>{new Date(news.date).toLocaleDateString()}</span>
                    </div>
                    {news.link && (
                      <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        Read Full Story →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All News Grid */}
        {!loading && newsData.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📋</span>
              <h2 className="text-3xl font-bold text-gray-800">All Farming News</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.map((news, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-green-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">{getCategoryIcon(news.category)}</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {news.category || 'Farming'}
                      </span>
                      {getHoursDifference(news.date) < 1 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                          JUST NOW
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{news.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="font-medium">{news.source}</span>
                      <span>{new Date(news.date).toLocaleDateString()}</span>
                    </div>
                    {news.link && (
                      <a
                        href={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm w-full text-center"
                      >
                        Read More →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No News State */}
        {!loading && newsData.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-4">🌾</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No News Available</h3>
            <p className="text-gray-500">Check back soon for the latest farming updates!</p>
          </div>
        )}

        {/* Auto-refresh Indicator */}
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">Auto-refreshing...</span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsPage;
