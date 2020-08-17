import React, { useState, useEffect } from "react";
export const RouteContext = React.createContext();

export const RouteProvider = (props) => {
  const [route, setRoute] = useState({
    path: window.location.pathname,
  });

  useEffect(() => {
    let listRoutes = JSON.parse(localStorage.getItem("route")) || [];
    listRoutes.push(route);
    localStorage.setItem("route", JSON.stringify(listRoutes));
  }, []);

  return (
    <RouteContext.Provider value={[route, setRoute]}>
      {props.children}
    </RouteContext.Provider>
  );
};
