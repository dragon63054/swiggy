export const getCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart;
};

export const clearCart = () => {
  // Clear the cart from localStorage
  localStorage.removeItem("cart");
};

export function addToCart(item, quantity) {
  const cart = getCart();

  // Use a combination of ID + restaurant to check for duplicates
  const existingIndex = cart.findIndex(
    (i) =>
      i.item.Item_ID === item.Item_ID &&
      i.item.restaurantName === item.restaurantName
  );

  if (existingIndex !== -1) {
    // Update quantity of matching item
    cart[existingIndex].quantity += quantity;
  } else {
    // Push new unique item
    cart.push({ item, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

