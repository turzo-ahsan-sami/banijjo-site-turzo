import React, { Component } from "react";

import { isEqual } from "lodash";
import axios from "axios";
import SweetAlert from "sweetalert2-react";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

const emailPattern = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

const options = {
  headers: { "Content-Type": "application/json" }
};


class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loginError: "",
      Categories: [],
      textArray: [],
      allCategories: [],
      cartProducts: [],
      isAddress: false,
      checkAgreement: false,
      responseMessage: "",
      termsMessage: "",
      itemQuantityState: [],
      customerInfo: [],
      customerName: "",
      customerPhone: "",
      customerAddress: "",
      discountAmount: 0,
      promoCodeAmount: 0,
      discountDetail: [],
      promoCodeDetail: [],
      revisedCartData: [],
      cartProductsInfo: [],
      totalPrice: 0,
      totalItems: 0,
      show_alert: false,
      alert_text: ""
    };

    this.payOrder = this.payOrder.bind(this);
    this.paySsl = this.paySsl.bind(this);
    // this.addressSubmit = this.addressSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadProduct = this.loadProduct.bind(this);
    this.changeAgreement = this.changeAgreement.bind(this);
    this.checkInventory = this.checkInventory.bind(this);
    this.continueShopping = this.continueShopping.bind(this);
    this.searchPromoCode = this.searchPromoCode.bind(this);
  }
  componentDidMount() {
    // this.getCustomerInfo();
    this.getCustomerAddress();
    this.getAllCategories();
    this.gettermsConditions();
    this.getCustomerCartProducts();
  }

  getDiscounts(cartProducts) {
    fetch(base + "/api/getDiscounts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cartProducts: cartProducts,
        customerId: localStorage.customer_id
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        this.setState({
          discountAmount: response.data,
          discountDetail: response.dataDetail
        });
      });
  }

  gettermsConditions() {
    fetch(base + "/api/get_terms_conditions", {
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(termsConditions => {
        this.setState({ termsMessage: termsConditions.data });
        return false;
      });
  }

  changeAgreement() {
    if (this.state.checkAgreement === false) {
      this.setState({ checkAgreement: !this.state.checkAgreement }, () => {
        console.log("aaa", this.state);
      });
    } else {
      this.setState({ checkAgreement: !this.state.checkAgreement }, () => {
        console.log("bbb", this.state);
      });
    }
  }

  requiredFunc() {
    let cartData = JSON.parse(localStorage.getItem("cart"));
    let productIds = [];

    if (cartData) {
      cartData.forEach(function(val, index) {
        productIds.push(val.productId);
      });

      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedCartData = [];

      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        cartData.forEach(function(val, key) {
          if (parseInt(valParent) === parseInt(val.productId)) {
            totalCount += val.quantity;
          }
        });
        revisedCartData.push({ productId: valParent, quantity: totalCount });
      });

      let revisedCartDataKeyValue = [];
      revisedCartData.forEach(function(value, key) {
        revisedCartDataKeyValue[value.productId] = value.quantity;
      });
      return revisedCartDataKeyValue;
    } else {
      return [];
    }
  }



  getProductsInfoByCartData = (cartData, customerId = 0) => {
    
    const data = JSON.stringify({ cartData, customerId });
    const url = `${base}/api/getCustomerCartProducts`;

    axios.post(url, data, options).then(res => {
      const cartProductsInfo = res.data.cartProducts;
      if (localStorage.customer_id) {
        this.calcTotalItems(cartProductsInfo);
        this.getDiscounts(cartProductsInfo);
      }
      const totalPrice = this.computeTotalPrice(cartProductsInfo);
      this.setState({ cartProductsInfo, totalPrice });
    });
  };

  getCustomerCartProducts() {
    if (!localStorage.customer_id) {
      let cartData = JSON.parse(localStorage.getItem("cart"));

      if (cartData) {
        this.calcTotalItems(cartData);
        this.getProductsInfoByCartData(cartData);
      } else {
        this.setState({
          revisedCartDataKeyValue: [],
          itemQuantityState: 0,
          cartProducts: []
        });
      }

      this.getDiscounts(cartData);
    } else {
      this.getProductsInfoByCartData([], localStorage.customer_id * 1);
    }
  }

  // Helper Functions Starts
  updateLocalStorage = (productsInfo, key) => {
    const data = productsInfo.map(({ color, size, id, quantity }) => ({
      productId: id,
      colorId: color.id,
      sizeId: size.id,
      quantity
    }));
    this.calcTotalItems(data);
    if (localStorage.getItem(key)) localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(data));
  };

  computeTotalPrice = cartProducts => {
    let totalPrice = 0;
    for (const item of cartProducts) {
      totalPrice += item.quantity * item.productPrice;
    }
    return totalPrice;
  };

  calcTotalItems = cartData => {
    let totalItems = 0;
    for (const cartDatum of cartData) {
      totalItems += cartDatum.quantity;
    }
    this.setState({ totalItems });
  };


  // Helper Functions Ends

  onClickPlusHandler = data => {
    const sendData = { ...data };
    delete sendData.quantity;
    const cartProductsInfo = this.state.cartProductsInfo.map(data => {
      const newData = { ...data };
      delete newData.quantity;
      return isEqual(newData, sendData) && data.quantity < 5
        ? { ...data, quantity: data.quantity + 1 }
        : data;
    });

    const totalPrice = this.computeTotalPrice(cartProductsInfo);

    if (!localStorage.getItem("customer_id")) {
      this.updateLocalStorage(cartProductsInfo, "cart");
      this.setState({ cartProductsInfo, totalPrice });
    } else if (localStorage.getItem("customer_id")) {
      const data = JSON.stringify({
        customerId: localStorage.customer_id,
        table_name: "temp_sell",
        cartProductsInfo
      });
      const url = `${base}/api/updateCustomerCartProducts`;

      axios.post(url, data, options).then(res => {
        // console.log(res.data);
        if (res.data.data) {
          this.calcTotalItems(cartProductsInfo);
          this.setState({ cartProductsInfo, totalPrice });
        }
      });
    }
  };

  onClickMinusHandler = data => {
    const sendData = { ...data };
    delete sendData.quantity;
    const cartProductsInfo = this.state.cartProductsInfo.map(data => {
      const newData = { ...data };
      delete newData.quantity;
      return isEqual(newData, sendData) && data.quantity > 1
        ? { ...data, quantity: data.quantity - 1 }
        : data;
    });

    const totalPrice = this.computeTotalPrice(cartProductsInfo);

    if (!localStorage.getItem("customer_id")) {
      this.updateLocalStorage(cartProductsInfo, "cart");
      this.setState({ cartProductsInfo, totalPrice });
    } else if (localStorage.getItem("customer_id")) {
      const data = JSON.stringify({
        customerId: localStorage.customer_id,
        table_name: "temp_sell",
        cartProductsInfo
      });
      const url = `${base}/api/updateCustomerCartProducts`;

      axios.post(url, data, options).then(res => {
        console.log(res.data);
        if (res.data.data) {
          this.calcTotalItems(cartProductsInfo);
          this.setState({ cartProductsInfo, totalPrice });
        }
      });
    }
  };

  onClickDeleteHandler = data => {
    const cartProductsInfo = this.state.cartProductsInfo.filter(
      item => !isEqual(item, data)
    );

    const totalPrice = this.computeTotalPrice(cartProductsInfo);

    if (!localStorage.customer_id) {
      this.updateLocalStorage(cartProductsInfo, "cart");

      this.setState({ cartProductsInfo, totalPrice });
    } else {
      const url = `${base}/api/deleteCustomerCartProducts`;
      const body = JSON.stringify({
        customerId: localStorage.customer_id,
        table_name: "temp_sell",
        cartProductInfo: data
      });

      axios.post(url, body, options).then(res => {
        if (res.data.data) {
          this.calcTotalItems(cartProductsInfo);
          this.setState({ cartProductsInfo, totalPrice });
        }
      });
    }
  };

  payOrder() {
    fetch(base + "/api/payOrder", {
      method: "POST",
      crossDomain: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerId: localStorage.customer_id * 1,
        discountAmount: this.state.discountAmount,
        discountDetail: this.state.discountDetail,
        promoCodeAmount: this.state.promoCodeAmount,
        promoCodeDetail: this.state.promoCodeDetail
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        // console.log(response);
        if (response.data === true) {
          this.setState({ responseMessage: response.message });
          var link = document.getElementById("successCartMessage");
          var cartModalclose = document.getElementById("cartModalClose");
          var paymentModalClose = document.getElementById("paymentModalClose");
          paymentModalClose.click();
          cartModalclose.click();
          link.click();
        } else if (response.data === false) {
          this.setState({ responseMessage: response.message });
          link = document.getElementById("successCartMessage");
          cartModalclose = document.getElementById("cartModalClose");
          paymentModalClose = document.getElementById("paymentModalClose");
          paymentModalClose.click();
          cartModalclose.click();
          link.click();
        }
      });
  }

  paySsl() {
    fetch(base + "/api/paySsl", {
      method: "POST",
      crossDomain: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerId: localStorage.customer_id,
        discountAmount: this.state.discountAmount,
        discountDetail: this.state.discountDetail,
        promoCodeAmount: this.state.promoCodeAmount,
        promoCodeDetail: this.state.promoCodeDetail
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        // console.log(response.data);
        window.location.href = response.data;
      });
  }

  getAllCategories() {
    fetch(base + "/api/all_category_list_more", {
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(categories => {
        this.setState({ Categories: categories.data });
        return false;
      });
  }

  loadProduct() {
    window.location.href = "/";
  }

  getCustomerAddress = () => {
    const customerId = localStorage.customer_id ? localStorage.customer_id : 0;

    if (customerId) {
      axios.get(`${base}/api/get_customer_info/${customerId}`).then(res => {
        const { name, address, phone_number } = res.data;
        this.setState({
          customerName: name ? name : "",
          customerAddress: address ? address : "",
          customerPhone: phone_number ? phone_number : ""
        });
      });
    }
  };

  addressSubmit = event => {
    event.preventDefault();

    fetch(base + "/api/saveCustomerAddress", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.customerName,
        phone_number: this.state.customerPhone,
        address: this.state.customerAddress,
        city_id: event.target.city.value,
        district_id: event.target.district.value,
        area_id: event.target.area.value,
        customerId: localStorage.customer_id
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (!response.error) {
          this.setState({ isAddress: true });
          const addressModalClose = document.getElementById("closeAddress");
          const cartModalclose = document.getElementById("cartModalClose");
          const ShippingModalOpen = document.getElementById(
            "ShippingModalButton"
          );
          addressModalClose.click();
          cartModalclose.click();
          ShippingModalOpen.click();
        }
      });
  };

  searchPromoCode(event) {
    event.preventDefault();
    let promoCodeInput = event.target.promoCodeText.value;
    let totalAmount = event.target.totalAmount.value;

    fetch(base + "/api/getPromoCodeAmount", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        promoCodeInput: promoCodeInput,
        totalAmount: totalAmount,
        customerId: localStorage.customer_id
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data > 0) {
          this.setState({
            promoCodeAmount: response.data,
            promoCodeDetail: response.dataDetail
          });
        }
        var hidePromoCodeModal = document.getElementById("hidePromoCodeModal");
        hidePromoCodeModal.click();
      });
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onChangeEmailHandler = e => {
    if (this.state.loginError !== "") {
      this.setState({ loginError: "" });
    }
    this.setState({ email: e.target.value });
  };

  onChangePasswordHandler = e => {
    if (this.state.loginError !== "") {
      this.setState({ loginError: "" });
    }
    this.setState({ password: e.target.value });
  };

  customerLoginSubmit = e => {
    e.preventDefault();

    const { email } = this.state;
    const { password } = this.state;

    fetch(base + "/api/loginCustomerInitial", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        // console.log('aa', response);
        if (!response.error) {
          localStorage.setItem("customer_id", response.data);
          var link = document.getElementById("successCartMessage");
          var hide = document.getElementById("hideLogin");
          hide.click();
          link.click();
        } else if (response.error) {
          this.setState({
            loginError: "Login Fail! Invalid Credentials",
            password: ""
          });
        }
      });
  };

  createAccountNext(event) {
    event.preventDefault();
    if (event.target.email.value === "" || event.target.email.value == null) {
      this.setState({
        emailError: "Email cannot be empty"
      });
      return false;
    } else if (
      !emailPattern.test(event.target.email.value) &&
      event.target.email.value > 0
    ) {
      this.setState({
        emailError: "Enter a valid Password"
      });
      return false;
    } else if (
      event.target.password.value === "" ||
      event.target.password.value == null
    ) {
      this.setState({
        passwordError: "Password cannot be empty"
      });
      return false;
    } else {
      let cartData = JSON.parse(localStorage.getItem("cart"));
      let productIds = [];
      cartData.forEach(function(val, index) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedCartData = [];
      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        cartData.forEach(function(val, key) {
          if (parseInt(valParent) === parseInt(val.productId)) {
            totalCount += val.quantity;
          }
        });
        revisedCartData.push({ productId: valParent, quantity: totalCount });
      });

      fetch(base + "/api/saveCustomerInitial", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: event.target.email.value,
          password: event.target.password.value,
          cartData: revisedCartData
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          if (response.data !== "") {
            localStorage.setItem("customer_id", response.data);
            var hideLogin = document.getElementById("hideLogin");
            var link = document.getElementById("successCartMessage");
            hideLogin.click();
            link.click();
          }
        });
    }
  }

  checkInventory(type) {
    const { cartProductsInfo } = this.state;
    console.log(cartProductsInfo);

    if (cartProductsInfo.length > 0) {
      fetch(base + "/api/checkInventory", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartProducts: cartProductsInfo
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          // console.log('response... ', response)
          if (response) {
            if (type === "Order Place") {
              var LoginRegisterModal = document.getElementById(
                "LoginRegisterModalButton"
              );
              var ShippingModalOpen = document.getElementById(
                "ShippingModalButton"
              );
              if (!localStorage.customer_id) {
                LoginRegisterModal.click();
              } else {
                ShippingModalOpen.click();
              }
            } else if (type === "Order Confirm") {
              var PaymentModalButton = document.getElementById(
                "PaymentModalButton"
              );
              PaymentModalButton.click();
            }
          } else {
            this.setState({ show_alert: true });
            this.setState({ alert_text: response.message });
          }
        });
    } else {
      this.setState({ show_alert: true });
      this.setState({ alert_text: "Your cart is empty!" });
    }
  }

  continueShopping = () => {
    window.location.href='/';
  }

  paymentModalCloseHandler = () => {
    // const paymentModalClose = document.getElementById("paymentModalClose");
    const ShippingModalOpen = document.getElementById("ShippingModalButton");
    // paymentModalClose.click();
    ShippingModalOpen.click();
  };

  promoCodeModalDisplay() {
    var PromoCodeModalButton = document.getElementById("PromoCodeModalButton");
    PromoCodeModalButton.click();
  }

  render() {
    let totalAmount = 0;

    return (
      <React.Fragment>

        <button
          style={{ display: "none !important" }}
          id="successCartMessage"
          type="button"
          data-toggle="modal"
          data-target="#exampleModalShipping"
        >
          {""}
        </button>

        <SweetAlert
          show={this.state.show_alert}
          title="Warning!"
          type= "warning"
          text={this.state.alert_text}
          onConfirm={() => this.setState({ show_alert: false })}
        />


        <div className="container">
        <div className="row">

          <div className="col-lg-8 col-md-6">
            <div className="card">
              <div className="card-header bg-success text-light text-center"></div>
              
              <div className="card-body">
                {this.state.cartProductsInfo.length > 0 &&
                  this.state.cartProductsInfo.map(item => (    
                  <div className="row" key={item.product_name}>
                      <div className="col-lg-3 col-md-12 col-sm-12">
                        <img
                          src={`${fileUrl}/upload/product/compressedProductImages/${item.home_image}`}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12 text-sm-center text-lg-left">
                        <h1 className="h5">{item.product_name}</h1>
                        {item.color && 
                          <p className="mb-1">
                            Color:&nbsp;
                            <b>{item.color.colorName}</b>
                          </p>
                        }
                        {item.size && 
                          <p className="mb-1">
                            Size:&nbsp;
                            <b>{item.size.size}</b>
                          </p>
                        }
                        <p className="mb-1">
                          <em>৳&nbsp;</em> {item.productPrice}
                        </p>
                      </div>
                      <div className="col-lg-3 col-md-12 col-sm-12 my-auto text-sm-center text-lg-left">
                        <div className="quantity">
                          <div className="quantity-select">
                            {/*Minus Button*/}
                            <div
                              onClick={() =>
                                this.onClickMinusHandler(item)
                              }
                              className="entry value-minus1"
                            >
                              &nbsp;
                            </div>
                            <div className="entry value1">
                              <span>{item.quantity}</span>
                            </div>
                            {/*Plus Button*/}
                            <div
                              onClick={() =>
                                this.onClickPlusHandler(item)
                              }
                              className="entry value-plus1 active"
                            >
                              &nbsp;
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-12 col-sm-12 my-auto  text-sm-center  text-lg-right">
                          <button
                            onClick={() => this.onClickDeleteHandler(item)}
                            type="button"
                            className="btn btn-outline-danger btn-xs"
                            style={{borderColor:"transparent",background:"transparent" }}
                          >
                            <i
                              className="fa fa-trash"
                              aria-hidden="true"
                              style={{ fontSize: "24px", color: "#EB1C22" }}
                            >
                              {""}
                            </i>
                          </button>                          
                        </div>
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <div className="text-right">
                  <p className="my-0">
                    {' '}
                    Total price:
                    <b>
                      <em>৳&nbsp;</em> {this.state.totalPrice}
                    </b>
                  </p>

                  <button
                    style={{ display: 'none' }}
                    id="LoginRegisterModalButton"
                    type="button"
                    data-toggle="modal"
                    data-target="#LoginRegisterModal"
                  ></button>
                  <button
                    style={{ display: 'none' }}
                    id="ShippingModalButton"
                    type="button"
                    data-toggle="modal"
                    data-target="#ShippingModal"
                  ></button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading text-center">
                <h4>Order Summary</h4>
              </div>
              <div className="panel-body">
                <div className="col-md-12">
                  <strong className="strong-left-subtotal">
                    Subtotal (
                    {this.state.totalItems === 0 || this.state.totalItems === 1
                      ? `${this.state.totalItems} item`
                      : `${this.state.totalItems} items`}
                    )
                  </strong>
                  <div className="float-right">
                    <span>
                      <em>৳ &nbsp;</em>
                    </span>
                    <span>{this.state.totalPrice}</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong className="strong-left-vat">VAT & Tax</strong>
                  <div className="float-right">
                    <span>
                      <em>৳ &nbsp;</em>
                    </span>
                    <span>0</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong className="strong-left-discount">Discount</strong>
                  <div className="float-right">
                    <span>
                      <em>৳ &nbsp;</em>
                    </span>
                    <span>{this.state.discountAmount}</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong>
                    Promo Code
                    <span
                      onClick={this.promoCodeModalDisplay}
                      style={{ cursor: 'pointer' }}
                      className="badge badge-success btn-apply rounded"
                    >
                      Apply
                    </span>
                  </strong>
                  <div className="float-right">
                    <span>
                      <em>৳ &nbsp;</em>
                    </span>
                    <span>{this.state.promoCodeAmount}</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong className="strong-left-vat">Shipping</strong>
                  <div className="float-right">
                    <span>
                      <em>৳ &nbsp;</em>
                    </span>
                    <span>0</span>
                  </div>
                  <hr />
                </div>
                <div className="col-md-12">
                  <strong className="strong-left-order">Order Total</strong>
                  <div className="float-right">
                    <span>
                      <em>৳ &nbsp;</em>
                    </span>
                    <span>
                      {this.state.totalPrice -
                        this.state.discountAmount -
                        this.state.promoCodeAmount}</span>
                  </div>
                  <hr />
                </div>
                <button 
                  onClick={() => this.checkInventory("Order Place")}
                  className="btn btn-primary btn-block btn-place-order"
                >
                  Place Order
                </button>

                <button
                  onClick={() => window.location.href = "/checkout"}
                  className="btn btn-primary btn-block btn-continue-shop"
                  type="button"
                >
                  Checkout
                </button>

                <button
                  onClick={() => this.continueShopping()}
                  className="btn btn-primary btn-block btn-continue-shop"
                  id="PromoCodeModalButton"
                  type="button"
                  data-toggle="modal"
                  data-target="#PromoCodeModal"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </div>
        
        </div>
        </div>


        {/* exampleModalShipping */}
        <div
          className="modal"
          id="exampleModalShipping"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ width: "900px" }}>
              <div className="modal-header">
                <h5 className="modal-title" style={{ textAlign: "center" }}>
                  &nbsp;
                </h5>
                <button
                  onClick={this.loadProduct}
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{ marginTop: "-25px" }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-1 col-lg-1">
                    <i
                      className="fa fa-check"
                      style={{
                        fontSize: "50px",
                        color: "white",
                        backgroundColor: "#009345",
                        borderRadius: "40px"
                      }}
                    ></i>
                  </div>
                  <div className="col-md-11 col-lg-11">
                    <p style={{ color: "#ec1c24" }}>
                      {this.state.responseMessage}.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-1 col-lg-1"></div>
                  <div className="col-md-3 col-lg-3"></div>
                  <div className="col-md-3 col-lg-3">
                    <a
                      href={frontEndUrl}
                      // href="https://localhost:3000"
                      className="btn btn-success"
                      style={{
                        backgroundColor: "#ec1c24",
                        borderColor: "#ec1c24"
                      }}
                    >
                      Buy More Product
                    </a>
                  </div>
                </div>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        
        </div>
        {/* End of exampleModalShipping */}
        
        {/* LoginRegisterModal */}
        <div
          className="modal"
          id="LoginRegisterModal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div
              className="modal-content"
            >
              <div
                className="modal-header"
              >
                
                <button
                  id="hideLogin"
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
                <div className="frameTopSelection">
                  <span
                    className="helperframeTopSelection"
                    style={{ background: "white" }}
                  >
                    <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                  </span>
                </div>
              </div>

              <ul className="nav nav-tabs">
                <li className="active" style={{ paddingLeft: "80px" }}>
                  <a data-toggle="tab" href="#registerCart">
                    REGISTER
                  </a>
                </li>
                <li style={{ paddingLeft: "30px" }}>
                  <a data-toggle="tab" href="#loginCart">
                    SIGN IN
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div id="registerCart" className="tab-pane fade in active">
                  <form
                    className="form-signin"
                    onSubmit={this.createAccountNext}
                  >
                    <div className="modal-body">
                      <div className="form-label-group">
                        <input
                          type="email"
                          id="inputEmail"
                          className="form-control"
                          placeholder="Enter Email"
                          required
                          autoFocus
                        />
                        {this.state.emailError ? (
                          <span style={{ color: "red" }}>
                            {this.state.emailError}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="form-label-group">
                        <input
                          type="password"
                          id="inputPassword"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          required
                        />
                        {this.state.passwordError ? (
                          <span style={{ color: "red" }}>
                            {this.state.passwordError}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="submit"
                        className="btn btn-danger registerSubmit"
                        style={{
                          backgroundColor: "#009345",
                          borderColor: "#009345"
                        }}
                      >
                        Create Account
                      </button>
                      <p align="right">
                        <a
                          href="!#"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {""}
                        </a>
                      </p>
                    </div>
                  </form>

                </div>

                <div id="loginCart" className="tab-pane fade">
              

                  <form
                    className="form-signin"
                    onSubmit={this.customerLoginSubmit}
                  >
                    <div className="modal-body">
                      <div className="form-label-group">
                        <input
                          type="email"
                          id="inputEmail"
                          className="form-control"
                          placeholder="Enter Email"
                          name="email"
                          value={this.state.email}
                          onChange={this.onChangeEmailHandler}
                          required
                          autoFocus
                        />
                        {this.state.emailError ? (
                          <span style={{ color: "red" }}>
                            {this.state.emailError}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="form-label-group">
                        <input
                          type="password"
                          id="inputPassword"
                          className="form-control"
                          placeholder="Enter Password"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChangePasswordHandler}
                          required
                        />
                        {this.state.passwordError ? (
                          <span style={{ color: "red" }}>
                            {this.state.passwordError}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="submit"
                        className="btn btn-danger loginSubmit"
                        style={{
                          backgroundColor: "#009345",
                          borderColor: "#009345"
                        }}
                      >
                        Login
                      </button>
                      <p align="center" style={{ color: "#ec1c24" }}>
                        {this.state.loginError !== "" &&
                          this.state.loginError}
                      </p>
                      <p align="right">
                        <a
                          style={{ color: "#ec1c24" }}
                          href="!#"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Forgot Password?
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        
        </div>
        {/* end of LoginRegisterModal */}


        {/* ShippingModal */}
        <div className="modal fade" id="ShippingModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Place Order</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-md-12">
                  <strong>Total</strong>
                  <div className="float-right">
                    <i
                      className="fa fa-angle-right"
                      aria-hidden="true"
                      style={{ fontSize: "32px" }}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <h4>
                    ৳
                    {this.state.totalPrice -
                      (this.state.discountAmount +
                        this.state.promoCodeAmount)}
                  </h4>
                  <div className="float-right">{""}</div>
                </div>

                <div className="col-md-12">
                <div className="float-left"> <strong>Shipping Information</strong></div>
                  <div className="float-right">
                    <i
                      className="fa fa-angle-right mb-2"
                      aria-hidden="true"
                      style={{ fontSize: "32px" }}
                    >
                      {""}
                    </i>
                  </div>
                  <br/>
                 
                  <button
                    type="button"
                    // className="next-btn next-medium next-btn-primary next-btn-text mt-1"
                    className="btn-primary mt-1"
                    data-toggle="modal"
                    data-target="#addressModal"
                  >
                    <i className="fa fa-plus" style={{ fontSize: "15px" }}>
                      {""}
                    </i>{" "}
                    Add new address
                  </button>
                </div>

                
               

                <div className="col-md-12">
                  <input
                    style={{ width: "20px" }}
                    onChange={this.changeAgreement}
                    name="agree"
                    type="checkbox"
                  />
                  <span> Agree terms and conditions</span>
                  <br />
                  <a data-toggle="modal" data-target="#termsModal" href="!#">
                    View terms & conditions
                  </a>
                </div>


              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                 <button
                  style={{ display: "none !important" }}
                  id="PaymentModalButton"
                  type="button"
                  data-toggle="modal"
                  data-target="#exampleModalPayment"
                >
                  {""}
                </button>
                <button
                  onClick={() => this.checkInventory("Order Confirm")}
                  disabled={
                    this.state.customerAddress && this.state.checkAgreement
                      ? false
                      : true
                  }
                  className="btn btn-danger"
                  style={{
                    backgroundColor: "#EB1C22",
                    borderColor: "#EB1C22"
                  }}
                >
                  {" "}
                  Order Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
    
        {/* End of ShippingModal */}

        {/* termsModal */}
        <div
          style={{ marginLeft: "20%", background: "none" }}
          className="modal"
          id="termsModal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div
              className="modal-content"
              style={{ width: "500px", minHeight: "500px" }}
            >
              <div className="modal-header" style={{ textAlign: "center" }}>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
                <div className="frameTopSelection">
                  <span
                    className="helperframeTopSelection"
                    style={{ background: "white" }}
                  >
                    <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                  </span>
                </div>
                Terms and Conditions
              </div>
              <div className="modal-body">{this.state.termsMessage}</div>
            </div>
          </div>
        
        </div>
        {/* End of termsModal */}
                  
        {/* exampleModalPayment */}

        <div className="modal fade" id="exampleModalPayment" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  // onClick={this.paymentModalCloseHandler}
                  id="paymentModalClose"
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
               
              </div>

              <ul className="nav nav-tabs" style={{ marginLeft: "10%" }}>
                <li className="active" style={{ paddingLeft: "80px" }}>
                  <a data-toggle="tab" href="#cod">
                    Cash on Delivery
                  </a>
                </li>
                <li style={{ paddingLeft: "30px" }}>
                  <a data-toggle="tab" href="#ssl">
                    SSLCOMMERZE
                  </a>
                </li>
              
              </ul>

              <div className="tab-content">
                <div id="cod" className="tab-pane fade in active">
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div
                          className="form-group"
                          style={{ marginLeft: "133px" }}
                        >
                          <label className="control-label">
                            Total Amount :{" "}
                          </label>
                          <span>
                            {" "}
                            ৳
                            {this.state.totalPrice -
                              this.state.discountAmount -
                              this.state.promoCodeAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-md-2 col-lg-2"
                        style={{ marginLeft: "133px" }}
                      >
                        <button
                          onClick={this.payOrder}
                          type="button"
                          className="btn btn-danger"
                          style={{ backgroundColor: "#FF4747" }}
                        >
                          Pay Cash
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer"></div>
                </div>
                <div id="ssl" className="tab-pane fade">
                  <div className="row">
                    <div className="col-md-6 col-lg-6">
                      <div
                        className="form-group"
                        style={{ marginLeft: "65px" }}
                      >
                        <label className="control-label">
                          Total Amount :{" "}
                        </label>
                        <span>
                          {" "}
                          ৳
                          {this.state.totalPrice -
                            this.state.discountAmount -
                            this.state.promoCodeAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col-md-2 col-lg-2"
                      style={{ marginLeft: "65px" }}
                    >
                      <button
                        type="button"
                        onClick={this.paySsl}
                        className="btn btn-danger"
                        style={{ backgroundColor: "#FF4747", wicth: "150%" }}
                      >
                        Pay With SSL
                      </button>
                    </div>
                  </div>
                  <div className="modal-footer"></div>
                </div>
          
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal"
          id="exampleModalPayment"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ width: "900px" }}>
              <div className="modal-header">
                <button
                  // onClick={this.paymentModalCloseHandler}
                  id="paymentModalClose"
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
                <div className="frameTopSelection">
                  <span
                    className="helperframeTopSelection"
                    style={{ background: "white" }}
                  >
                    <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                  </span>
                </div>
              </div>

              <ul className="nav nav-tabs" style={{ marginLeft: "10%" }}>
                <li className="active" style={{ paddingLeft: "80px" }}>
                  <a data-toggle="tab" href="#cod">
                    Cash on Delivery
                  </a>
                </li>
                <li style={{ paddingLeft: "30px" }}>
                  <a data-toggle="tab" href="#ssl">
                    SSLCOMMERZE
                  </a>
                </li>
              
              </ul>

              <div className="tab-content">
                <div id="cod" className="tab-pane fade in active">
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div
                          className="form-group"
                          style={{ marginLeft: "133px" }}
                        >
                          <label className="control-label">
                            Total Amount :{" "}
                          </label>
                          <span>
                            {" "}
                            ৳
                            {this.state.totalPrice -
                              this.state.discountAmount -
                              this.state.promoCodeAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-md-2 col-lg-2"
                        style={{ marginLeft: "133px" }}
                      >
                        <button
                          onClick={this.payOrder}
                          type="button"
                          className="btn btn-danger"
                          style={{ backgroundColor: "#FF4747" }}
                        >
                          Pay Cash
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer"></div>
                </div>
                <div id="ssl" className="tab-pane fade">
                  <div className="row">
                    <div className="col-md-6 col-lg-6">
                      <div
                        className="form-group"
                        style={{ marginLeft: "65px" }}
                      >
                        <label className="control-label">
                          Total Amount :{" "}
                        </label>
                        <span>
                          {" "}
                          ৳
                          {this.state.totalPrice -
                            this.state.discountAmount -
                            this.state.promoCodeAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col-md-2 col-lg-2"
                      style={{ marginLeft: "65px" }}
                    >
                      <button
                        type="button"
                        onClick={this.paySsl}
                        className="btn btn-danger"
                        style={{ backgroundColor: "#FF4747", wicth: "150%" }}
                      >
                        Pay With SSL
                      </button>
                    </div>
                  </div>
                  <div className="modal-footer"></div>
                </div>
          
              </div>
            </div>
          </div>
        
        </div>
        {/* End of exampleModalPayment */}

        {/* End of addressModal */}

        <div className="modal fade" id="addressModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Shipping Information</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h4>Shipping Information</h4>
                <form onSubmit={this.addressSubmit}>
                  <div className="row">
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">Name</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          value={this.state.customerName}
                          className="form-control"
                          name="customerName"
                          placeholder="Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">Phone Number</label>
                        <input
                          type="text"
                          onChange={this.handleInputChange}
                          value={this.state.customerPhone}
                          name="customerPhone"
                          className="form-control"
                          placeholder="Mobile"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">District</label>
                        <select className="form-control" name="district">
                          <option value="1">Dhaka</option>
                          <option value="2">Rajshahi</option>
                          <option value="3">Khulna</option>
                          <option value="4">Rangpur</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">City</label>
                        <select className="form-control" name="city">
                          <option value="1">Dhaka</option>
                          <option value="2">Rajshahi</option>
                          <option value="3">Khulna</option>
                          <option value="4">Rangpur</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">Area</label>
                        <select className="form-control" name="area">
                          <option value="1">Mirpur</option>
                          <option value="2">Gulshan</option>
                          <option value="3">Matikata</option>
                          <option value="4">Banani</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">Address</label>
                        <textarea
                          style={{ height: "100px" }}
                          onChange={this.handleInputChange}
                          name="customerAddress"
                          className="form-control"
                          value={this.state.customerAddress}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-2 col-lg-2">
                      <button
                        type="submit"
                        className="btn btn-danger"
                        style={{ backgroundColor: "#FF4747" }}
                      >
                        save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
             
              </div>
            </div>
          </div>
        </div>
  
        {/* addressModal */}

        {/* paymentModal */}

        <div className="modal fade" id="paymentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Payment Information</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h4>Payment Methods</h4>

                <div className="row">
                  <div className="col-md-3 col-lg-3">
                    <img src="image/card.png" alt={`img`} />
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <img src="image/card2.png" alt={`img`} />
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <img src="image/card3.png" alt={`img`} />
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <img src="image/card4.png" alt={`img`} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 col-lg-4">
                    <div className="form-group">
                      <label className="control-label">CARD NUMBER</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>

                  <div className="col-md-4 col-lg-4">
                    <div className="form-group" />
                  </div>

                  <div className="col-md-4 col-lg-4">
                    <div className="form-group">
                      <label className="control-label">CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="000"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label className="control-label">CARD HOLDER</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="NAME HERE"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label className="control-label">EXPIRES</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-2 col-lg-2">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ backgroundColor: "#FF4747" }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
             
              </div>
            </div>
          </div>
        </div>
 
        {/* End of paymentModal */}

        

      </React.Fragment>
    );
  }
}
export default ShoppingCart;


