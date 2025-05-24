import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { addToCart } from "./cartUtils";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const item = state?.item;
  const [quantity, setQuantity] = useState(1);

  if (!item) {
    return (
      <p className="text-center text-red-500 mt-10">No item found for payment.</p>
    );
  }

  // Normalize fields
  const itemName = item.itemName || item.Item_Name || "Unknown Item";
  const imageUrl = item.imageUrl || item.Image_URL || "";
  const price = item.offerPrice ?? item.price ?? item.Price ?? 0;
  const restaurantName = item.restaurantName || "Unknown";

  const itemTotal = price * quantity;
  const deliveryFee = 77;
  const gst = Math.round(itemTotal * 0.05);
  const total = itemTotal + deliveryFee + gst;

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleProceedToPay = () => {
    const cartItem = {
      ...item,
      itemName,
      imageUrl,
      price,
      restaurantName,
    };

    addToCart(cartItem, quantity);

    navigate("/checkout", {
      state: {
        item: cartItem,
        quantity,
        total,
        itemTotal,
        deliveryFee,
        gst,
      },
    });
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen p-6 md:p-12">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            🧾 Payment Summary
          </h2>

          {/* Item Preview */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={imageUrl}
              alt={itemName}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{itemName}</h3>
              <p className="text-sm text-gray-500">
                From: {restaurantName}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center mt-2 space-x-2">
                <button
                  onClick={handleDecrease}
                  className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300"
                >
                  −
                </button>
                <span className="text-md font-medium">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{itemTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Other Charges</span>
              <span>₹{gst}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>To Pay</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* No-Contact Option */}
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-1 text-gray-800">
              🚫 No-contact Delivery
            </h4>
            <p className="text-sm text-gray-600">
              Unwell or avoiding contact? Partner will safely place the order at your
              door.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              ⬅ Back
            </button>
            <button
              onClick={handleProceedToPay}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
            >
              Proceed to Pay ₹{total}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PaymentPage;
