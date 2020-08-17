import React, { Component } from "react";


import swal from "sweetalert";
import axios from "axios";
import { isEqual } from "lodash";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;


const options = {
  headers: { "Content-Type": "application/json" }
};

class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Categories: [],
      textArray: [],
      allCategories: [],
      wishProducts: [],
      responseMessage: "",
      itemQuantityState: [],
      wishProductsInfo: []
    };
    this.loadProduct = this.loadProduct.bind(this);
  }

  componentDidMount() {
    this.getCustomerWishProducts();
  }

  requiredFunc() {
    let wishData = JSON.parse(localStorage.getItem("wish"));
    let productIds = [];

    if (wishData) {
      wishData.forEach(function(val, index) {
        productIds.push(val.productId);
      });

      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedwishData = [];

      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        wishData.forEach(function(val, key) {
          if (valParent === val.productId) {
            totalCount += val.quantity;
          }
        });
        revisedwishData.push({ productId: valParent, quantity: totalCount });
      });

      let revisedwishDataKeyValue = [];
      revisedwishData.forEach(function(value, key) {
        revisedwishDataKeyValue[value.productId] = value.quantity;
      });

      return revisedwishDataKeyValue;
    } else {
      return [];
    }
  }

  getProductsInfoByWishData = (wishListData, customerId = 0) => {
    const data = JSON.stringify({ wishListData, customerId });
    const url = `${base}/api/getCustomerWishProducts`;

    axios.post(url, data, options).then(res => {
      const wishProductsInfo = res.data.wishProducts;
      this.setState({ wishProductsInfo });
    });
  };

  getCustomerWishProducts() {
    if (!localStorage.customer_id) {
      let wishListData = JSON.parse(localStorage.getItem("wish"));

      if (wishListData && wishListData.length > 0) {
        this.getProductsInfoByWishData(wishListData);
      } else {
        this.setState({
          revisedCartDataKeyValue: [],
          itemQuantityState: 0,
          cartProducts: []
        });
      }
    } else {
      this.getProductsInfoByWishData([], localStorage.customer_id * 1);
    }
  }

  getCustomerWishProductsPrev() {
    if (!localStorage.customer_id) {
      let wishData = JSON.parse(localStorage.getItem("wish"));
      let productIds = [];
      // let uniqueProductIds = [];

      if (wishData) {
        wishData.forEach(function(val, index) {
          productIds.push(val.productId);
        });

        let uniqueProductIds = productIds.filter(
          (v, i, a) => a.indexOf(v) === i
        );
        let revisedwishData = [];

        uniqueProductIds.forEach(function(valParent, keyParent) {
          let totalCount = 0;
          wishData.forEach(function(val, key) {
            if (valParent === val.productId) {
              totalCount += val.quantity;
            }
          });
          revisedwishData.push({ productId: valParent, quantity: totalCount });
        });

        let revisedwishDataKeyValue = [];
        revisedwishData.forEach(function(value, key) {
          revisedwishDataKeyValue[value.productId] = value.quantity;
        });

        this.setState({
          revisedwishDataKeyValue: revisedwishDataKeyValue
        });

        fetch(base + "/api/getCustomerWishProducts", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            customerId: 0,
            uniqueProductIds: JSON.stringify(uniqueProductIds)
          })
        })
          .then(res => {
            return res.json();
          })
          .then(response => {
            this.setState({
              wishProducts: response.data
            });
            let requiredFunc = this.requiredFunc();
            let itemQuantityState = {};
            response.data.forEach(function(item, key) {
              itemQuantityState[item.id] = requiredFunc[item.id];
            });
            this.setState({ itemQuantityState: itemQuantityState });
          });
      } else {
        this.setState({
          revisedwishDataKeyValue: [],
          wishProducts: [],
          itemQuantityState: 0
        });
      }
    } else {
      fetch(base + "/api/getCustomerWishProducts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: localStorage.customer_id
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          this.setState({
            wishProducts: response.data
          });
          let itemQuantityState = {};
          response.data.forEach(function(item, key) {
            itemQuantityState[item.id] = item.quantity;
          });
          this.setState({ itemQuantityState: itemQuantityState });
        });
    }
  }

  
  onClickPlusHandler = data => {
    const sendData = { ...data };
    delete sendData.quantity;
    const wishProductsInfo = this.state.wishProductsInfo.map(data => {
      const newData = { ...data };
      delete newData.quantity;
      return isEqual(newData, sendData) && data.quantity < 5
        ? { ...data, quantity: data.quantity + 1 }
        : data;
    });

    if (!localStorage.getItem("customer_id")) {
      this.updateLocalStorage(wishProductsInfo, "wish");
      this.setState({ wishProductsInfo });
    } else if (localStorage.getItem("customer_id")) {
      const data = JSON.stringify({
        customerId: localStorage.customer_id,
        table_name: "wish_list",
        cartProductsInfo: wishProductsInfo
      });
      const url = `${base}/api/updateCustomerCartProducts`;

      axios.post(url, data, options).then(res => {
        if (res.data.data) {
          this.setState({ wishProductsInfo });
        }
      });
    }
  };

  onClickMinusHandler = data => {
    const sendData = { ...data };
    delete sendData.quantity;
    const wishProductsInfo = this.state.wishProductsInfo.map(data => {
      const newData = { ...data };
      delete newData.quantity;
      return isEqual(newData, sendData) && data.quantity > 1
        ? { ...data, quantity: data.quantity - 1 }
        : data;
    });

    if (!localStorage.getItem("customer_id")) {
      this.updateLocalStorage(wishProductsInfo, "wish");
      this.setState({ wishProductsInfo });
    } else if (localStorage.customer_id) {
      const data = JSON.stringify({
        customerId: localStorage.customer_id,
        table_name: "wish_list",
        cartProductsInfo: wishProductsInfo
      });
      const url = `${base}/api/updateCustomerCartProducts`;

      axios.post(url, data, options).then(res => {
        if (res.data.data) {
          this.setState({ wishProductsInfo });
        }
      });
    }
  };

  onClickDeleteHandler = data => {
    const wishProductsInfo = this.state.wishProductsInfo.filter(
      item => !isEqual(item, data)
    );

    if (!localStorage.customer_id) {
      this.updateLocalStorage(wishProductsInfo, "wish");
      this.setState({ wishProductsInfo });
    } else {
      const url = `${base}/api/deleteCustomerCartProducts`;
      const body = JSON.stringify({
        customerId: localStorage.customer_id,
        table_name: "wish_list",
        cartProductInfo: data
      });

      axios.post(url, body, options).then(res => {
        if (res.data.data) {
          this.setState({ wishProductsInfo });
        }
      });
    }
  };

  addProductIntoCartLocal = product => {
    // const wishProductsInfo = this.state.wishProductsInfo.filter(
    //   item => !isEqual(item, product)
    // );
    // this.updateLocalStorage(wishProductsInfo, "wish");
    // this.setState({ wishProductsInfo });

    const cartObj = {
      productId: product.id,
      colorId: product.color.id,
      sizeId: product.size.id,
      quantity: product.quantity
    };

    if (!localStorage.customer_id) {
      const cartDataExisting = JSON.parse(localStorage.getItem("cart"));
      if (cartDataExisting && cartDataExisting.length) {
        localStorage.removeItem("cart");
        let cardUpdated = false;

        const revisedCartData = cartDataExisting.map(item => {
          const { productId, colorId, sizeId, quantity } = item;
          if (
            productId === cartObj.productId &&
            colorId === cartObj.colorId &&
            sizeId === cartObj.sizeId
          ) {
            item.quantity = quantity + cartObj.quantity;
            cardUpdated = true;
          }

          item.quantity = item.quantity >= 5 ? 5 : item.quantity;
          return item;
        });

        if (!cardUpdated) revisedCartData.push(cartObj);
        localStorage.setItem("cart", JSON.stringify(revisedCartData));
      } else {
        localStorage.setItem("cart", JSON.stringify([{ ...cartObj }]));
      }
      this.showAlert("Product is Added into Cart.");
      this.onClickDeleteHandler(product);
    } else {
      const url = `${base}/api/add_cart_direct_from_wish`;
      const body = JSON.stringify({
        ...cartObj,
        customerId: localStorage.customer_id * 1,
        table_name: "temp_sell"
      });
      axios.post(url, body, options).then(res => {
        if (res.data.data) {
          this.showAlert("Product is Added into Cart.");
          this.onClickDeleteHandler(product);
        }
      });
    }
    /*    this.showAlert("Product is Added into Cart.");
    this.onClickDeleteHandler(product);*/
  };

  addCartLocal(itemId, Qty) {
    let cartArr = [{ productId: itemId, quantity: Qty }];
    let wishDataExisting = JSON.parse(localStorage.getItem("cart"));
    localStorage.removeItem("cart");

    if (wishDataExisting) {
      wishDataExisting.push({ productId: itemId, quantity: Qty });
      localStorage.setItem("cart", JSON.stringify(wishDataExisting));
    } else {
      localStorage.setItem("cart", JSON.stringify(cartArr));
    }
    var link = document.getElementById("successCartMessage");
    link.click();
    this.handleClickDelete(itemId);
  }

  addCartDirect(itemId, Qty) {
    fetch(base + "/api/add_cart_direct_from_wish", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: itemId,
        customerId: localStorage.customer_id,
        quantity: Qty
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data === true) {
          var link = document.getElementById("successCartMessage");
          link.click();
        }
      });
    this.handleClickDelete(itemId);
  }

  // eslint-disable-next-line
  handleClickDelete(itemId) {
    if (!localStorage.customer_id) {
      let wishData = JSON.parse(localStorage.getItem("wish"));
      let productIds = [];
      wishData.forEach(function(val, index) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedwishData = [];
      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        wishData.forEach(function(val, key) {
          if (valParent === val.productId) {
            totalCount += val.quantity;
          }
        });
        revisedwishData.push({ productId: valParent, quantity: totalCount });
      });
      let newWishData = [];
      revisedwishData.forEach(function(val, key) {
        if (itemId !== val.productId) {
          newWishData.push({
            productId: val.productId,
            quantity: val.quantity
          });
        }
      });
      // console.log(revisedwishData)
      localStorage.removeItem("wish");
      localStorage.setItem("wish", JSON.stringify(newWishData));
      this.getCustomerWishProducts();
      window.location = "/wish";
    } else {
      fetch(base + "/api/deleteCustomerWishProducts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: localStorage.customer_id,
          itemId: itemId
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          this.getCustomerWishProducts();
          window.location = "/wish";
        });
    }
  }

  loadProduct() {
    window.location.href = "/";
  }

  // Helper Functions Starts
  updateLocalStorage = (productsInfo, key) => {
    const data = productsInfo.map(({ color, size, id, quantity }) => ({
      productId: id,
      colorId: color.id,
      sizeId: size.id,
      quantity
    }));
    if (localStorage.getItem(key)) localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(data));
  };

  showAlert(text) {
    swal({
      title: "Success!",
      text,
      icon: "success",
      timer: 4000,
      button: false
    });
  }
  // Helper Functions Ends

  render() {
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
                    >
                      {""}
                    </i>
                  </div>
                  <div className="col-md-11 col-lg-11">
                    <p style={{ color: "#009345" }}>
                      Nice. A new item has been added to your Shopping Cart.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-1 col-lg-1">{""}</div>
                  <div className="col-md-3 col-lg-3">
                    <a
                      href="/cart"
                      className="btn btn-success"
                      style={{
                        backgroundColor: "#ec1c24",
                        borderColor: "#ec1c24"
                      }}
                    >
                      View Shopping Cart
                    </a>
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <a
                      href={frontEndUrl}
                      className="btn btn-success"
                      style={{
                        backgroundColor: "#ec1c24",
                        borderColor: "#ec1c24"
                      }}
                    >
                      Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
              <div className="modal-footer">{""}</div>
            </div>
          </div>
        </div>
        
        
        <div className="row">
          <div className="medium-12 columns">
            <div className="card shopping-cart">
              <div className="card-header bg-success text-light" align="center">
                <p>&nbsp;</p>

                <div className="clearfix">{""}</div>
              </div>

              <div className="card-body">
                {this.state.wishProductsInfo.length > 0
                  ? this.state.wishProductsInfo.map((item, key) => {
                      return (
                        <React.Fragment>
                          <div className="row">
                            <div className="col-md-3 text-center">
                              <img
                                style={{ marginTop: "10px" }}
                                className=""
                                src={
                                  fileUrl +
                                  "/upload/product/compressedProductImages/" +
                                  item.home_image
                                }
                                alt="prewiew"
                                width="120"
                                height="80"
                              />
                            </div>

                            <div className="col-md-3">
                              <h1
                                className="product-name"
                                style={{ fontSize: "16px", fontWeight: "600" }}
                              >
                                <strong>{item.product_name}</strong>
                              </h1>
                              <p style={{ fontSize: "14px" }}>
                                <b>Color: </b>
                                {item.color.colorName}
                              </p>
                              &nbsp;&nbsp;&nbsp;
                              <strong style={{ fontSize: "12px" }}>
                                <b>Model:</b> {item.size.size}
                              </strong>
                              <h1
                                style={{ fontSize: "14px", fontWeight: "600" }}
                              >
                                <b>৳{item.productPrice}</b>
                              </h1>
                            </div>

                            <div className="col-md-6 row">
                              <div className="col-md-6">
                                <div className="quantity">
                                  <div className="quantity-select">
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

                              <div className="col-md-6 text-center">
                                <button
                                  onClick={() =>
                                    this.addProductIntoCartLocal(item)
                                  }
                                  style={{
                                    backgroundColor: "009345",
                                    width: "40px"
                                  }}
                                  className="btn btn-outline-danger btn-xs"
                                >
                                  <i
                                    className="fa fa-shopping-cart"
                                    aria-hidden="true"
                                    style={{
                                      fontSize: "24px",
                                      color: "#009345"
                                    }}
                                  ></i>
                                </button>
                                {/*Delete Item*/}
                                <button
                                  // onClick={() =>
                                  //   this.handleClickDelete(item.id)
                                  // }
                                  onClick={() =>
                                    this.onClickDeleteHandler(item)
                                  }
                                  type="button"
                                  style={{ width: "40px" }}
                                  className="btn btn-outline-danger btn-xs"
                                >
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                    style={{ fontSize: "24px", color: "red" }}
                                  >
                                    {""}
                                  </i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <hr />
                        </React.Fragment>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="card-header bg-success text-light" align="right">
            <a
              href={frontEndUrl}
              style={{
                color: "#ffffff",
                backgroundColor: "#009345",
                marginRight: "15px",
                marginTop: "-15px",
                textAlign: "center",
                width: "150px"
              }}
              className="btn btn-primary btn-sm"
            >
              Continue shopping
            </a>
            <div className="clearfix">{""}</div>
          </div>
        </div>
       
      </React.Fragment>
    );
  }
}
export default WishList;
