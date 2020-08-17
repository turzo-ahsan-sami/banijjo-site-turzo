import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { RouteProvider } from "./context/RouteContext";
import { ShowModalProvider } from "./context/ShowModalContext";

import Layout from "./components/layout/base-layout";
import HomePage from "./homePage/HomePage";
import Search from "./product/search";
import ProductList from "./product/productList";
import ProductDetails from "./product/productDetails/productDetails";
import FeatureProductsList from "./product/FeatureProductsList";
import Vendor from "./components/vendor/vendor";
import MoreCategory from "./product/moreCategory";
import Policy from "./aboutUs/Policy";
import ContactUs from "./aboutUs/ContactUs";
import Login from "./auth/login";
import Registration from "./auth/registration";
import ProfileDashboard from "./profile-page/profile-dashboard";
import NotFoundPage from "./include/NotFoundPage";
import WishList from "./product/wishList";
import Shopping_Cart from "./components/shopping-cart/shopping-cart";
import CheckOut from "./components/shopping-cart/check-out";

// const Layout = React.lazy(() => import("./components/layout/base-layout"));
// const HomePage = React.lazy(() => import("./homePage/HomePage"));
// const Search = React.lazy(() => import("./product/search"));
// const ProductList = React.lazy(() => import("./product/productList"));
// const ProductDetails = React.lazy(() => import("./product/productDetails/productDetails"));
// const FeatureProductsList = React.lazy(() => import("./product/FeatureProductsList"));
// const Vendor = React.lazy(() => import("./components/vendor/vendor"));
// const MoreCategory = React.lazy(() => import("./product/moreCategory"));
// const Policy = React.lazy(() => import("./aboutUs/Policy"));
// const ContactUs = React.lazy(() => import("./aboutUs/ContactUs"));
// const Login = React.lazy(() => import("./auth/login"));
// const Registration = React.lazy(() => import("./auth/registration"));
// const ProfileDashboard = React.lazy(() => import("./profile-page/profile-dashboard"));
// const NotFoundPage = React.lazy(() => import("./include/NotFoundPage"));
// const WishList = React.lazy(() => import("./product/wishList"));
// const Shopping_Cart = React.lazy(() => import("./components/shopping-cart/shopping-cart"));
// const CheckOut = React.lazy(() => import("./components/shopping-cart/check-out"));




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
                        <Route path="/profile" component={ProfileDashboard} />

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
