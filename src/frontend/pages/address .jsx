import { useState } from "react";

function AddressForm({ onSubmit }) {
  const [address, setAddress] = useState("");

  const handleAddressSubmit = () => {
    if (address.trim() !== "") {
      localStorage.setItem("address", address);
      alert("Address saved!");
      if (typeof onSubmit === "function") {
        onSubmit(); // notify parent component
      }
    } else {
      alert("Please enter an address.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-700">Enter your delivery address here.</p>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="123 Street, City, State"
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleAddressSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Continue to Billing
      </button>
    </div>
  );
}

export default AddressForm;
