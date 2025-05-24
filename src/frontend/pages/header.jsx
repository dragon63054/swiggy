import {
  Clipboard,
  BadgePercent,
  UserRound,
  Menu,
  X,
  LucideUserSearch,
  LogOut
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, clearCart } from "./cartUtils";
import { useState, useEffect } from "react";

function Header({ onOffersClick, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [address, setAddress] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userInitial = user ? user.email.charAt(0).toUpperCase() : ""; // Could fallback to "Login"

  const isAdmin = user?.role === "admin";

  // Sync cart count and address
  const updateHeaderState = () => {
    const cart = getCart();
    setCount(cart.reduce((sum, i) => sum + i.quantity, 0));
    setAddress(localStorage.getItem("address") || "");
  };

  useEffect(() => {
    updateHeaderState();
    window.addEventListener("focus", updateHeaderState); // Re-check cart on tab focus
    return () => window.removeEventListener("focus", updateHeaderState);
  }, []);

  // Close profile dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".profile-dropdown") &&
        !e.target.closest(".profile-trigger")
      ) {
        setShowProfileDropdown(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setShowProfileDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSearchClick = () => {
    setShowSearch((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (typeof onSearch === "function") {
      onSearch(value);
    }
  };

  const handleSignInClick = () => {
    if (!user) {
      navigate("/register");
    } else {
      setShowProfileDropdown((prev) => !prev);
    }
  };

  const handleOfferClick = () => {
    if (typeof onOffersClick === "function") {
      onOffersClick();
    }
    navigate("/offers");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("address");
    clearCart();
    navigate("/register");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600">Swiggy</h1>
          <span className="text-sm font-bold text-gray-600 hidden sm:inline">Food Delivery</span>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center font-semibold text-sm text-gray-800">
          {showSearch && (
            <input
              type="text"
              placeholder="Search menu items..."
              className="border border-gray-300 rounded-full px-4 py-1 w-60"
              value={searchTerm}
              onChange={handleInputChange}
            />
          )}

          <button className="flex items-center gap-1 hover:text-red-500">
            <Clipboard className="h-5 w-5" />
            Corporate
          </button>

          <button onClick={handleSearchClick} className="hover:text-red-500 flex items-center gap-1">
            <LucideUserSearch className="h-5 w-5" />
            Search
          </button>

          <button onClick={handleOfferClick} className="flex items-center gap-1 hover:text-red-500">
            <BadgePercent className="h-5 w-5" />
            Offers
          </button>

          <Link to="/cart" className="relative hover:text-red-500">
            🛒 Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>

          {/* Profile trigger */}
          <div
            className="profile-trigger flex items-center gap-2 cursor-pointer hover:text-red-500"
            onClick={handleSignInClick}
            onKeyDown={(e) => e.key === "Enter" && handleSignInClick()}
            tabIndex={0}
          >
            <UserRound className="h-5 w-5" />
            <span className="bg-pink-600 text-white rounded-full px-2 py-1">
              {userInitial || "?"}
              {/* Or: userInitial || "Login" */}
            </span>
            {address && (
              <span className="text-xs text-gray-500 truncate max-w-[150px]">
                📍 {address}
              </span>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="ml-4 px-3 py-2 bg-red-600 text-white rounded"
            >
              Admin Panel
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="bg-gray-100 px-4 py-4 md:hidden flex flex-col gap-4 font-semibold text-gray-800 transition-all duration-300 shadow-md rounded-b-xl">
          {showSearch && (
            <input
              type="text"
              placeholder="Search menu items..."
              className="border border-gray-300 rounded-full px-4 py-2 w-full"
              value={searchTerm}
              onChange={handleInputChange}
            />
          )}

          <button className="flex items-center gap-2 hover:text-red-500">
            <Clipboard className="h-5 w-5" />
            Corporate
          </button>

          <button onClick={handleSearchClick} className="hover:text-red-500 flex items-center">
            <LucideUserSearch className="h-5 w-5" />
            Search
          </button>

          <button onClick={handleOfferClick} className="flex items-center gap-2 hover:text-red-500">
            <BadgePercent className="h-5 w-5" />
            Offers
          </button>

          <Link to="/cart" className="relative hover:text-red-500">
            🛒 Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>

          <div
            className="profile-trigger flex items-center gap-2 cursor-pointer hover:text-red-500"
            onClick={handleSignInClick}
            onKeyDown={(e) => e.key === "Enter" && handleSignInClick()}
            tabIndex={0}
          >
            <UserRound className="h-5 w-5" />
            <span className="bg-pink-600 text-white rounded-full px-3 py-1">
              {userInitial || "?"}
            </span>
            {address && (
              <span className="text-xs text-gray-500 truncate max-w-[150px]">
                📍 {address}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfileDropdown && user && (
        <div className="profile-dropdown absolute top-16 right-4 bg-white border shadow-lg rounded-lg p-4 w-48 z-50">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">{user.email}</span>
            <span className="text-sm text-gray-600">📍 {address || "No address set"}</span>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 text-red-600 hover:text-red-800 mt-4"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
