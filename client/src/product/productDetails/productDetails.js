import React, { useState, useEffect, useContext, Fragment } from "react";
import { Helmet } from "react-helmet";
import Carousel from "react-multi-carousel";
import ReactImageZoom from "react-image-zoom";
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
  LinkedinIcon,
} from "react-share";

import { CartContext } from "../../context/CartContext";
import { ShowModalContext } from "../../context/ShowModalContext";

import SameVendorOrSameCatProducts from "./SameVendorOrSameCatProducts";
import OverviewReviewSpecification from "./OverviewReviewSpecification";

import { getProductStockQuantity } from "./../../utils/stock-helpers";

import { options } from "./../../utils/common-helpers";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

// eslint-disable-next-line
const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ProductDetails = (props) => {
  const [cart, setCart] = useContext(CartContext);
  const [showModal, setShowModal] = useContext(ShowModalContext);

  const [productSlug, setProductSlug] = useState(props.match.params.slug);
  const [productId, setProductId] = useState(productSlug.split("-").pop());
  // const [productId, setProductId] = useState(props.match.params.id);
  const [combinations, setCombinations] = useState([]);
  const [discountAmount, setDiscountAmount] = useState([]);
  const [
    product_list_same_vendor_other_cat,
    set_product_list_same_vendor_other_cat,
  ] = useState([]);
  const [
    product_list_same_category_other_ven,
    set_product_list_same_category_other_ven,
  ] = useState([]);

  const [category_id, set_category_id] = useState("");
  const [vendor_id, set_vendor_id] = useState("");
  const [productName, set_productName] = useState("");
  const [homeImage, set_homeImage] = useState("");
  const [product_full_description, set_product_full_description] = useState([]);
  const [
    product_specification_details_description,
    set_product_specification_details_description,
  ] = useState([]);
  const [carouselImages, set_carouselImages] = useState([]);
  const [qc_status, set_qc_status] = useState("");
  const [product_sku, set_product_sku] = useState("");
  const [productPrice, set_productPrice] = useState(0);
  const [metaTags, set_metaTags] = useState([]);
  const [colors, set_colors] = useState([]);
  const [sizes, set_sizes] = useState([]);
  const [onlyColor, set_onlyColor] = useState(false);
  const [onlySize, set_onlySize] = useState(false);
  const [noColorAndSize, set_noColorAndSize] = useState(false);
  const [colorAndSize, set_colorAndSize] = useState(false);

  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProductStockAmount, setSelectedProductStockAmount] = useState(
    0
  );
  const [selectedSizeId, setSelectedSizeId] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState(0);
  const [selectedColorName, setSelectedColorName] = useState("");

  const [show_alert, set_show_alert] = useState(false);
  const [alert_text, set_alert_text] = useState("");

  const [stock_quantity, set_stock_quantity] = useState(-999);

  useEffect(() => {
    setProductId(productSlug.split("-").pop());
    getProductDetails();
    getDiscountAmount();
    getProductCombinations();
    sameVendorOtherCatProducts();
    sameCatOtherVendorProducts();
  }, []);

  const getProductCombinations = () => {
    axios
      .get(`${base}/api/productCombinationsFromStock/${productId}`)
      .then((res) => setCombinations(res.data.combinations));
  };

  const getDiscountAmount = () => {
    axios
      .get(`${base}/api/getDiscountByProductId/${productId}`)
      .then((res) => setDiscountAmount(res.data.discountAmount));
  };

  const sameVendorOtherCatProducts = () => {
    axios
      .get(`${base}/api/sameVendorOrCat/${productId}/v`)
      .then((res) =>
        set_product_list_same_vendor_other_cat(res.data.sameVendorOrCat)
      );
  };

  const sameCatOtherVendorProducts = () => {
    axios
      .get(`${base}/api/sameVendorOrCat/${productId}/c`)
      .then((res) =>
        set_product_list_same_category_other_ven(res.data.sameVendorOrCat)
      );
  };

  const getProductDetails = () => {
    axios
      .get(`${base}/api/productDetails/${productId}`)
      .then((res) => setProductDetails(res.data));
  };

  const setProductDetails = (data) => {
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
      product_sku,
    } = data;

    set_category_id(category_id);
    set_vendor_id(vendor_id);
    set_productName(product_name);
    let homeImage = !!home_image ? home_image : "default.png";
    set_homeImage(homeImage);
    set_product_full_description(description);
    set_product_specification_details_description(
      specificationDetailsDescription
    );
    let carousel_Images = !!carouselImages && carouselImages;
    set_carouselImages(carousel_Images);
    let qcstatus = !!qc_status && qc_status;
    set_qc_status(qcstatus);
    let productsku = !!product_sku && product_sku;
    set_product_sku(productsku);
    let product_Price = !!productPrice && productPrice;
    set_productPrice(product_Price);
    let meta_Tags = !!metaTags && metaTags;
    set_metaTags(meta_Tags);
    set_colors(colors);
    set_sizes(sizes);

    let onlyColor = colors.length > 0 && sizes.length === 0;
    set_onlyColor(onlyColor);
    let onlySize = sizes.length > 0 && colors.length === 0;
    set_onlySize(onlySize);
    let noColorAndSize = colors.length === 0 && sizes.length === 0;
    set_noColorAndSize(noColorAndSize);
    let colorAndSize = colors.length > 0 && sizes.length > 0;
    set_colorAndSize(colorAndSize);
  };

  const productDescriptions = () => {
    let descriptionText = [];
    if (product_full_description) {
      product_full_description.forEach((item, key) => {
        descriptionText.push(
          <React.Fragment key={key}>
            <h1 className="h3 pt-2 pl-2" key={`title-${key}`}>
              {item.title}
            </h1>
            {item.descriptionImage ? (
              <img
                className="img-fluid pt-2 pl-2"
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
            <p className="pt-2 pl-2" key={`desc-${key}`}>
              {item.description}
            </p>
          </React.Fragment>
        );
      });
    } else {
      descriptionText.push(
        <p style={{ color: "#ec1c24" }} key={`desc-${0}`}>
          No Descriptions Added
        </p>
      );
    }
    return descriptionText;
  };

  const handleClickMinus = () => {
    productQuantity > 1
      ? setProductQuantity(productQuantity - 1)
      : setProductQuantity(0);
  };

  const handleClickPlus = () => {
    productQuantity < selectedProductStockAmount
      ? setProductQuantity(productQuantity + 1)
      : setProductQuantity(productQuantity);
  };

  const doesSelectedColorExist = () => {
    if (!selectedColorId) return;

    if (selectedSizeId && selectedColorId) {
      doesSelectedProductExist();
      return;
    }

    const selectedProduct = {
      productId: Number(productId),
      colorId: selectedColorId === "" ? 0 : selectedColorId * 1,
    };

    const isExists = combinations.filter((item) => {
      const newItem = { ...item };
      delete newItem.quantity;
      delete newItem.sizeId;
      return isEqual(newItem, selectedProduct);
    });

    if (isExists.length > 0) {
      setSelectedProductStockAmount(isExists[0].quantity);
      return;
    }

    set_show_alert(true);
    set_alert_text("Selected Color is Out of Stock!");
    var link = document.getElementById("warningModalButton");
    link.click();

    return;
  };

  const doesSelectedSizeExist = () => {
    if (!selectedSizeId) return;

    if (selectedSizeId && selectedColorId) {
      doesSelectedProductExist();
      return;
    }

    const selectedProduct = {
      productId: Number(productId),
      sizeId: selectedSizeId === "" ? 0 : selectedSizeId * 1,
    };

    const isExists = combinations.filter((item) => {
      const newItem = { ...item };
      delete newItem.quantity;
      delete newItem.colorId;
      return isEqual(newItem, selectedProduct);
    });

    if (isExists.length > 0) {
      setSelectedProductStockAmount(isExists[0].quantity);
      return true;
    }

    set_show_alert(true);
    set_alert_text("Selected Size is Out of Stock!");
    var link = document.getElementById("warningModalButton");
    link.click();

    return false;
  };

  const doesSelectedProductExist = () => {
    const selectedProduct = {
      productId: Number(productId),
      colorId: selectedColorId === "" ? 0 : selectedColorId * 1,
      sizeId: selectedSizeId === "" ? 0 : selectedSizeId * 1,
    };

    const isExists = combinations.filter((item) => {
      const newItem = { ...item };
      delete newItem.quantity;
      return isEqual(newItem, selectedProduct);
    });

    if (isExists.length > 0) {
      setSelectedProductStockAmount(isExists[0].quantity);
      return true;
    }

    set_show_alert(true);
    set_alert_text("Product is Out of Stock!");
    var link = document.getElementById("warningModalButton");
    link.click();

    return false;
  };

  const checkProductToCartEligibility = () => {
    if (onlyColor) {
      if (selectedColorId === "" || selectedColorId === 0) {
        set_show_alert(true);
        set_alert_text("Please Select a Color");
        var link = document.getElementById("warningModalButton");
        link.click();
        return false;
      }
    } else if (onlySize) {
      if (selectedSizeId === "" || selectedSizeId === 0) set_show_alert(true);
      set_alert_text("Please Select a Size");
      var link = document.getElementById("warningModalButton");
      link.click();
      return false;
    } else if (!noColorAndSize) {
      if (selectedColorId === "" || selectedColorId === 0) {
        set_show_alert(true);
        set_alert_text("Please Select a Color");
        var link = document.getElementById("warningModalButton");
        link.click();
        return false;
      }
      if (selectedSizeId === "" || selectedSizeId === 0) {
        set_show_alert(true);
        set_alert_text("Please Select a Size");
        var link = document.getElementById("warningModalButton");
        link.click();
        return false;
      }
    }
    return true;
  };

  const addToLocalStorage = (data) => (e) => {
    getProductStockQuantity().then((data) => {
      console.log(data);
    });
    return;

    if (!checkProductToCartEligibility()) return;

    if (!doesSelectedProductExist()) return;

    const cartObj = {
      productId,
      colorId: selectedColorId === "" ? 0 : selectedColorId * 1,
      sizeId: selectedSizeId === "" ? 0 : selectedSizeId * 1,
      quantity: productQuantity * 1,
    };

    // setCart((currentState) => [...currentState, cartObj]);

    const cartDataExisting = JSON.parse(localStorage.getItem(data));

    if (cartDataExisting && cartDataExisting.length) {
      localStorage.removeItem(data);
      let cardUpdated = false;

      const revisedCartData = cartDataExisting.map((item) => {
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
      setCart(revisedCartData);
    } else {
      localStorage.setItem(data, JSON.stringify([{ ...cartObj }]));
      setCart(cartObj);
    }

    if (localStorage.customer_id) {
      fetch(base + "/api/add_cart_direct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cartObj,
          customerId: localStorage.customer_id * 1,
          buttonClick: data,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((response) => {
          if (response.data === true) {
            let id = "";
            if (data === "cart") id = "successCartMessage";
            else if (data === "wish") id = "WishListModalButton";
            var link = document.getElementById(id);
            if (showModal) link.click();
          }
        });
    } else {
      let id = "";
      if (data === "cart") id = "successCartMessage";
      else if (data === "wish") id = "WishListModalButton";
      var link = document.getElementById(id);
      if (showModal) link.click();
    }
  };

  const handleCheck = (e) => {
    setShowModal(!e.target.checked);
    localStorage.setItem("showModal", !e.target.checked);
  };

  const selectSizeHandler = (e) => {
    setSelectedSizeId(e.target.value);
    doesSelectedSizeExist();
  };

  useEffect(() => {
    doesSelectedSizeExist();
  }, [selectedSizeId]);

  const selectColorHandler = (e) => {
    setSelectedColorId(e.target.id);
    setSelectedColorName(e.target.name);
  };

  useEffect(() => {
    doesSelectedColorExist();
  }, [selectedColorId]);

  const shareUrl = `http://banijjo.com.bd/productDetails/${productId}`;

  const imgProps = {
    img: `${fileUrl}/upload/product/compressedProductImages/${homeImage}`,
    // img: `/image/test_low.png`,
    width: 340,
    // heigth: 600,
    scale: 1.4,
    offset: { vertical: 0, horizontal: 10 },
    zoomStyle: "opacity: 1",
    zoomLensStyle: "opacity: 0",
  };

  return (
    <Fragment>
      <Helmet>
        <meta
          name="viewport"
          content="user-scalable=no, width=device-width, initial-scale=1.0"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {metaTags &&
          metaTags.map((tags, index) => (
            <meta name="description" key={index} content={tags} />
          ))}
        {carouselImages &&
          carouselImages.map(({ imageName }) => (
            <meta name="description" key={imageName} content={imageName} />
          ))}
      </Helmet>

      <div className="container">
        {/* social icons  */}
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

        {/* modal buttons hidden  */}
        <div className="d-none">
          <button
            style={{ display: "none !important" }}
            id="successCartMessage"
            type="button"
            data-toggle="modal"
            data-target="#cartSuccessModalCenter"
          ></button>

          <button
            style={{ display: "none !important" }}
            id="WishListModalButton"
            type="button"
            data-toggle="modal"
            data-target="#WishListModal"
          ></button>

          <button
            style={{ display: "none !important" }}
            id="warningModalButton"
            type="button"
            data-toggle="modal"
            data-target="#warningModal"
          ></button>
        </div>

        {/* Warning Modal  */}
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

        {/* Shopping Cart Modal  */}
        <div
          className="modal fade"
          id="cartSuccessModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="cartSuccessModalCenter"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body cart-modal-body">
                <p className="pt-4">
                  <i className="fa fa-check font-80" />
                </p>
                <p className="pt-2 pb-2">
                  Product has been added to your Shopping Cart.
                </p>
              </div>
              <div className="form-check ml-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showcartmodalcheckbox"
                  onClick={handleCheck}
                />
                <label
                  className="form-check-label"
                  htmlFor="showcartmodalcheckbox"
                >
                  Do not show in future
                </label>
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
        {/* End of Shopping Cart Modal  */}

        {/* Wishlist Modal  */}
        <div
          className="modal fade"
          id="WishListModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="WishListModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body cart-modal-body">
                <p className="pt-4">
                  <i className="fa fa-check font-80" />
                </p>
                <p className="pt-2 pb-2">
                  Product has been added to your Wish Cart.
                </p>
              </div>
              <div className="form-check ml-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showcartmodalcheckbox"
                  onClick={handleCheck}
                />
                <label
                  className="form-check-label"
                  htmlFor="showcartmodalcheckbox"
                >
                  Do not show in future
                </label>
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
        {/* End of Wishlist Modal  */}

        {/* div  */}
        <Fragment>
          {/* desktop  */}
          <div className="d-none d-lg-block mt-2">
            <div className="row">
              <div className="col-4 zoomImageDiv" style={{ zIndex: "1000" }}>
                {/* Zoom Images */}
                <ReactImageZoom {...imgProps} />

                {/* <ReactImageMagnify {...imgProps} /> */}

                <Carousel
                  additionalTransfrom={-2 * 3}
                  swipeable
                  draggable
                  showDots={false}
                  arrows
                  slidesToSlide={1}
                  autoPlay={true}
                  autoPlaySpeed={1000}
                  centerMode={false}
                  className=""
                  containerclassName="container"
                  dotListclassName=""
                  focusOnSelect={false}
                  infinite
                  itemclassName=""
                  sliderclassName=""
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
                            set_homeImage(item.imageName);
                          }}
                        >
                          <img
                            className="img-fluid mr-2 ml-1"
                            src={`${fileUrl}/upload/product/compressedProductImages/${item.imageName}`}
                            alt={item.imageName}
                            title={item.imageName}
                            style={{
                              width: "10em",
                              // height: "7.5em",
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
                              <div
                                key={colorId}
                                className="col-1 mb-1 product-colors"
                              >
                                <img
                                  src={`${fileUrl}/upload/product/compressedProductImages/${imageName}`}
                                  onClick={selectColorHandler}
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
                          onChange={selectSizeHandler}
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
                            onClick={handleClickMinus}
                            className="entry value-minus"
                          >
                            &nbsp;
                          </div>
                          <div className="entry value">
                            <span>{productQuantity}</span>
                          </div>
                          <div
                            onClick={handleClickPlus}
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
                    {discountAmount === 0 ? (
                      <Fragment>
                        <i className="item_price">৳&nbsp;{productPrice}</i>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <span>৳{productPrice}</span>{" "}
                        <i className="item_price">
                          ৳{productPrice - discountAmount}
                        </i>
                      </Fragment>
                    )}
                  </p>
                  <button
                    className="btn btn-outline-success rounded-0 mr-3"
                    onClick={addToLocalStorage("cart")}
                  >
                    Add to cart
                  </button>
                  <button
                    className="btn btn-outline-success rounded-0"
                    onClick={addToLocalStorage("wish")}
                  >
                    Add to wish list
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* mobile  */}
          <div className="d-block d-lg-none">
            <div className="col-11">
              <img
                className="img-fluid"
                src={`${fileUrl}/upload/product/compressedProductImages/${homeImage}`}
                title={homeImage}
                alt={homeImage}
              />
            </div>

            <div className="col-11 product-details-carousel-mb">
              <Carousel
                arrows={false}
                showDots={false}
                sliderclassName=""
                slidesToSlide={1}
                swipeable
                autoPlay={false}
                autoPlaySpeed={1000}
                centerMode={false}
                className=""
                containerclassName=""
                dotListclassName=""
                draggable
                focusOnSelect={false}
                infinite
                itemclassName=""
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
                    items: 3,
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
                          set_homeImage(item.imageName);
                        }}
                      >
                        <img
                          className="img-fluid"
                          src={`${fileUrl}/upload/product/compressedProductImages/${item.imageName}`}
                          alt={item.imageName}
                          title={item.imageName}
                          style={{
                            width: "10em",
                            paddingTop: "1em",
                            // paddingRight: "10px",
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
                                onClick={selectColorHandler}
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
                        onChange={selectSizeHandler}
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
                          onClick={handleClickMinus}
                          className="entry value-minus"
                        >
                          &nbsp;
                        </div>
                        <div className="entry value">
                          <span>{productQuantity}</span>
                        </div>
                        <div
                          onClick={handleClickPlus}
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
                  {discountAmount === 0 ? (
                    <Fragment>
                      <i className="item_price">৳&nbsp;{productPrice}</i>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <span>৳{productPrice}</span>{" "}
                      <i className="item_price">
                        ৳{productPrice - discountAmount}
                      </i>
                    </Fragment>
                  )}
                </p>
                <button
                  className="btn btn-outline-success rounded-0 mr-3"
                  onClick={addToLocalStorage("cart")}
                >
                  Add to cart
                </button>
                <button
                  className="btn btn-outline-success rounded-0"
                  onClick={addToLocalStorage("wish")}
                >
                  Add to wish list
                </button>
              </div>
            </div>
          </div>
        </Fragment>

        {/* OVERVIEW, CUSTOMER REVIEWS, SPECIFICATIONS */}
        <OverviewReviewSpecification
          product_full_description={product_full_description}
          product_specification_details_description={
            product_specification_details_description
          }
        />
        {/* END OF  OVERVIEW, CUSTOMER REVIEWS, SPECIFICATIONS */}

        {/*Same Category - Other Vendor Products*/}
        {product_list_same_category_other_ven && (
          <div className="row mt-2">
            <div className="col-12">
              <SameVendorOrSameCatProducts
                vorc={"c"}
                id={category_id}
                products={product_list_same_category_other_ven}
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
    </Fragment>
  );
};

export default ProductDetails;
