import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    item_name: "",
    description: "",
    price: "",
    image_url: "",
    rating: "",
    restaurant_id: ""
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
    else fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch("http://localhost:3001/restaurant/restaurant-menu-items", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editId
      ? `http://localhost:3001/restaurant/restaurant-menu-items/${editId}`
      : "http://localhost:3001/restaurant/restaurant-menu-items";

    const method = editId ? "PUT" : "POST";

    try {
      await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });
      setForm({
        item_name: "",
        description: "",
        price: "",
        image_url: "",
        rating: "",
        restaurant_id: ""
      });
      setIsPopupOpen(false);
      setEditId(null);
      fetchMenu();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await fetch(`http://localhost:3001/restaurant/restaurant-menu-items/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      fetchMenu();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setIsPopupOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>

      <div className="text-center mb-6">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700"
        >
          Add Menu Item
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-3"
          >
            <h2 className="text-xl font-semibold">{editId ? "Edit Item" : "Add Item"}</h2>
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Item Name"
              value={form.item_name}
              onChange={(e) => setForm({ ...form, item_name: e.target.value })}
              required
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <input
              className="w-full p-2 border rounded"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Image URL"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              required
            />
            <input
              className="w-full p-2 border rounded"
              type="number"
              step="0.1"
              placeholder="Rating (1-5)"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              required
            />
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Restaurant ID"
              value={form.restaurant_id}
              onChange={(e) => setForm({ ...form, restaurant_id: e.target.value })}
              required
            />

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPopupOpen(false);
                  setEditId(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow space-y-2">
            <img src={item.image_url} className="w-full h-40 object-cover rounded" />
            <h2 className="font-bold">{item.item_name}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-green-600 font-bold">₹{item.price}</p>
            <p className="text-yellow-500 text-sm">⭐ {item.rating}/5</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
