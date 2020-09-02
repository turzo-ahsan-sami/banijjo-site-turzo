import React, { useState, useEffect } from "react";
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

const Shopping_Cart = () => {
  const history = useHistory();

  const [customerId, set_customerId] = useState(localStorage.customer_id);

  const [cartProducts, set_cartProducts] = useState([]);
  const [orderTotalAmount, set_orderTotalAmount] = useState(0);
  const [discount_Amount, set_discountAmount] = useState(0);
  const [discountDetail, set_discountDetail] = useState([]);
  const [promo_Amount, set_promoAmount] = useState(0);
  const [promoCodeDetail, set_promoCodeDetail] = useState([]);

  const [hasAgreedToTermsConditions, set_hasAgreedToTermsConditions] = useState(
    false
  );
  const [hasAgreedToReturnPolicy, set_hasAgreedToReturnPolicy] = useState(
    false
  );
  const [canCheckout, set_canCheckout] = useState(false);

  const [policy, setPolicy] = useState({});

  const continueShopping = () => {
    history.push("/");
  };

  const checkOut = () => {
    history.push("/checkout");
  };

  const loginClickHandler = () => {
    history.push("/login");
  };

  const registerClickHandler = () => {
    history.push("/register");
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

  const loadPolicy = (policySlug, e) => {
    axios.get(`${base}/api/policy/${policySlug}`).then((res) => {
      setPolicy(res.data);
      var policyModalButton = document.getElementById("policyModalButton");
      policyModalButton.click();
    });
  };

  const handleTermsCheck = (e) => {
    set_hasAgreedToTermsConditions(e.target.checked);
  };

  const handleReturnCheck = (e) => {
    set_hasAgreedToReturnPolicy(e.target.checked);
  };

  useEffect(() => {
    set_canCheckout(hasAgreedToTermsConditions && hasAgreedToReturnPolicy);
  }, [hasAgreedToTermsConditions, hasAgreedToReturnPolicy]);

  return (
    <React.Fragment>
      
      {/* Policy Modal  */}
      <button
        style={{ display: "none !important" }}
        className="d-none"
        id="policyModalButton"
        type="button"
        data-toggle="modal"
        data-target="#policyModal"
      ></button>

      <div
        className="modal fade"
        id="policyModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="policyModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{policy.name}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="text-justify mt-3">{policy.terms_and_conditions}</p>
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
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End of Policy Modal  */}

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
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="termsCheckBox"
                  onClick={(e) => handleTermsCheck(e)}
                />
                <label className="form-check-label" htmlFor="termsCheckBox">
                  Agree to Terms & Conditions
                </label>
                <span
                  className="badge badge-success ml-2"
                  onClick={(e) => loadPolicy("terms-and-condition-1", e)}
                >
                  View
                </span>
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="returnCheckBox"
                  onClick={(e) => handleReturnCheck(e)}
                />
                <label className="form-check-label" htmlFor="returnCheckBox">
                  Agree to Returns & Replacement
                </label>
                <span
                  className="badge badge-success ml-2"
                  onClick={(e) => loadPolicy("returns-and-replacement-6", e)}
                >
                  View
                </span>
              </div>
            </div>

            <div className="container mt-1 pt-1">
              <button
                onClick={checkOut}
                className="btn btn-primary btn-block btn-continue-shop"
                type="button"
                disabled={!canCheckout}
              >
                Checkout
              </button>

              <button
                onClick={continueShopping}
                className="btn btn-primary btn-block btn-continue-shop"
                type="button"
              >
                Continue shopping
              </button>
            </div>

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
    
    </React.Fragment>
  );
};
export default Shopping_Cart;
