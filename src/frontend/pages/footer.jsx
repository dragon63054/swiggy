import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Top CTA Section */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            For a better experience, download the Swiggy app now
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
              Download Android App
            </button>
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition">
              Download iOS App
            </button>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Swiggy Corporate</li>
              <li>Careers</li>
              <li>Team</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-3">Our Services</h3>
            <ul className="space-y-2">
              <li>Swiggy One</li>
              <li>Swiggy Instamart</li>
              <li>Swiggy Dineout</li>
              <li>Swiggy Genie</li>
              <li>Minis</li>
              <li>Pyng</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-3">Contact Us</h3>
            <ul className="space-y-2">
              <li>Help & Support</li>
              <li>Partner with us</li>
              <li>Ride with us</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>Terms & Conditions</li>
              <li>Cookie Policy</li>
              <li>Privacy Policy</li>
              <li>Investor Relations</li>
              <li>Life at Swiggy</li>
            </ul>
          </div>
        </div>

        {/* Explore and Cities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-white font-bold mb-3">Explore with Swiggy</h3>
            <ul className="space-y-2">
              <li>Swiggy News</li>
              <li>Snackables</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Available in</h3>
            <p>Bangalore, Gurgaon, Hyderabad, Delhi, Mumbai, Pune</p>
            <p className="text-sm text-gray-400 mt-1">+ 679 cities</p>
          </div>
        </div>

        {/* Social and Copyright */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 Swiggy Limited</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Pinterest</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
