import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const showToast = (message) => {
    const existingToast = document.querySelector(".cart-toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 3000);
  };

  const addToCart = (product) => {
    const safeProduct = {
      id: product.id || Date.now(),
      title: product.title || "Unknown Product",
      price: product.price || 0,
      thumbnail: product.thumbnail || "",
      category: product.category || "General",
      brand: product.brand || "Unknown Brand",
      discountPercentage: product.discountPercentage || 0,
      quantity: 1,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === safeProduct.id);

      if (existingItem) {
        const updatedItems = prevItems.map((item) =>
          item.id === safeProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        showToast(`"${safeProduct.title}" quantity increased!`);
        return updatedItems;
      } else {
        const updatedItems = [...prevItems, safeProduct];
        showToast(`"${safeProduct.title}" added to cart!`);
        return updatedItems;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === productId);
      const updatedItems = prevItems.filter((item) => item.id !== productId);

      if (itemToRemove) {
        showToast(`"${itemToRemove.title}" removed from cart!`);
      }

      return updatedItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find((item) => item.id === productId);
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );

      if (itemToUpdate && newQuantity !== itemToUpdate.quantity) {
        showToast(
          `"${itemToUpdate.title}" quantity updated to ${newQuantity}!`
        );
      }

      return updatedItems;
    });
  };

  const clearCart = () => {
    if (cartItems.length > 0) {
      showToast("Cart cleared!");
    }
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
