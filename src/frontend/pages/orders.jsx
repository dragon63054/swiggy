import { useEffect, useState, useRef } from "react";
import { getCart } from "./cartUtils";
import { CheckCircle, Clock } from "lucide-react";

export default function AddToCart() {
  const [cartItems, setCartItems] = useState([]);
  const itemsRef = useRef([]);

  useEffect(() => {
    const items = getCart();
    const enrichedItems = items.map((entry, idx) => {
      const key = `${entry.item.id}_${idx}`;
      const statusKey = `status_${key}`;
      const statusData = JSON.parse(localStorage.getItem(statusKey));
      let deliveryStatus = "packed";
      let timestamp = Date.now();

      if (statusData) {
        deliveryStatus = statusData.deliveryStatus;
        timestamp = statusData.timestamp;
      } else {
        localStorage.setItem(statusKey, JSON.stringify({ deliveryStatus, timestamp }));
      }

      return {
        ...entry,
        key,
        deliveryStatus,
        timestamp,
      };
    });

    setCartItems(enrichedItems);
    itemsRef.current = enrichedItems;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedItems = itemsRef.current.map((entry) => {
        const { key, deliveryStatus, timestamp } = entry;
        const isDelivered = now - timestamp > 15 * 60 * 1000;

        if (deliveryStatus === "delivered") return entry;

        if (isDelivered) {
          localStorage.setItem(
            `status_${key}`,
            JSON.stringify({ deliveryStatus: "delivered", timestamp })
          );
          return { ...entry, deliveryStatus: "delivered" };
        }

        return entry;
      });

      setCartItems(updatedItems);
      itemsRef.current = updatedItems;
    }, 60000); // Every 1 min

    return () => clearInterval(interval);
  }, []);

  const handleRemove = (keyToRemove) => {
    const updatedItems = cartItems.filter(({ key }) => key !== keyToRemove);

    // Update localStorage cart
    const newCart = updatedItems.map(({ item, quantity }) => ({ item, quantity }));
    localStorage.setItem("cart", JSON.stringify(newCart));

    // Remove status
    localStorage.removeItem(`status_${keyToRemove}`);

    setCartItems(updatedItems);
    itemsRef.current = updatedItems;
  };

  const totalCartPrice = cartItems.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  const renderStatusBadge = (status) => {
    if (status === "delivered") {
      return (
        <span className="flex items-center text-green-600 text-sm font-semibold">
          <CheckCircle className="w-4 h-4 mr-1" /> Delivered
        </span>
      );
    }
    return (
      <span className="flex items-center text-red-500 text-sm font-semibold">
        <Clock className="w-4 h-4 mr-1" /> Delivery Packed
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          🛒 Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map(({ item, quantity, deliveryStatus, key }) => {
                const itemTotal = item.price * quantity;
                return (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      className="w-24 h-24 rounded object-cover"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                          {item.itemName}
                        </h3>
                        {renderStatusBadge(deliveryStatus)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description || "No description available."}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Quantity: <span className="font-medium">{quantity}</span>
                      </p>
                      <p className="text-green-600 font-semibold mt-1">
                        ₹{item.price} x {quantity} = ₹{itemTotal}
                      </p>
                    </div>
                    <button
                      className="text-red-500 hover:underline text-sm self-start sm:self-center"
                      onClick={() => handleRemove(key)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-right">
              <p className="text-xl font-bold text-gray-800">
                Grand Total: ₹{totalCartPrice}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
