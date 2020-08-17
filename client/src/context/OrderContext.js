import React, { useState, useEffect } from "react";

export const OrderContext = React.createContext();

export const OrderProvider = (props) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    var orderTotal = localStorage.getItem("orderTotal");
    setOrder(orderTotal);
  }, []);

  return (
    <OrderContext.Provider value={[order, setOrder]}>
      {props.children}
    </OrderContext.Provider>
  );
};
