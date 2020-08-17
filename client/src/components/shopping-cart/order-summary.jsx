import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { OrderContext } from "../../context/OrderContext";
import { comma_separate_numbers } from "../../utils/utils";
import { base, frontEndUrl, fileUrl, emailPattern, options } from "../../utils/common-helpers";


const OrderSummary = (props) => {
  const [customerId, set_customerId] = useState(localStorage.customer_id);

  const [cartProducts, set_cartProducts] = useState([]);

  const [totalItems, set_totalItems] = useState(0);
  const [totalAmount, set_totalAmount] = useState(0);
  const [vatAmount, set_vatAmount] = useState(0);

  const [discountAmount, set_discountAmount] = useState(0);
  const [discountDetails, set_discountDetails] = useState([]);

  const [promoCode, set_promoCode] = useState("");
  const [promoAmount, set_promoAmount] = useState(0);
  const [promoCodeDetails, set_promoCodeDetails] = useState([]);

  const [shippingAmount, set_shippingAmount] = useState(0);
  const [orderTotalAmount, set_orderTotalAmount] = useState(0);

  const [show_alert, set_show_alert] = useState(false);
  const [alert_text, set_alert_text] = useState("");

  const [order, setOrder] = useContext(OrderContext);

  let history = useHistory();

  useEffect(() => {
    set_cartProducts(props.cartProducts);
    calcTotalItems(props.cartProducts);
    computeTotalPrice(props.cartProducts);
    get_discountAmount();
  }, [props.cartProducts]);

  useEffect(() => {
    calculateOrderTotalAmount();
  }, [totalAmount, promoAmount]);

  useEffect(() => {
    sendData();
  }, [promoCodeDetails, discountDetails]);

  const sendData = () => {
    props.promoCodeDetails(promoCodeDetails);
    props.promoAmount(promoAmount);
    props.discountAmount(discountAmount);
    props.discountDetails(discountDetails);
    props.orderTotal(orderTotalAmount);
  };

  const calcTotalItems = (data) => {
    let total = 0;
    data.forEach((item) => {
      total += item.quantity;
    });
    set_totalItems(total);
  };

  const computeTotalPrice = (data) => {
    let total = 0;
    data.forEach((item) => {
      total += item.quantity * item.productPrice;
    });
    set_totalAmount(total);
  };

  const get_discountAmount = () => {
    axios
      .post(`${base}/api/getDiscounts`, {
        cartProducts,
        customerId,
      })
      .then(function (response) {
        set_discountAmount(response.data.data);
        set_discountDetails(response.data.dataDetail);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const calculateOrderTotalAmount = () => {
    let orderTotal =
      totalAmount + vatAmount + shippingAmount - (discountAmount + promoAmount);
    set_orderTotalAmount(orderTotal);
    setOrder(orderTotal);
    localStorage.setItem("orderTotal", orderTotal);
  };

  const promoCodeModalDisplay = () => {
    if (!customerId) {
      setWarning("Please Login to Apply Promo Code");
      return;
    }
    set_promoCode("");
    var PromoCodeModalButton = document.getElementById("PromoCodeModalButton");
    PromoCodeModalButton.click();
  };

  const closeModal = (buttonId) => {
    var modalCloseButton = document.getElementById(buttonId);
    modalCloseButton.click();
  };

  const onChangeHandler = (e) => {
    e.preventDefault();
    set_promoCode(e.target.value);
  };

  const applyPromoCode = (e) => {
    e.preventDefault();
    axios
      .post(`${base}/api/getPromoCodeAmount`, {
        totalAmount,
        promoCodeInput: promoCode,
        customerId,
      })
      .then(function (response) {
        if (response.data > 0) {
          set_promoAmount(response.data);
          set_promoCodeDetails(response.dataDetail);
        } else {
          setWarning("Invalid Promo Code");
        }
        closeModal("promoCodeCloseButton");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const setWarning = (message) => {
    set_show_alert(true);
    set_alert_text(message);
    var link = document.getElementById("warningModalButton_ordersummary");
    link.click();
  };

  const navToLogin = (e) => {
    e.preventDefault();
    closeModal("warningCloseButton");
    history.push("/login");
  };

  return (
    <>
      <button
        style={{ display: "none !important" }}
        className="d-none"
        id="PromoCodeModalButton"
        type="button"
        data-toggle="modal"
        data-target="#PromoCodeModal"
      ></button>

      <button
        style={{ display: "none !important" }}
        className="d-none"
        id="warningModalButton_ordersummary"
        type="button"
        data-toggle="modal"
        data-target="#warningModal_ordersummary"
      ></button>

      {/* Promo Code Modal  */}
      <div
        className="modal fade"
        id="PromoCodeModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="PromoCodeModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body cart-modal-body">
              <div className="form-group">
                <label htmlFor="inputPromoCode">Apply Promo Code</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPromoCode"
                  aria-describedby="promocode"
                  value={promoCode}
                  onChange={(e) => onChangeHandler(e)}
                />
              </div>
            </div>

            <div className="modal-footer cart-modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                id="promoCodeCloseButton"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => applyPromoCode(e)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End of Promo Code Modal  */}

      {/* Warning Modal  */}
      <div
        className="modal fade"
        id="warningModal_ordersummary"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="warningModal_ordersummary"
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
              {customerId && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    id="warningCloseButton"
                  >
                    Continue Shopping
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </>
              )}
              {!customerId && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => navToLogin(e)}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* End of Warning Modal  */}

      {/* Order Summary  */}
      <div className="panel panel-default">
        <div className="panel-heading text-center">
          <h4>Order Summary</h4>
        </div>
        <div className="panel-body">
          <div className="col-md-12">
            <strong className="strong-left-subtotal">
              Subtotal (
              {totalItems === 0 || totalItems === 1
                ? `${totalItems} item`
                : `${totalItems} items`}
              )
            </strong>
            <div className="float-right">
              <span>
                <em>৳ &nbsp;</em>
              </span>
              <span>{comma_separate_numbers(totalAmount)}</span>
            </div>
          </div>
          <div className="col-md-12">
            <strong className="strong-left-vat">VAT & Tax</strong>
            <div className="float-right">
              <span>
                <em>৳ &nbsp;</em>
              </span>
              <span>{comma_separate_numbers(vatAmount)}</span>
            </div>
          </div>
          <div className="col-md-12">
            <strong className="strong-left-discount">Discount</strong>
            <div className="float-right">
              <span>
                <em>৳ &nbsp;</em>
              </span>
              <span>{comma_separate_numbers(discountAmount)}</span>
            </div>
          </div>
          <div className="col-md-12">
            <strong>
              Promo Code
              <span
                onClick={promoCodeModalDisplay}
                style={{ cursor: "pointer" }}
                className="badge badge-success btn-apply rounded ml-2"
              >
                Apply
              </span>
            </strong>
            <div className="float-right">
              <span>
                <em>৳ &nbsp;</em>
              </span>
              <span>{comma_separate_numbers(promoAmount)}</span>
            </div>
          </div>
          <div className="col-md-12">
            <strong className="strong-left-vat">Shipping</strong>
            <div className="float-right">
              <span>
                <em>৳ &nbsp;</em>
              </span>
              <span>{comma_separate_numbers(shippingAmount)}</span>
            </div>
            <hr />
          </div>
          <div className="col-md-12">
            <strong className="strong-left-order">Order Total</strong>
            <div className="float-right">
              <span>
                <em>৳ &nbsp;</em>
              </span>
              <span>{comma_separate_numbers(orderTotalAmount)}</span>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
