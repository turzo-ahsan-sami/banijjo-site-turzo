import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CartItems from "./cart-items";
import OrderSummary from "./order-summary";
import {
  base,
  frontEndUrl,
  fileUrl,
  emailPattern,
  options,
} from "../../utils/common-helpers";
import { comma_separate_numbers } from "../../utils/utils";

const CheckOut = () => {
  const history = useHistory();

  const [customerId, set_customerId] = useState(localStorage.customer_id);
  const [cartProducts, set_cartProducts] = useState([]);

  const [orderTotalAmount, set_orderTotalAmount] = useState(0);
  const [discount_Amount, set_discountAmount] = useState(0);
  const [discountDetail, set_discountDetail] = useState([]);
  const [promo_Amount, set_promoAmount] = useState(0);
  const [promoCodeDetail, set_promoCodeDetail] = useState([]);

  const [isShipAddressDiff, set_isShipAddressDiff] = useState(false);

  const [hasCustomerAddress, set_hasCustomerAddress] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
  });

  const [name, set_name] = useState("");
  const [phone_number, set_phone_number] = useState("");
  const [email, set_email] = useState("");
  const [address, set_address] = useState("");
  const [zipcode, set_zipcode] = useState("");

  const [city_id, set_city_id] = useState("");
  const [district_id, set_district_id] = useState("");
  const [area_id, set_area_id] = useState("");

  const [alert_text, set_alert_text] = useState(
    "Could not complete purchse. Please try again later."
  );

  useEffect(() => {
    getCustomerInfo();
  }, []);

  const getCustomerInfo = () => {
    const customerId = localStorage.customer_id ? localStorage.customer_id : 0;
    if (customerId) {
      axios.get(`${base}/api/get_customer_info/${customerId}`).then((res) => {
        const { name, address, phone_number } = res.data;
        setCustomerInfo({
          customerName: name ? name : "",
          customerAddress: address ? address : "",
          customerPhone: phone_number ? phone_number : "",
        });

        set_hasCustomerAddress(true);
      });
    }
  };

  const orderTotal = (data) => {
    set_orderTotalAmount(data);
  };

  const promoAmount = (data) => {
    set_promoAmount(data);
  };

  const discountAmount = (data) => {
    set_discountAmount(data);
  };

  const promoCodeDetails = (data) => {
    set_promoCodeDetail(data);
  };

  const discountDetails = (data) => {
    set_discountDetail(data);
  };

  const cartItemInfo = (data) => {
    set_cartProducts(data);
  };

  const loginClickHandler = () => {
    closeModal("authModalCloseButton");
    history.push("/login");
  };

  const registerClickHandler = () => {
    closeModal("authModalCloseButton");
    history.push("/register");
  };

  const handleShipCheck = (e) => {
    set_isShipAddressDiff(e.target.checked);
  };

  const placeOrder = () => {
    if (!customerId) {
      showAuthModal();
      return;
    }
    if (cartProducts.length == 0) {
      set_alert_text("Your cart is empty!");
      // showAlertModal();
      let link = document.getElementById("warningModalButton");
      link.click();
      return;
    }
    checkInventory();
  };

  const checkInventory = () => {
    let tempdata = [];
    cartProducts.forEach((cartItem) => {
      let item = {
        color: cartItem.hasOwnProperty("color") ? cartItem.color.id : 0,
        size: cartItem.hasOwnProperty("size") ? cartItem.size.id : 0,
        id: cartItem.id,
        quantity: cartItem.quantity,
      };
      tempdata.push(item);
    });

    const data = JSON.stringify({ cartProducts: tempdata });
    const url = `${base}/api/checkInventory`;

    axios
      .post(url, data, options)
      .then(function (response) {
        if (response.data) {
          var link = document.getElementById("PaymentModalButton");
          link.click();
        } else {
          set_alert_text(response.message);
          // showAlertModal();
          let link = document.getElementById("warningModalButton");
          link.click();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const payOrder = () => {
    fetch(base + "/api/payOrder", {
      method: "POST",
      crossDomain: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerId,
        discountAmount: discount_Amount,
        discountDetail: discountDetail,
        promoCodeAmount: promo_Amount,
        promoCodeDetail: promoCodeDetail,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        closeModal("paymentModalCloseButton");
        if (response.data) {
          var link = document.getElementById("successModalButton");
          link.click();
        } else {
          console.log(response.message)
          set_alert_text(response.message);
          console.log(alert_text)
          // showAlertModal();
          let link = document.getElementById("warningModalButton");
          link.click();
        }
      });
  };

  const paySsl = () => {
    fetch(base + "/api/paySsl", {
      method: "POST",
      crossDomain: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: customerId,
        discountAmount: discount_Amount,
        discountDetail: discountDetail,
        promoCodeAmount: promo_Amount,
        promoCodeDetail: promoCodeDetail,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log(response);
        window.location.href = response.data;
      });
  };

  const addressSubmit = (event) => {
    event.preventDefault();

    fetch(base + "/api/saveCustomerAddress", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone_number,
        address,
        city_id,
        district_id,
        area_id,
        customerId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (!response.error) {
          scrollToTop();
          getCustomerInfo();
        }
      });
  };

  const handle_change_name = (e) => {
    set_name(e.target.value);
  };

  const handle_change_phone_number = (e) => {
    set_phone_number(e.target.value);
  };

  const handle_change_email = (e) => {
    set_email(e.target.value);
  };

  const handle_change_address = (e) => {
    set_address(e.target.value);
  };

  const handle_change_zipcode = (e) => {
    set_zipcode(e.target.value);
  };

  const handle_change_city_id = (e) => {
    console.log(e.target.value);
    set_city_id(e.target.value);
  };

  const handle_change_area_id = (e) => {
    set_area_id(e.target.value);
  };

  const handle_change_district_id = (e) => {
    set_district_id(e.target.value);
  };

  const showAlertModal = () => {
    var link = document.getElementById("warningModalButton");
    link.click();
  };

  const showAuthModal = () => {
    var link = document.getElementById("authModalButton");
    link.click();
  };

  const showPaymentModal = () => {
    var link = document.getElementById("paymentModalButton");
    link.click();
  };

  const closeModal = (buttonId) => {
    var modalCloseButton = document.getElementById(buttonId);
    modalCloseButton.click();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-6">
            <CartItems cartItemInfo={cartItemInfo} />
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="panel panel-default">
              <OrderSummary
                cartProducts={cartProducts}
                discountDetails={discountDetails}
                promoCodeDetails={promoCodeDetails}
                promoAmount={promoAmount}
                discountAmount={discountAmount}
                orderTotal={orderTotal}
              />
            </div>

            <div className="container mt-1 pt-1">
              <button
                onClick={placeOrder}
                className="btn btn-primary btn-block btn-continue-shop"
                type="button"
                disabled={!hasCustomerAddress}
                title={hasCustomerAddress ? "" : "Please input address"}
              >
                Place Order {hasCustomerAddress}
              </button>
            </div>
            {!customerId && (
              <div className="container mt-1 pt-1 cartAuthButtons">
                <button
                  onClick={loginClickHandler}
                  className="btn btn-primary"
                  type="button"
                >
                  Sign In
                </button>

                <button
                  onClick={registerClickHandler}
                  className="btn btn-primary"
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="checkout-form">
              <h1 className="mt-3 mb-3 h4">Billing Address</h1>
              <form action="#">
                <div className="checkout-input mb-3">
                  <p className="mb-3">
                    Name<span>*</span>
                  </p>
                  <input
                    type="text"
                    onChange={(e) => handle_change_name(e)}
                    value={name}
                    className="checkout-input-add mb-3"
                  />
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="checkout-input mb-3">
                      <p className="mb-3">
                        Phone<span>*</span>
                      </p>
                      <input
                        type="text"
                        onChange={(e) => handle_change_phone_number(e)}
                        value={phone_number}
                        className="checkout-input-add"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="checkout-input">
                      <p className="mb-3">
                        Email<span>*</span>
                      </p>
                      <input
                        type="text"
                        onChange={(e) => handle_change_email(e)}
                        value={email}
                        className="checkout-input-add"
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-input mb-3">
                  <p className="mb-3">
                    Address<span>*</span>
                  </p>
                  <input
                    type="text"
                    onChange={(e) => handle_change_address(e)}
                    value={address}
                    className="checkout-input-add"
                  />
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="checkout-input mb-3">
                      <p className="mb-3">
                        City<span>*</span>
                      </p>
                      <select
                        className="form-control"
                        name="city"
                        onChange={(e) => handle_change_city_id(e)}
                        value={city_id}
                      >
                        <option value="1">Dhaka</option>
                        <option value="2">Rajshahi</option>
                        <option value="3">Khulna</option>
                        <option value="4">Rangpur</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="checkout-input mb-3">
                      <p className="mb-3">
                        Area<span>*</span>
                      </p>

                      <select
                        className="form-control"
                        name="area"
                        onChange={(e) => handle_change_area_id(e)}
                        value={area_id}
                      >
                        <option value="1">Mirpur</option>
                        <option value="2">Gulshan</option>
                        <option value="3">Matikata</option>
                        <option value="4">Banani</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="checkout-input mb-3">
                      <p className="mb-3">
                        District<span>*</span>
                      </p>
                      <select
                        className="form-control"
                        name="district"
                        onChange={(e) => handle_change_district_id(e)}
                        value={district_id}
                      >
                        <option value="1">Dhaka</option>
                        <option value="2">Rajshahi</option>
                        <option value="3">Khulna</option>
                        <option value="4">Rangpur</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="checkout-input mb-3">
                      <p className="mb-3">
                        Postcode / ZIP<span>*</span>
                      </p>
                      <input
                        type="text"
                        onChange={(e) => handle_change_zipcode(e)}
                        value={zipcode}
                        className="checkout-input-add"
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-input-checkbox mb-2">
                  <label htmlFor="diff-acc" className="pl-4">
                    Ship to a different address?
                    <input
                      type="checkbox"
                      id="diff-acc"
                      onClick={(e) => handleShipCheck(e)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>

                <div className="checkout-input mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => addressSubmit(e)}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>

          {isShipAddressDiff && (
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="checkout-form">
                <h1 className="mt-3 mb-3 h4">Billing Address</h1>
                <form action="#">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Fist Name<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Last Name<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                  </div>

                  <div className="checkout-input mb-3">
                    <p className="mb-3">
                      Address<span>*</span>
                    </p>
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="checkout-input-add mb-3"
                    />
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Town/City<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Country/State<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Country<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Postcode / ZIP<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Phone<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="checkout-input mb-3">
                        <p className="mb-3">
                          Email<span>*</span>
                        </p>
                        <input type="text" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Modal  */}
      <button
        style={{ display: "none !important" }}
        id="warningModalButton"
        className="d-none"
        type="button"
        data-toggle="modal"
        data-target="#warningModal"
      ></button>

      <div
        className="modal fade"
        id="warningModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="warningModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body cart-modal-body-warning">
              <p className="pt-4">
                <i className="fa fa-exclamation-circle font-80" />
              </p>
              <p className="pt-2 pb-2 font-weight-bold text-danger">
                {alert_text}
              </p>
            </div>
            <div className="modal-footer cart-modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/cart";
                }}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End of Warning Modal  */}

      {/* Success Modal  */}
      <button
        style={{ display: "none !important" }}
        id="successModalButton"
        className="d-none"
        type="button"
        data-toggle="modal"
        data-target="#successModal"
      ></button>

      <div
        className="modal fade"
        id="successModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="successModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body cart-modal-body-warning">
              <p className="pt-4">
                <i className="fa fa-check font-80" />
              </p>
              <p className="pt-2 pb-2">Product purchased successfully.</p>
            </div>
            <div className="modal-footer cart-modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End of Success Modal  */}

      {/*  Payment Modal */}
      <button
        style={{ display: "none !important" }}
        id="PaymentModalButton"
        className="d-none"
        type="button"
        data-toggle="modal"
        data-target="#paymentModal"
      ></button>

      <div
        className="modal fade"
        id="paymentModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="paymentModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="h4">Select Payment Option</h1>
              <button
                type="button"
                className="close"
                id="paymentModalCloseButton"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container mt-5 text-center">
                <p>
                  <strong className="h5">
                    Payable Amount
                    <span className="ml-2">
                      <em>৳ &nbsp;</em>
                    </span>
                    <span>{comma_separate_numbers(orderTotalAmount)}</span>
                  </strong>
                </p>
              </div>
              <div className="container mt-5 mb-5">
                <button
                  onClick={payOrder}
                  className="btn btn-primary btn-block btn-continue-shop"
                  type="button"
                >
                  Cash On Delivery
                </button>

                <button
                  onClick={paySsl}
                  className="btn btn-primary btn-block btn-continue-shop"
                  type="button"
                >
                  Online Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  End of Payment Modal */}

      {/* Auth Modal  */}
      <button
        style={{ display: "none !important" }}
        className="d-none"
        id="authModalButton"
        type="button"
        data-toggle="modal"
        data-target="#authModal"
      ></button>

      <div
        className="modal fade"
        id="authModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="authModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                id="authModalCloseButton"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container mt-1 pt-1 cartAuthButtons">
                <button
                  onClick={loginClickHandler}
                  className="btn btn-primary"
                  type="button"
                >
                  Sign In
                </button>

                <button
                  onClick={registerClickHandler}
                  className="btn btn-primary"
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End of Auth Modal  */}
    </>
  );
};

export default CheckOut;
