"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiActivity,
  FiCalendar,
  FiArrowRight,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("agrifinai_user");
      if (!user) {
        router.push("/login");
      } else {
        setUserData(JSON.parse(user));
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("agrifinai_user");
    router.push("/");
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Active Listings", value: "12", icon: FiPackage },
    { label: "Total Sales", value: "₹45,230", icon: FiDollarSign },
    { label: "Saved Items", value: "8", icon: FiHeart },
    { label: "Profile Views", value: "234", icon: FiUsers },
  ];

  const recentActivity = [
    { action: "Listed Organic Tomatoes", time: "2 hours ago", icon: FiPackage },
    { action: "Saved Wheat Seeds listing", time: "5 hours ago", icon: FiHeart },
    { action: "Applied for Crop Loan", time: "1 day ago", icon: FiDollarSign },
    { action: "Updated profile picture", time: "2 days ago", icon: FiUser },
  ];

  const quickActions = [
    { label: "Sell Products", href: "/sell", icon: FiShoppingBag },
    { label: "Browse Market", href: "/", icon: FiHome },
    { label: "Apply for Loan", href: "/loan", icon: FiDollarSign },
    { label: "Weather Forecast", href: "/weather", icon: FiActivity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                AgriFinAI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-green-700 font-medium transition">
                Home
              </Link>
              <Link href="/dashboard" className="text-green-700 font-semibold">
                Dashboard
              </Link>
              <Link href="/weather" className="text-gray-700 hover:text-green-700 font-medium transition">
                Weather
              </Link>
              <Link href="/loan" className="text-gray-700 hover:text-green-700 font-medium transition">
                Loans
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-700 font-medium transition">
                Contact
              </Link>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-50 hover:bg-green-100 transition">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {userData.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-gray-700 font-medium">{userData.name || "User"}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-t-xl transition">
                    View Profile
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50 transition">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-green-50"
            >
              {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl">
                Home
              </Link>
              <Link href="/dashboard" className="block px-4 py-2 text-green-700 bg-green-50 rounded-xl font-semibold">
                Dashboard
              </Link>
              <Link href="/weather" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl">
                Weather
              </Link>
              <Link href="/loan" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl">
                Loans
              </Link>
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your AgriFinAI account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <stat.icon className="text-green-600 text-2xl" />
                </div>
                <FiTrendingUp className="text-green-500 text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white border border-green-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
              >
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <action.icon className="text-green-600 text-2xl" />
                  </div>
                  <p className="font-semibold text-gray-900">{action.label}</p>
                </div>
                <FiArrowRight className="text-green-600 text-2xl opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <activity.icon className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <FiCalendar className="mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
                <FiArrowRight className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
