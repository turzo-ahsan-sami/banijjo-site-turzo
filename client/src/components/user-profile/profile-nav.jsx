import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const ProfilePageNav = () => {
  return (
    <>
      <div className="list-group">
        <NavLink to="/profile/view-profile" className="list-group-item">
          View Profile
        </NavLink>
        <NavLink to="/profile/change-address" className="list-group-item">
          Add or Change Address
        </NavLink>
        <NavLink to="/profile/change-password" className="list-group-item">
          Edit Password
        </NavLink>
        <NavLink to="/profile/my-orders" className="list-group-item">
          My Orders
        </NavLink>
      </div>
    </>
  );
};

export default ProfilePageNav;
