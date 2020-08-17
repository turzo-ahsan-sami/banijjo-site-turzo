import React, { useState, useEffect } from "react";
import axios from "axios";
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

export const CartContext = React.createContext();

export const CartProvider = (props) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let cartData = JSON.parse(localStorage.getItem("cart"));
    if (cartData) setCart(cartData);
    if (localStorage.customer_id) {
      axios
        .get(
          `${base}/api/getCustomerCartInfo/${localStorage.customer_id}`
        )
        .then((res) => setCart(res.data));
    }
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {props.children}
    </CartContext.Provider>
  );
};
