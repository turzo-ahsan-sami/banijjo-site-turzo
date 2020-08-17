import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import Carousel from "react-multi-carousel";
import ReactImageMagnify from 'react-image-magnify';
import ReactImageZoom from "react-image-zoom";
import SweetAlert from "sweetalert2-react";
import axios from "axios";
import { isEqual } from "lodash";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  PinterestShareButton,
  PinterestIcon,
  LinkedinShareButton,
  LinkedinIcon
} from "react-share";

import "../../assets/social-share.css";
import "../../assets/selectImage.css";

import SameVendorOrSameCatProducts from "./SameVendorOrSameCatProducts";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

// eslint-disable-next-line
const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// window.jQuery = window.$ = $;

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_id: "",
      vendor_id: "",
      showClickedImage: "",
      carouselImages: [],
      productQuantity: 1,
      productName: "",
      productImage: "",
      product_full_description: [],
      product_sku: "",
      product_specification_details: [],
      product_specification_details_description: [],
      product_specification_name: [],
      qc_status: "",
      price: 0,
      reload: false,
      productImages: [],
      homeImage: "",
      productListSmVendor: [],
      productListSmCategory: [],
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      cartArr: [],
      color: "",
      discountAmount: 0,
      metaTags: [],
      colors: [],
      sizes: [],
      productId: this.props.match.params.id * 1,
      selectedSizeId: "",
      selectedColorId: "",
      selectedColorName: "",
      selectedProductStockAmount: 0,
      isSelectedProduceFound: true,
      onlyColor: false,
      onlySize: false,
      noColorAndSize: false,
      colorAndSize: false,
      combinations: [],
      product_list_same_vendor_other_cat: [],
      product_list_same_category_other_ven: [],

      show_alert: false,
      alert_text: ""
    };

    this.addWishDirect = this.addWishDirect.bind(this);
    this.createAccountNext = this.createAccountNext.bind(this);
    this.customerLoginSubmit = this.customerLoginSubmit.bind(this);
  }

  componentDidMount() {
    this.getProductDetails();
    this.getDiscountAmount();
    this.getProductCombinations();
    this.sameVendorOtherCatProducts();
    this.sameCatOtherVendorProducts();
  }

  getProductCombinations() {
    axios
      .get(`${base}/api/productCombinationsFromStock/${this.state.productId}`)
      .then(res => this.setState({ combinations: res.data.combinations }));
  }

  getDiscountAmount() {
    axios
      .get(`${base}/api/getDiscountByProductId/${this.state.productId}`)
      .then(res => {
        this.setState({ discountAmount: res.data.discountAmount });
      });
  }

  sameVendorOtherCatProducts = () => {
    axios
      .get(`${base}/api/sameVendorOrCat/${this.state.productId}/v`)
      .then(res =>
        this.setState({
          product_list_same_vendor_other_cat: res.data.sameVendorOrCat
        })
      );
  };

  sameCatOtherVendorProducts = () => {
    axios
      .get(`${base}/api/sameVendorOrCat/${this.state.productId}/c`)
      .then(res =>
        this.setState({
          product_list_same_category_other_ven: res.data.sameVendorOrCat
        })
      );
  };

  getProductDetails() {
    axios
      .get(`${base}/api/productDetails/${this.state.productId}`)
      .then(res => {
        console.log('productDetails.....', res.data)
        const {
          product_name,
          productPrice,
          home_image,
          category_id,
          vendor_id,
          metaTags,
          colors,
          sizes,
          carouselImages,
          description,
          specificationDetailsDescription,
          qc_status,
          product_sku
        } = res.data;

        this.setState({
          category_id,
          vendor_id,
          productName: product_name,
          homeImage: !!home_image ? home_image : "default.png",
          showClickedImage: !!home_image ? home_image : "default.png",
          product_full_description: description,
          product_specification_details_description: specificationDetailsDescription,
          carouselImages: !!carouselImages && carouselImages,
          qc_status: !!qc_status && qc_status,
          product_sku: !!product_sku && product_sku,
          productPrice: !!productPrice && productPrice,
          metaTags: !!metaTags && metaTags,
          colors,
          sizes,
          onlyColor: colors.length > 0 && sizes.length === 0,
          onlySize: sizes.length > 0 && colors.length === 0,
          noColorAndSize: colors.length === 0 && sizes.length === 0,
          colorAndSize: colors.length > 0 && sizes.length > 0
        });
      });
  }

  handleClickMinus = () => {
    this.setState(prevState => ({
      productQuantity:
        prevState.productQuantity > 1
          ? prevState.productQuantity - 1
          : prevState.productQuantity
    }));
  };

  handleClickPlus = () => {
    this.setState(prevState => ({
      productQuantity:
        prevState.productQuantity < 5
          ? prevState.productQuantity + 1
          : prevState.productQuantity
    }));
  };

  productDescriptions() {
    let descriptionText = [];
    if (this.state.product_full_description.length > 0) {
      this.state.product_full_description.forEach((item, key) => {
        descriptionText.push(
          <React.Fragment key={key}>
            <h1 className="h3 pt-2 pl-2">{item.title}</h1>
            {item.descriptionImage ? (
              <img className="img-fluid pt-2 pl-2"
                src={
                  fileUrl +
                  "/upload/product/productDescriptionImages/" +
                  item.descriptionImage
                }
                alt={""}
              />
            ) : (
                ""
              )}
            <h2 className="h6 pt-2 pl-2">Description:</h2>
            <p className="pt-2 pl-2">{item.description}</p>
          </React.Fragment>
        );
      });
    } else {
      descriptionText.push(
        <p style={{ color: "#ec1c24" }}>No Descriptions Added</p>
      );
    }
    return descriptionText;
  }

  specificationDetailsPart() {
    const spcArray = [];
    if (this.state.product_specification_name.length > 1) {
      this.state.product_specification_name.forEach((item, key) => {
        if (key === 1) {
          spcArray.push(<h5>{item.specificationName.toUpperCase()} :</h5>);
          this.state.product_specification_name.forEach((item1, key1) => {
            if (item.specificationName === item1.specificationName) {
              spcArray.push(
                <div className="colr ert">
                  <div className="check">
                    <label className="checkbox">
                      <input type="checkbox" name="checkbox" checked="" />
                      <i> </i>
                      {item1.specificationNameValue}
                    </label>
                  </div>
                </div>
              );
            }
          });
          spcArray.push(<div className="clearfix"> </div>);
        }
      });
    }
    return spcArray;
  }

  isSelectedProductExists = () => {
    const { productId, selectedSizeId, selectedColorId } = this.state;

    const selectedProduct = {
      productId,
      colorId: selectedColorId === "" ? 0 : selectedColorId * 1,
      sizeId: selectedSizeId === "" ? 0 : selectedSizeId * 1
    };

    const isExists = this.state.combinations.filter(item => {
      const newItem = { ...item };
      delete newItem.quantity;
      return isEqual(newItem, selectedProduct);
    });

    if (isExists.length > 0) {
      this.setState({ selectedProductStockAmount: isExists[0].quantity });
      return true;
    }

    return false;
  };

  updateLocalStorage = key => {
    //
  };

  addToLocalStorage = data => e => {
    // debugger;
    const {
      productId,
      selectedSizeId,
      selectedColorId,
      productQuantity,
      onlyColor,
      onlySize,
      noColorAndSize
    } = this.state;

    if (onlyColor) {
      if (this.state.selectedColorId === "") {
        this.setState({ show_alert: true });
        this.setState({ alert_text: "Please Select a Color" });
        return;
      }
    } else if (onlySize) {
      if (this.state.selectedSizeId === "")
        this.setState({ show_alert: true });
      this.setState({ alert_text: "Please Select a Size" });
    } else if (!noColorAndSize) {
      if (this.state.selectedColorId === "") {
        this.setState({ show_alert: true });
        this.setState({ alert_text: "Please Select a Color" });
        return;
      }
      if (this.state.selectedSizeId === "") {
        this.setState({ show_alert: true });
        this.setState({ alert_text: "Please Select a Size" });
        return;
      }
    }

    if (!this.isSelectedProductExists()) {
      this.setState({ show_alert: true });
      this.setState({ alert_text: "Product is Out of Stock!" });
      return;
    }

    const cartObj = {
      productId,
      colorId: selectedColorId === "" ? 0 : selectedColorId * 1,
      sizeId: selectedSizeId === "" ? 0 : selectedSizeId * 1,
      quantity: productQuantity * 1
    };

    if (!localStorage.customer_id) {
      const cartDataExisting = JSON.parse(localStorage.getItem(data));

      if (cartDataExisting && cartDataExisting.length) {
        localStorage.removeItem(data);
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
        localStorage.setItem(data, JSON.stringify(revisedCartData));
      } else {
        localStorage.setItem(data, JSON.stringify([{ ...cartObj }]));
      }
      let id = "";
      if (data === "cart") id = "successCartMessage";
      else if (data === "wish") id = "WishListModalButton";
      var link = document.getElementById(id);
      link.click();
    } else {
      fetch(base + "/api/add_cart_direct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...cartObj,
          customerId: localStorage.customer_id * 1,
          buttonClick: data
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          if (response.data === true) {
            let id = "";
            if (data === "cart") id = "successCartMessage";
            else if (data === "wish") id = "WishListModalButton";
            var link = document.getElementById(id);
            link.click();
          }
        });
    }
  };

  addCartDirect = data => e => {
    fetch(base + "/api/add_cart_direct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: this.state.productId,
        customerId: localStorage.customer_id,
        quantity: this.state.productQuantity
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
  };


  addWishDirect() {
    fetch(base + "/api/add_wish_direct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: this.state.productId,
        customerId: localStorage.customer_id,
        quantity: this.state.productQuantity
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data === true) {
          var link = document.getElementById("WishListModalButton");
          link.click();
        }
      });
  }

  customerLoginSubmit(event) {
    event.preventDefault();
    fetch(base + "/api/loginCustomerInitial", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: event.target.emailField.value,
        password: event.target.passwordField.value,
        productId: this.state.productId,
        quantity: this.state.productQuantity
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        console.log("aa", response);
        if (response.data !== "") {
          localStorage.setItem("customer_id", response.data);
          var link = document.getElementById("successCartMessage");
          var hide = document.getElementById("hideLogin");
          hide.click();
          link.click();
        }
      });
  }

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
      fetch(base + "/api/saveCustomerInitial", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: event.target.email.value,
          password: event.target.password.value,
          productId: this.state.productId,
          quantity: this.state.productQuantity
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

  selectSizeHandler = e => {
    this.setState({ selectedSizeId: e.target.value });
  };

  selectColorHandler = e => {
    this.setState({
      selectedColorId: e.target.id,
      selectedColorName: e.target.name
    });
  };


  render() {
    const options = {
      items: 3,
      slideBy: 1
    };

    const {
      productId,
      productName,
      metaTags,
      carouselImages,
      colors,
      category_id,
      vendor_id,
      sizes,
      selectedSizeId,
      selectedColorName,
      product_list_same_vendor_other_cat,
      product_list_same_category_other_van,
      show_alert,
      alert_text
    } = this.state;


    let counter = 1;
    const shareUrl = `http://banijjo.com.bd/productDetails/${productId}`;

    const imgProps = {
      img: `${fileUrl}/upload/product/compressedProductImages/${this.state.homeImage}`,
      width: 340,
      // height: 100,
      scale: 1.5,
      offset: { vertical: 0, horizontal: 10 },
      zoomStyle: "opacity: 1",
      zoomLensStyle: "opacity: 0",

      // smallImage: {
      //     src: `${fileUrl}/upload/product/compressedProductImages/${this.state.homeImage}`,
      //     alt: {productName},
      //     isFluidWidth: true,
      // },
      // largeImage: {
      //     src: `${fileUrl}/upload/product/compressedProductImages/${this.state.homeImage}`,
      //     width: 480,
      //     height: 320
      // }
    };

    console.log('product_specification_details_description...', this.state.product_specification_details_description)

    return (
      <React.Fragment>
        <Helmet>
          <meta
            name="viewport"
            content="user-scalable=no, width=device-width, initial-scale=1.0"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          {metaTags &&
            metaTags.map(tags => <meta name="description" content={tags} />)}
          {carouselImages &&
            carouselImages.map(({ imageName }) => (
              <meta name="description" content={imageName} />
            ))}
        </Helmet>

        <div className="container">

          <SweetAlert
            show={this.state.show_alert}
            title="Warning!"
            type="warning"
            text={this.state.alert_text}
            onConfirm={() => this.setState({ show_alert: false })}
          />

          <ul className="ct-socials">
            <li>
              <div className="ct-socials-icon">
                <TwitterShareButton url={shareUrl} quote={productName}>
                  <TwitterIcon size={35} round />
                </TwitterShareButton>
              </div>
            </li>
            <li>
              <div className="ct-socials-icon">
                <FacebookShareButton url={shareUrl} quote={productName}>
                  <FacebookIcon size={35} round />
                </FacebookShareButton>
              </div>
            </li>
            <li>
              <div className="ct-socials-icon">
                <PinterestShareButton url={String(window.location)}>
                  <PinterestIcon size={35} round />
                </PinterestShareButton>
              </div>
            </li>
            <li>
              <div className="ct-socials-icon">
                <LinkedinShareButton url={shareUrl} quote={productName}>
                  <LinkedinIcon size={35} round />
                </LinkedinShareButton>
              </div>
            </li>
          </ul>

          <div className="d-none">
            <button
              style={{ display: "none !important" }}
              id="successCartMessage"
              type="button"
              data-toggle="modal"
              data-target="#exampleModalShipping"
            >
              {""}
            </button>

            <button
              style={{ display: "none !important" }}
              id="WishListModalButton"
              type="button"
              data-toggle="modal"
              data-target="#WishListModal"
            >
              {""}
            </button>
          </div>



          {/* exampleModalShipping */}
          <div
            className="modal"
            id="exampleModalShipping"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog cartModalSmall" role="document">

              <div className="modal-content" style={{ width: "auto" }}>
                <div className="modal-header" style={{ padding: "0" }}>
                  <h5 className="modal-title" style={{ textAlign: "center" }}>
                    &nbsp;
                  </h5>

                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ marginTop: "-55px" }}
                  >
                    <i
                      className="fa fa-times-circle"
                      style={{
                        marginTop: "8px",
                        fontSize: "24px",
                        color: "rgb(255, 255, 255)"
                      }}
                    >
                      {""}
                    </i>
                  </button>
                </div>

                <div className="modal-body" style={{ textAlign: "center" }}>
                  <div className="row">
                    <div className="col-md-12 col-lg-12">

                      {/* desktop  */}
                      <div className="d-none d-lg-block">
                        <p style={{ color: "#009345" }} className="checkDes">
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
                          </i>{" "}
                          Nice. A new item has been added to your Shopping Cart.
                        </p>
                      </div>

                      {/* mobile */}
                      <div className="d-block d-lg-none">
                        <p style={{ color: "#009345" }} className="checkMobile">
                          <i
                            className="fa fa-check"
                            style={{
                              fontSize: "20px",
                              color: "white",
                              backgroundColor: "#009345",
                              borderRadius: "40px"
                            }}
                          >
                            {""}
                          </i>{" "}
                          Nice. A new item has been added to your Shopping Cart.
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row">
                      <div className="col-6">
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
                      <div className="col-6">
                        <button
                          onClick={() => window.location.reload()}
                          className="btn btn-success btn-sm"
                          style={{
                            backgroundColor: "#ec1c24",
                            borderColor: "#ec1c24"
                          }}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">{""}</div>
              </div>

            </div>
          </div>
          {/* end of exampleModalShipping */}

          {/* WishListModal */}
          <div
            className="modal"
            id="WishListModal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog wishListModalSmall" role="document">

              <div className="modal-content" style={{ width: "auto" }}>
                <div className="modal-header" style={{ padding: "0" }}>
                  <h5 className="modal-title" style={{ textAlign: "center" }}>
                    &nbsp;
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ marginTop: "-55px" }}
                  >
                    <i
                      className="fa fa-times-circle"
                      style={{
                        marginTop: "-55px",
                        fontSize: "24px",
                        color: "rgb(255, 255, 255)"
                      }}
                    >
                      {""}
                    </i>
                  </button>
                </div>

                <div className="modal-body text-center">
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <p style={{ color: "#009345" }} className="checkDes">
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
                        </i>{" "}
                        Nice. A new item has been added to your Wish List.
                      </p>
                      <p style={{ color: "#009345" }} className="checkMobile">
                        <i
                          className="fa fa-check"
                          style={{
                            fontSize: "20px",
                            color: "white",
                            backgroundColor: "#009345",
                            borderRadius: "40px"
                          }}
                        >
                          {""}
                        </i>{" "}
                        Nice. A new item has been added to your Wish List.
                      </p>{" "}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-lg-12">
                      <div className="col-md-6 col-lg-6">
                        <a
                          href="/wish"
                          className="btn btn-success btn-sm"
                          style={{
                            backgroundColor: "#ec1c24",
                            borderColor: "#ec1c24"
                          }}
                        >
                          View Wish List
                        </a>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <button
                          onClick={() => window.location.reload()}
                          className="btn btn-success btn-sm"
                          style={{
                            backgroundColor: "#ec1c24",
                            borderColor: "#ec1c24"
                          }}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">{""}</div>
              </div>

            </div>
          </div>
          {/* WishListModal */}


          {/* exampleModal */}
          <div
            className="modal"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">

              <div className="modal-content" style={{ width: "50%", marginLeft: "20%" }}>
                <div className="modal-header">
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
                      <img src="/image/banijjoLogo.png" alt="" />
                    </span>
                  </div>
                </div>
                <ul className="nav nav-tabs">
                  <li className="active" style={{ paddingLeft: "80px" }}>
                    <a data-toggle="tab" href="#home">
                      REGISTER
                      </a>
                  </li>
                  <li style={{ paddingLeft: "30px" }}>
                    <a data-toggle="tab" href="#menu1">
                      Sign In
                      </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="home" className="tab-pane fade in active">
                    <div className="modal-body">
                      <form
                        className="form-signin"
                        onSubmit={this.createAccountNext}
                      >
                        <div className="form-label-group">
                          <input
                            type="email"
                            id="inputEmail"
                            name="email"
                            className="form-control"
                            placeholder="Email address"
                            required
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
                        <div className="modal-footer">
                          <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ backgroundColor: "#ec1c24" }}
                          >
                            Create Account
                            </button>
                          <p align="left">
                            {/*eslint-disable-next-line*/}
                            <a href={`!#`} target="_blank">
                              Forgot Password?
                              </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div id="menu1" className="tab-pane fade">
                    <div className="modal-body">
                      <form
                        className="form-signin"
                        onSubmit={this.customerLoginSubmit}
                      >
                        <div className="form-label-group">
                          <input
                            type="email"
                            name="emailField"
                            className="form-control"
                            placeholder="Email "
                            required
                          />
                        </div>
                        <div className="form-label-group">
                          <input
                            type="password"
                            name="passwordField"
                            className="form-control"
                            placeholder="Password"
                            required
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ backgroundColor: "#ec1c24" }}
                          >
                            Login
                            </button>
                          <p align="left">
                            {/*eslint-disable-next-line*/}
                            <a href="!#" target="_blank">
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
          </div>
          {/* end of exampleModal */}

          {/* desktop  */}
          <div className="d-none d-lg-block mt-2">
            <div className="row">
              <div className="col-4 zoomImageDiv" style={{ zIndex: "1000" }}>
                {/* Zoom Images */}
                <ReactImageZoom {...imgProps} />

                {/* <ReactImageMagnify {...imgProps} /> */}

                <Carousel
                  additionalTransfrom={-6 * 3}
                  swipeable
                  draggable
                  showDots={false}
                  arrows
                  slidesToSlide={1}
                  autoPlay={true}
                  autoPlaySpeed={1000}
                  centerMode={false}
                  className=""
                  containerClass="container"
                  dotListClass=""
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  sliderClass=""
                  keyBoardControl
                  minimumTouchDrag={50}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: {
                        max: 3000,
                        min: 992,
                      },
                      items: 3,
                    },
                    tablet: {
                      breakpoint: {
                        max: 991.98,
                        min: 576,
                      },
                      items: 2,
                    },
                    mobile: {
                      breakpoint: {
                        max: 575.98,
                        min: 0,
                      },
                      items: 1,
                    },
                  }}
                  removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
                >
                  {carouselImages.map(
                    (item) =>
                      item && (
                        <a
                          href="#"
                          key={item.serialNumber}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ homeImage: item.imageName });
                          }}
                        >
                          <img
                            className="img-fluid"
                            src={`${fileUrl}/upload/product/compressedProductImages/${item.imageName}`}
                            alt={item.imageName}
                            title={item.imageName}
                            style={{
                              width: "10em",
                              height: "7.5em",
                              paddingTop: "1em",
                              paddingLeft: "5px",
                              paddingRight: "5px",
                            }}
                          />
                        </a>
                      )
                  )}
                </Carousel>
              </div>

              <div className="col-8">
                <h1 className="h4 mb-n1">{productName}</h1>

                {/* Color Selection  */}
                <div className="row">
                  <div className="col-12">
                    {colors.length > 0 && (
                      <div className="color-quality mt-3">
                        <h6>Color: {selectedColorName}</h6>
                        <div className="row">
                          {colors.map(
                            ({ colorId, imageName, colorName, seletected }) => (
                              <div key={colorId} className="col-1 mb-1 product-colors">
                                <img
                                  src={`${fileUrl}/upload/product/compressedProductImages/${imageName}`}
                                  onClick={this.selectColorHandler}
                                  className="img-fluid"
                                  id={colorId}
                                  name={colorName}
                                  alt={colorName}
                                  width="50"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sizes Selection  */}
                <div className="row">
                  <div className="col-12">
                    {sizes.length > 0 && (
                      <div className="d-inline-block mr-5 mt-2">
                        <h6>Size: </h6>
                        <select
                          className="form-control rounded-0"
                          value={selectedSizeId}
                          onChange={this.selectSizeHandler}
                        >
                          <option value="">Select a Size</option>
                          {sizes.map(({ id, size, size_type_id }) => (
                            <option value={id} key={id}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Quantity Selection */}
                    <div className="d-inline-block  mt-3">
                      <h6>Quantity</h6>
                      <div className="quantity">
                        <div className="quantity-select">
                          <div
                            onClick={this.handleClickMinus}
                            className="entry value-minus"
                          >
                            &nbsp;
                          </div>
                          <div className="entry value">
                            <span>{this.state.productQuantity}</span>
                          </div>
                          <div
                            onClick={this.handleClickPlus}
                            className="entry value-plus active"
                          >
                            &nbsp;
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Price */}
                <div className="simpleCart_shelfItem mt-3">
                  <p>
                    {this.state.discountAmount === 0 ? (
                      <Fragment>
                        <i className="item_price">
                          ৳&nbsp;{this.state.productPrice}
                        </i>
                      </Fragment>
                    ) : (
                        <Fragment>
                          <span>৳{this.state.productPrice}</span>{" "}
                          <i className="item_price">
                            ৳{this.state.productPrice - this.state.discountAmount}
                          </i>
                        </Fragment>
                      )}
                  </p>
                  <button
                    className="btn btn-outline-success rounded-0 mr-3"
                    onClick={this.addToLocalStorage("cart")}
                  >
                    Add to cart
                  </button>
                  <button
                    className="btn btn-outline-success rounded-0"
                    onClick={this.addToLocalStorage("wish")}
                  >
                    Add to wish list
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* mobile  */}
          <div className="d-block d-lg-none mt-2">

            <div className="col-11">

              <img
                className="img-fluid"
                src={`${fileUrl}/upload/product/compressedProductImages/${this.state.homeImage}`}
                title={this.state.homeImage}
                alt={this.state.homeImage}
              />

            </div>

            <div className="col-11">

              <Carousel
                additionalTransfrom={-1*2}
                arrows={false}
                showDots={false}
                sliderClass=""
                slidesToSlide={1}
                swipeable
                autoPlay={false}
                autoPlaySpeed={1000}
                centerMode={false}
                className=""
                containerClass=""
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={{
                  desktop: {
                    breakpoint: {
                      max: 3000,
                      min: 992,
                    },
                    items: 3,
                  },
                  tablet: {
                    breakpoint: {
                      max: 991.98,
                      min: 576,
                    },
                    items: 3,
                  },
                  mobile: {
                    breakpoint: {
                      max: 575.98,
                      min: 0,
                    },
                    items: 2,
                  },
                }}
              >
                {carouselImages.map(
                  (item) =>
                    item && (
                      <a
                        href="#"
                        key={item.serialNumber}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({ homeImage: item.imageName });
                        }}
                      >
                        <img
                          className="img-fluid"
                          src={`${fileUrl}/upload/product/compressedProductImages/${item.imageName}`}
                          alt={item.imageName}
                          title={item.imageName}
                          style={{
                            width: "10em",
                            height: "7.5em",
                            paddingTop: "1em",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                          }}
                        />
                      </a>
                    )
                )}
              </Carousel>

            </div>

            <div className="col-11">
              <h1 className="h4 mb-n1">{productName}</h1>

              {/* Color Selection  */}
              <div className="row">
                  <div className="col-12">
                    {colors.length > 0 && (
                      <div className="color-quality mt-3">
                        <h6>Color: {selectedColorName}</h6>
                        <div className="row">
                          {colors.map(
                            ({ colorId, imageName, colorName, seletected }) => (
                              <div key={colorId} className="mb-1 ml-2">
                                <img
                                  src={`${fileUrl}/upload/product/compressedProductImages/${imageName}`}
                                  onClick={this.selectColorHandler}
                                  className="img-fluid"
                                  id={colorId}
                                  name={colorName}
                                  alt={colorName}
                                  width="50"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              {/* Sizes Selection  */}
              <div className="row">
                <div className="col-12">
                  {sizes.length > 0 && (
                    <div className="d-inline-block mr-5 mt-2">
                      <h6>Size: </h6>
                      <select
                        className="form-control rounded-0"
                        value={selectedSizeId}
                        onChange={this.selectSizeHandler}
                      >
                        <option value="">Select a Size</option>
                        {sizes.map(({ id, size, size_type_id }) => (
                          <option value={id} key={id}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div className="d-inline-block  mt-3">
                    <h6>Quantity</h6>
                    <div className="quantity">
                      <div className="quantity-select">
                        <div
                          onClick={this.handleClickMinus}
                          className="entry value-minus"
                        >
                          &nbsp;
                          </div>
                        <div className="entry value">
                          <span>{this.state.productQuantity}</span>
                        </div>
                        <div
                          onClick={this.handleClickPlus}
                          className="entry value-plus active"
                        >
                          &nbsp;
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Price */}
              <div className="simpleCart_shelfItem mt-3">
                <p>
                  {this.state.discountAmount === 0 ? (
                    <Fragment>
                      <i className="item_price">
                        ৳&nbsp;{this.state.productPrice}
                      </i>
                    </Fragment>
                  ) : (
                      <Fragment>
                        <span>৳{this.state.productPrice}</span>{" "}
                        <i className="item_price">
                          ৳{this.state.productPrice - this.state.discountAmount}
                        </i>
                      </Fragment>
                    )}
                </p>
                <button
                  className="btn btn-outline-success rounded-0 mr-3"
                  onClick={this.addToLocalStorage("cart")}
                >
                  Add to cart
                  </button>
                <button
                  className="btn btn-outline-success rounded-0"
                  onClick={this.addToLocalStorage("wish")}
                >
                  Add to wish list
                  </button>
              </div>
            </div>
          </div>



          {/* OVERVIEW, CUSTOMER REVIEWS, SPECIFICATIONS */}
          <div className="row">
            <div className="col-12">
              <div className="sap_tabs mt-4">
                <div id="horizontalTab1">

                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <a
                        className="d-inline-block resp-tab-item px-3  py-1 m-1"
                        id="nav-home-tab"
                        data-toggle="tab"
                        href="#nav-home"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                      >
                        OVERVIEW
                      </a>
                      {/* <a
                        className="d-inline-block resp-tab-item px-3 py-1 m-1"
                        id="nav-profile-tab"
                        data-toggle="tab"
                        href="#nav-profile"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                      >
                        CUSTOMER REVIEWS
                      </a> */}
                      <a
                        className="d-inline-block resp-tab-item px-3 py-1 m-1"
                        id="nav-contact-tab"
                        data-toggle="tab"
                        href="#nav-contact"
                        role="tab"
                        aria-controls="nav-contact"
                        aria-selected="false"
                      >
                        SPECIFICATIONS
                      </a>
                    </div>
                  </nav>

                  <div className="tab-content pl-1" id="nav-tabContent">

                    {/* // Overview    */}
                    <div
                      className="tab-pane resp-tab-content additional_info_grid p-4 fade show active"
                      id="nav-home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                    >
                      {this.productDescriptions()}
                    </div>

                    {/* Review  */}
                    {/* <div
                      className="tab-pane resp-tab-content additional_info_grid p-4 fade"
                      id="nav-profile"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                    >
                      {""}
                    </div> */}

                    {/* Specifications  */}
                    <div
                      className="tab-pane resp-tab-content additional_info_grid p-4 fade"
                      id="nav-contact"
                      role="tabpanel"
                      aria-labelledby="nav-contact-tab"
                    >
                      <div className="row">
                        <div className="col-md-6">
                          {this.state.product_specification_details_description
                            ? this.state.product_specification_details_description.forEach(
                              (item, key) => {
                                if (counter === 1) {
                                  if ((key + 1) % 8 === 0) {
                                    counter = key;
                                    return false;
                                  } else {
                                    return (
                                      <li>
                                        {item.specificationDetailsName}:{" "}
                                        {item.specificationDetailsValue}
                                      </li>
                                    );
                                  }
                                }
                              }
                            )
                            : ""}
                        </div>

                        <div className="col-md-6">
                          {counter > 1
                            ? this.state.product_specification_details_description.map(
                              (item, key) => {
                                if (key >= counter) {
                                  return (
                                    <li>
                                      {counter}
                                      {item.specificationDetailsName}:{" "}
                                      {item.specificationDetailsValue}
                                    </li>
                                  );
                                }
                                return "";
                              }
                            )
                            : ""}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* END OF  OVERVIEW, CUSTOMER REVIEWS, SPECIFICATIONS */}


          {/*Same Category - Other Vendor Products*/}
          {product_list_same_category_other_van && (
            <div className="row mt-2">
              <div className="col-12">
                <SameVendorOrSameCatProducts
                  vorc={"c"}
                  id={category_id}
                  products={product_list_same_category_other_van}
                />
              </div>
            </div>
          )}

          {/*Same Vendor - Other Category Products*/}
          {product_list_same_vendor_other_cat && (
            <div className="row mt-2">
              <div className="col-12">
                <SameVendorOrSameCatProducts
                  vorc={"v"}
                  id={vendor_id}
                  products={product_list_same_vendor_other_cat}
                />
              </div>
            </div>
          )}

        </div>
      </React.Fragment>
    );
  }
}
export default ProductDetails;
