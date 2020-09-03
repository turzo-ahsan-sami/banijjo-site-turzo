import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { RouteProvider } from "./context/RouteContext";
import { ShowModalProvider } from "./context/ShowModalContext";

import asyncComponent from "./asyncComponent";

import Layout from "./components/layout/base-layout";

// import HomePage from "./homePage/HomePage";
// import Search from "./product/search";
// import ProductList from "./product/productList";
// import ProductDetails from "./product/productDetails/productDetails";
// import FeatureProductsList from "./product/FeatureProductsList";
// import Vendor from "./components/vendor/vendor";

// import MoreCategory from "./product/moreCategory";
// import Policy from "./aboutUs/Policy";
// import ContactUs from "./aboutUs/ContactUs";
// import Login from "./auth/login";
// import Registration from "./auth/registration";
// import NotFoundPage from "./include/NotFoundPage";
// import WishList from "./product/wishList";
// import Shopping_Cart from "./components/shopping-cart/shopping-cart";
// import CheckOut from "./components/shopping-cart/check-out";

// import ViewProfile from "./components/user-profile/view-profile";
// import ChangeAddress from "./components/user-profile/change-address";
// import ChangePassword from "./components/user-profile/change-password";
// import MyOrders from "./components/user-profile/my-orders";

const HomePage = asyncComponent(() => import("./homePage/HomePage"));
const Search = asyncComponent(() => import("./product/search"));
const ProductList = asyncComponent(() => import("./product/productList"));
const ProductDetails = asyncComponent(() => import("./product/productDetails/productDetails"));
const FeatureProductsList = asyncComponent(() => import("./product/FeatureProductsList"));
const Vendor = asyncComponent(() => import("./components/vendor/vendor"));

const MoreCategory = asyncComponent(() => import("./product/moreCategory"));
const Policy = asyncComponent(() => import("./aboutUs/Policy"));
const ContactUs = asyncComponent(() => import("./aboutUs/ContactUs"));
const Login = asyncComponent(() => import("./auth/login"));
const Registration = asyncComponent(() => import("./auth/registration"));
const NotFoundPage = asyncComponent(() => import("./include/NotFoundPage"));
const WishList = asyncComponent(() => import("./product/wishList"));
const Shopping_Cart = asyncComponent(() => import("./components/shopping-cart/shopping-cart"));
const CheckOut = asyncComponent(() => import("./components/shopping-cart/check-out"));

const ViewProfile = asyncComponent(() => import("./components/user-profile/view-profile"));
const ChangeAddress = asyncComponent(() => import("./components/user-profile/change-address"));
const ChangePassword = asyncComponent(() => import("./components/user-profile/change-password"));
const MyOrders = asyncComponent(() => import("./components/user-profile/my-orders"));

class App extends Component {
  state = {
    isAuthenticated: false,
  };

  componentDidMount() {
    const customer_id = localStorage.getItem("customer_id");
    if (customer_id) {
      this.setState({ isAuthenticated: true });
    }
  }

  set_or_remove_authentication = (data) => {
    if (data) {
      this.setState({ isAuthenticated: true });
    } else {
      this.setState({ isAuthenticated: false });
    }
  };

  render() {
    return (
      <RouteProvider>
        <ShowModalProvider>
          <CartProvider>
            <OrderProvider>
              <Layout>
                <Route
                  path="(.+)"
                  render={() => (
                    <Fragment>
                      <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route exact path="/search/:keyName" component={Search} />
                        <Route
                          exact
                          path="/policy/:policytype"
                          component={Policy}
                        />
                        <Route
                          exact
                          // path="/productList/:cid"
                          path="/productList/:slug"
                          component={ProductList}
                        />
                        <Route
                          exact
                          // path="/productDetails/:id"
                          path="/productDetails/:slug"
                          component={ProductDetails}
                        />

                        <Route
                          exact
                          path="/featureproducts/:id"
                          component={FeatureProductsList}
                        />
                        <Route exact path="/vendor/:slug" component={Vendor} />
                        {/* <Route exact path="/vendor/:id" component={Vendor} /> */}
                        <Route
                          exact
                          path="/moreCategory"
                          component={MoreCategory}
                        />

                        <Route exact path="/cart" component={Shopping_Cart} />
                        <Route exact path="/checkout" component={CheckOut} />

                        <Route exact path="/wish" component={WishList} />
                        <Route exact path="/contactUs" component={ContactUs} />

                        {/* <Route path="/profile" component={ProfileDashboard} /> */}

                        <Route path="/profile/view-profile" component={ViewProfile} />
                        <Route path="/profile/change-address" component={ChangeAddress} />
                        <Route path="/profile/change-password" component={ChangePassword} />
                        <Route path="/profile/my-orders" component={MyOrders} />

                        <Route
                          exact
                          path="/register"
                          render={(props) => (
                            <Registration
                              {...props}
                              setAuthentication={
                                this.set_or_remove_authentication
                              }
                            />
                          )}
                        />
                        <Route
                          path="/login"
                          render={(props) => (
                            <Login
                              {...props}
                              setAuthentication={
                                this.set_or_remove_authentication
                              }
                            />
                          )}
                        />
                        <Route path="*" component={NotFoundPage} />
                      </Switch>
                    </Fragment>
                  )}
                />
              </Layout>
            </OrderProvider>
          </CartProvider>
        </ShowModalProvider>
      </RouteProvider>
    );
  }
}

export default App;
