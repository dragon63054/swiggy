import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import AddressForm from "./address ";

export default function BillingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState("address");

  const item = state?.item;
  const quantity = state?.quantity;
  const itemTotal = state?.itemTotal;
  const deliveryFee = state?.deliveryFee;
  const gst = state?.gst;
  const total = state?.total;

  if (!item || !quantity || !total) {
    return (
      <p className="text-center text-red-500 mt-10">
        Missing order details. Please go back.
      </p>
    );
  }

  const handleAddressSubmit = () => {
    setStep("billing");
  };

  const handleBillingSubmit = () => {
    setTimeout(() => {
      alert(`Order placed! Payment of ₹${total} successful.`);
      navigate("/");
    }, 1500);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen p-6 md:p-12 bg-gray-50">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">🧾 Checkout</h2>

          {step === "address" && <AddressForm onSubmit={handleAddressSubmit} />}

          {step === "billing" && (
            <div className="space-y-4">
              <p className="text-gray-700">Review your order:</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-24 h-24 overflow-hidden rounded-xl shadow">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName || "Food Item"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.itemName}</p>
                  <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{gst}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleBillingSubmit}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
              >
                Pay ₹{total}
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
