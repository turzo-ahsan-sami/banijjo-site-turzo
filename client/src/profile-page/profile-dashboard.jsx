import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ViewProfile from "./view-profile";
import ChangeAddress from "./change-address";
import MyOrders from "./my-orders";
import ProfilePageNav from "./profile-page-nav";
import ChangePassword from "./change-password";

class ProfileDashboard extends Component {
  render() {
    return (
      <div className="container">
      <div className="row mt-3">
        <div className="col-md-3">
          <ProfilePageNav />
        </div>

        <div className="col-md-9">
          <Switch>
            <Redirect exact from="/profile" to="/profile/view-profile" />
            <Route path="/profile/view-profile" component={ViewProfile} />
            <Route path="/profile/change-password" component={ChangePassword} />
            <Route path="/profile/change-address" component={ChangeAddress} />
            <Route path="/profile/my-orders" component={MyOrders} />
          </Switch>
        </div>
      </div>
      </div>
    );
  }
}

export default ProfileDashboard;
