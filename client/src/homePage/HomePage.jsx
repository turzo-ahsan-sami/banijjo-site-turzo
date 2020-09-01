import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import InfiniteScroll from "react-infinite-scroll-component";

import { capitalizeStr } from "../utils/utils";

import CookieConsentComponent from "../components/home-page/cookie-consent";
import MainSlider from "../components/home-page/main-slider";
import SubSlider from "../components/home-page/sub-slider";
import ProductCard from "../components/shared/product-card";
import ProductCardConditional from "../components/shared/product-card-conditional";
import VendorCarouselSlider from "../components/home-page/vendor-carousel-slider";
import MainCategoriesSidebar from "../components/home-page/category-sidebar/main-categories-sidebar";
import CategoriesMb from "../components/home-page/category-sidebar/categories-mb";
import HotDealSlider from "../components/home-page/hot-deal-slider";
import ListingFeaturedCategoryTree from "../components/home-page/listing-featured-category-tree";
import ListingFeaturedCategoryTreeMB from "../components/home-page/listing-featured-category-tree-mb";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

const HomePage = () => {
  const [mainSliderImages, setBannerImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);

  const [bannerImagesProducts, setBannerImagesProducts] = useState([]);

  const [hotDealProducts, setHotDealProducts] = useState({
    title: "",
    products: [],
  });
  const [topSelectionProducts, setTopSelectionProducts] = useState({
    feature_id: 0,
    title: "",
    products: [],
  });
  const [topSelectionBigProducts, setTopSelectionBigProducts] = useState({
    feature_id: 0,
    title: "",
    products: [],
  });
  const [newForYouProducts, setNewForYouProducts] = useState({
    feature_id: 0,
    title: "",
    products: [],
  });
  const [storesWillLoveProducts, setStoresWillLoveProducts] = useState({
    feature_id: 0,
    title: "",
    products: [],
  });
  const [otherProducts, setOtherProducts] = useState({
    title: "",
    products: [],
  });

  const [moreProducts, setmoreProducts] = useState([]);

  const [otherProductsDesk, setOtherProductsDesk] = useState([]);
  const [otherProductsMb, setOtherProductsMb] = useState([]);

  const [visibleDesk, setVisibleDesk] = useState(5);
  const [visibleMb, setVisibleMb] = useState(6);

  useEffect(() => {
    getTopMainBanners();
    getFeatureProductList();
    getCategories();
    getVendors();
    getFeaturedCategories();
  }, []);

  const getTopMainBanners = () => {
    axios
      .get(`${base}/api/top_main_banners`)
      .then((res) => setBannerImages(res.data.data));
  };

  const getFeatureProductList = () => {
    axios
      .get(`${base}/api/feature_product_list`)
      .then((res) => setFeatureProductValues(res.data.data));
  };

  const getCategories = () => {
    axios
      .get(`${base}/api/all_category_list`)
      .then((res) => setCategories(res.data.data));
  };

  const getVendors = () => {
    axios.get(`${base}/api/vendors`).then((res) => setVendors(res.data.data));
  };

  const getFeaturedCategories = () => {
    axios
      .get(`${base}/api/feature_category`)
      .then((res) => setFeaturedCategories(res.data[0]));
  };

  const setFeatureProductValues = (data) => {
    let bannerImages = null;
    let hotDeals = null;
    let topSelection = null;
    let topSelectionBig = null;
    let newForYou = null;
    let storesWillLove = null;
    let others = null;
    let more = null;

    for (const resultArrElement of data) {
      const key = Object.keys(resultArrElement)[0];
      if (key === "1") {
        bannerImages = resultArrElement["1"];
      } else if (key === "2") {
        hotDeals = resultArrElement["2"];
      } else if (key === "3") {
        topSelection = resultArrElement["3"];
      } else if (key === "4") {
        newForYou = resultArrElement["4"];
      } else if (key === "5") {
        topSelectionBig = resultArrElement["5"];
      } else if (key === "6") {
        storesWillLove = resultArrElement["6"];
      } else if (key === "7") {
        others = resultArrElement["7"];
      } else if (key === "8") {
        more = resultArrElement["8"];
      }
    }

    setBannerImagesProducts(bannerImages.products);
    setHotDealProducts({
      title: hotDeals.title,
      products: hotDeals.products,
    });
    setTopSelectionProducts({
      feature_id: topSelection.feature_id,
      title: topSelection.title,
      products: topSelection.products.slice(0, 3),
    });
    setTopSelectionBigProducts({
      feature_id: topSelectionBig.feature_id,
      title: topSelectionBig.title,
      products: topSelectionBig.products.slice(0, 3),
    });
    setNewForYouProducts({
      feature_id: newForYou.feature_id,
      title: newForYou.title,
      products: newForYou.products.slice(0, 2),
    });
    setStoresWillLoveProducts({
      feature_id: storesWillLove.feature_id,
      title: storesWillLove.title,
      products: storesWillLove.products.slice(0, 2),
    });
    setOtherProducts({
      title: others.title,
      products: others.products,
    });

    setmoreProducts(more.products);
    setOtherProductsDesk([...others.products.slice(0, 5)]);
    setOtherProductsMb([...others.products.slice(0, 6)]);
  };

  const fetchMoreDataDesk = () => {
    setTimeout(() => {
      setOtherProductsDesk([
        ...otherProductsDesk,
        ...otherProducts.products.slice(visibleDesk, visibleDesk + 5),
      ]);
      setVisibleDesk(visibleDesk + 5);
    }, 300);
  };

  const fetchMoreDataMb = () => {
    setTimeout(() => {
      setOtherProductsMb([
        ...otherProductsMb,
        ...otherProducts.products.slice(visibleMb, visibleMb + 6),
      ]);
      setVisibleMb(visibleMb + 6);
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>Banijjo | বাণিজ্য : দেশ - ই - বাজার</title>
        <link rel="shortcut icon" href="%PUBLIC_URL%/favicon_.ico" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta httpEquiv="Content-Type" content="text/html" />
        <meta
          name="viewport"
          content="user-scalable=no, width=device-width, initial-scale=1.0"
        />
        <meta
          name="Description"
          content="Online shopping center in Bangladesh. All kinds of local products available here in Banijjo. We promote MSME's manufactured products by our eCommerce Market Places Banijjo.com and Banijjo.com.bd. Here you can find most unique handiwork of Bangladesh. "
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />        
      </Helmet>

      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12">
            <div className="d-none d-lg-block">
              <MainCategoriesSidebar categories={categories} />
            </div>

            <div className="d-block d-lg-none mb-4">
              <CategoriesMb categories={categories} />
            </div>
          </div>

          <div className="col-lg-9 col-md-12">
            <MainSlider images={mainSliderImages} />
            <SubSlider products={bannerImagesProducts} />
          </div>
        </div>

        <div className="mt-4">
          <h1 className="h5">{capitalizeStr(hotDealProducts.title)}</h1>
          <HotDealSlider products={hotDealProducts.products} />
        </div>

        <div className="row mt-4">
          {/* topSelectionProducts */}
          <div className="col-lg-6 col-md-12">
            <div className="row">
              <div className="col-12">
                <h1 className="h5 float-left">{topSelectionProducts.title}</h1>
                <div className="float-right see-more">
                  <a
                    href={`/featureproducts/${topSelectionProducts.feature_id}`}
                  >
                    See more
                  </a>
                </div>
              </div>
            </div>

            <div className="d-none d-lg-block">
              <div className="row">
                {topSelectionProducts.products.map((product) => (
                  <div className="col-4" key={product.product_id}>
                    {/* <ProductCard product={product} /> */}
                    <ProductCardConditional
                      product={product}
                      customNewLabelCSSDesktop="product-new-label-topselction"
                      customDiscountCSSDesktop="product-new-label-discount-topselection"
                      customNewLabelCSSMobile="product-new-label-threeDiv"
                      customDiscountCSSMobile="product-new-label-discount-threeDiv"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="d-block d-lg-none">
              <div className="row no-gutters">
                {topSelectionProducts.products.map((product) => (
                  <div className="col-4 pr-2" key={product.product_id}>
                    {/* <ProductCard product={product} /> */}
                    <ProductCardConditional
                      product={product}
                      customNewLabelCSSDesktop="product-new-label-topselction"
                      customDiscountCSSDesktop="product-new-label-discount-topselection"
                      customNewLabelCSSMobile="product-new-label-threeDiv"
                      customDiscountCSSMobile="product-new-label-discount-threeDiv"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* topSelectionBigProducts */}
          <div className="col-lg-6 col-md-12 mt-4 mt-lg-0">
            <div className="row">
              <div className="col-12">
                <h1 className="h5 float-left">
                  {topSelectionBigProducts.title}
                </h1>
                <div className="float-right see-more">
                  <a
                    href={`/featureproducts/${topSelectionBigProducts.feature_id}`}
                  >
                    See more
                  </a>
                </div>
              </div>
            </div>

            <div className="d-none d-lg-block">
              <div className="row">
                {topSelectionBigProducts.products.map((product) => (
                  <div className="col-4" key={product.product_id}>
                    {/* <ProductCard product={product} /> */}
                    <ProductCardConditional
                      product={product}
                      customNewLabelCSSDesktop="product-new-label-topselction"
                      customDiscountCSSDesktop="product-new-label-discount-topselection"
                      customNewLabelCSSMobile="product-new-label-threeDiv"
                      customDiscountCSSMobile="product-new-label-discount-threeDiv"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="d-block d-lg-none">
              <div className="row no-gutters">
                {topSelectionBigProducts.products.map((product) => (
                  <div className="col-4 pr-2" key={product.product_id}>
                    {/* <ProductCard product={product} /> */}
                    <ProductCardConditional
                      product={product}
                      customNewLabelCSSDesktop="product-new-label-topselction"
                      customDiscountCSSDesktop="product-new-label-discount-topselection"
                      customNewLabelCSSMobile="product-new-label-threeDiv"
                      customDiscountCSSMobile="product-new-label-discount-threeDiv"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          {/* newForYouProducts */}
          <div className="col-lg-6 col-md-12">
            <div className="row">
              <div className="col-12">
                <h1 className="h5 float-left">
                  {capitalizeStr(newForYouProducts.title)}
                </h1>
                <div className="float-right see-more">
                  <a href={`/featureproducts/${newForYouProducts.feature_id}`}>
                    See more
                  </a>
                </div>
              </div>
            </div>

            <div className="row">
              {newForYouProducts.products.map((product) => (
                <div className="col-6" key={product.product_id}>
                  {/* <ProductCard product={product} /> */}
                  <ProductCardConditional
                    product={product}
                    customNewLabelCSSDesktop="product-new-label"
                    customDiscountCSSDesktop="product-new-label-discount"
                    customNewLabelCSSMobile="product-new-label-twoDiv"
                    customDiscountCSSMobile="product-new-label-discount-twoDiv"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* storesWillLoveProducts */}
          <div className="col-lg-6 col-md-12 mt-4 mt-lg-0">
            <div className="row">
              <div className="col-12">
                <h1 className="h5 float-left">
                  {storesWillLoveProducts.title}
                </h1>
                <div className="float-right see-more">
                  <a
                    href={`/featureproducts/${storesWillLoveProducts.feature_id}`}
                  >
                    See more
                  </a>
                </div>
              </div>
            </div>

            <div className="row">
              {storesWillLoveProducts.products.map((product) => (
                <div className="col-6" key={product.product_id}>
                  {/* <ProductCard product={product} /> */}
                  <ProductCardConditional
                    product={product}
                    customNewLabelCSSDesktop="product-new-label"
                    customDiscountCSSDesktop="product-new-label-discount"
                    customNewLabelCSSMobile="product-new-label-twoDiv"
                    customDiscountCSSMobile="product-new-label-discount-twoDiv"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* brand e shop  */}
        <div className="mt-4">
          <div className="row">
            <div className="col-12">
              <h1 className="h5 float-left">{capitalizeStr(vendors.title)}</h1>
              <div className="float-right see-more">
                <a href="#">See more</a>
              </div>
            </div>
          </div>
          <VendorCarouselSlider vendors={vendors.vendors} />
        </div>

        {featuredCategories && (
          <>
            <div className="d-none d-lg-block mt-4">
              <h1 className="h5">Featured Categories</h1>
              <ListingFeaturedCategoryTree
                featuredCategories={featuredCategories}
              />
            </div>

            <div className="d-block d-lg-none mt-4">
              <h1 className="h5">Featured Categories</h1>
              <ListingFeaturedCategoryTreeMB
                featuredCategories={featuredCategories}
              />
            </div>
          </>
        )}

        {/* otherProducts */}
        <div className="d-none d-lg-block mt-4">
          <h1 className="h5">{capitalizeStr(otherProducts.title)}</h1>

          <div className="row">
            <InfiniteScroll
              dataLength={otherProductsDesk.length}
              next={fetchMoreDataDesk}
              hasMore={true}
            >
              {otherProductsDesk.map((product) => (
                <div
                  className="col-md-5ths mb-3 custom-fade-in"
                  key={product.product_id}
                >
                  {/* <ProductCard product={product} /> */}
                  <ProductCardConditional
                    product={product}
                    customNewLabelCSSDesktop="product-new-label-others"
                    customDiscountCSSDesktop="product-new-label-discount-others"
                    customNewLabelCSSMobile="product-new-label-threeDiv"
                    customDiscountCSSMobile="product-new-label-discount-threeDiv"
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>

        <div className="d-block d-lg-none mt-4">
          <h1 className="h5">{capitalizeStr(otherProducts.title)}</h1>

          <div className="row">
            <InfiniteScroll
              className="no-gutters pl-2 pr-1"
              dataLength={otherProductsMb.length}
              next={fetchMoreDataMb}
              hasMore={true}
            >
              {otherProductsMb.map((product) => (
                <div
                  className="col-3ths mb-3 pr-2 custom-fade-in"
                  key={product.product_id}
                >
                  {/* <ProductCard product={product} /> */}
                  <ProductCardConditional
                    product={product}
                    customNewLabelCSSDesktop="product-new-label-others"
                    customDiscountCSSDesktop="product-new-label-discount-others"
                    customNewLabelCSSMobile="product-new-label-threeDiv"
                    customDiscountCSSMobile="product-new-label-discount-threeDiv"
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
        {/* end of otherProducts */}

        <CookieConsentComponent />
      </div>
    </>
  );
};

export default HomePage;
