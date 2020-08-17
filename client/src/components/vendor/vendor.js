import React, { Component, Fragment } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import ProductCard from "../shared/product-card";
import { capitalizeStr } from "../../utils/utils";
const { sampleSize } = require("lodash");

const fileUrl = process.env.REACT_APP_FILE_URL;
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class Vendor extends Component {
    state = {
        id: this.props.match.params.slug.split('-').pop(),
        vendorInfo: null,
        categoriesArr: [],
        selectedCatVal: 0,
        dataSet: [],
        items: []
    };

    componentDidMount() {
        this.getCategoriesInfoByVendorId();
        this.getVendorInfoById();
        this.getCatWiseVendorProducts();
    }

    getVendorInfoById() {
        // const { id } = this.props.match.params;
        axios
            .get(`${base}/api/vendorInfoById/${this.state.id}`)
            .then(res => this.setState({ vendorInfo: res.data.vendorInfo }));
    }

    getCategoriesInfoByVendorId() {
        // const { id } = this.props.match.params;
        axios
            .get(`${base}/api/categoriesByVendorId/${this.state.id}`)
            .then(res => this.setState({ categoriesArr: res.data.result }));
    }

    getCatWiseVendorProducts() {
        // const { id } = this.props.match.params;
        axios.get(`${base}/api/getVendorProductsByCategory/${this.state.id}`).then(res => {
            const dataSet = res.data.result;
            const items = this.dataForAllCat(dataSet);
            this.setState({ dataSet, items });
        });
    }

    dataForAllCat(dataSet) {
        return dataSet.map(item => ({
            ...item,
            products: sampleSize(item.products, 8),
            seeMore: false
        }));
    }

    dataForSingleCat(dataSet, catId) {
        const items = dataSet.filter(item => item.categoryId === catId);
        return items.map(item => ({
            ...item,
            seeMore: true
        }));
    }

    onChangeCatHandler = e => {
        const selectedCatVal = e.target.value * 1;
        if (selectedCatVal !== 0) {
            const items = this.dataForSingleCat(this.state.dataSet, selectedCatVal);
            this.setState({ selectedCatVal, items });
        } else if (selectedCatVal === 0) {
            const items = this.dataForAllCat(this.state.dataSet, selectedCatVal);
            this.setState({ selectedCatVal, items });
        }
    };

    onClickCategoryHandler = id => e => {
        const selectedCatVal = id * 1;
        if (selectedCatVal !== 0) {
            const items = this.dataForSingleCat(this.state.dataSet, selectedCatVal);
            this.setState({ selectedCatVal, items });
        } else if (selectedCatVal === 0) {
            const items = this.dataForAllCat(this.state.dataSet, selectedCatVal);
            this.setState({ selectedCatVal, items });
        }
    };

    onClickHandler = data => e => {
        const fullItems = this.dataForSingleCat(this.state.dataSet, data);
        this.setState(prevState => {
            const items = prevState.items.map(item =>
                item.categoryId === data ? fullItems[0] : item
            );
            return { items };
        });
    };

    render() {
        const { vendorInfo, categoriesArr, selectedCatVal, items } = this.state;
        console.log('check...',this.state.id);
        return (
            <Fragment>

                <Helmet>
                    <title>Vendor Details</title>
                    <meta
                        name="description"
                        content="page containing products of vendor}"
                    />
                    <meta
                        name="viewport"
                        content="user-scalable=no, width=device-width, initial-scale=1.0"
                    />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                </Helmet>

                {vendorInfo &&

                    <div className="container">

                        {/* desktop */}
                        <div className="d-none d-lg-block">
                            <div className="row mt-2">
                                <div className="col-2 col-lg-1">
                                    <img
                                        src={fileUrl + '/upload/compressedVendorImages/' + vendorInfo.logo}
                                        className="img-fluid"
                                        alt={vendorInfo.shop_name}
                                        title={vendorInfo.shop_name}
                                    />
                                </div>

                                <div className="col-4 col-lg-8">
                                    <h1 className="h5 pt-3">{capitalizeStr(vendorInfo.shop_name)}</h1>
                                </div>

                                <div className="col-6 col-lg-3">
                                    <select
                                        onChange={this.onChangeCatHandler}
                                        className="custom-select mt-2"
                                        defaultValue={selectedCatVal}
                                        aria-labelledby="lbl-select-category"
                                    >
                                        <option value="0">All Categories</option>
                                        {categoriesArr.map((item) => (
                                            <option value={item.category_id} key={item.category_id}>
                                                {item.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                        </div>

                        {/* mobile  */}
                        <div className="d-block d-lg-none">

                            <div className="row mt-2">
                                <div className="col-4">
                                    <img
                                        src={fileUrl + '/upload/compressedVendorImages/' + vendorInfo.logo}
                                        className="img-fluid"
                                        alt={vendorInfo.shop_name}
                                        title={vendorInfo.shop_name}
                                    />
                                </div>

                                <div className="col-6">
                                    <h1 className="h5 pt-5">{capitalizeStr(vendorInfo.shop_name)}</h1>
                                </div>

                                <div className="col-2 pt-5">

                                    <div className="dropdown">
                                        <button
                                            className="dropdown-toggle dropdowntoggle"
                                            type="button"
                                            data-toggle="dropdown"
                                        >
                                            <i className="fas fa-bars text-primary" />
                                        </button>
                                        <div
                                            className="dropdown-menu dropdown-menu-right"
                                            aria-labelledby="navbarDropdown"
                                        >                                           

                                            {categoriesArr.map((item) => (                                        
                                                <a className="dropdown-item dropdownItemMobile" href="#" onClick={this.onClickCategoryHandler(item.category_id)}>
                                                    {item.category_name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    {/* 
                                        <select
                                            onChange={this.onChangeCatHandler}
                                            className="custom-select mt-2"
                                            defaultValue={selectedCatVal}
                                            aria-labelledby="lbl-select-category"
                                        >
                                            <option value="0">All Categories</option>
                                            {categoriesArr.map((item) => (
                                                <option value={item.category_id} key={item.category_id}>
                                                    {item.category_name}
                                                </option>
                                            ))}
                                        </select> 
                                    */}
                                </div>
                            </div>


                        </div>

                        <div className="row mt-3 mb-4 align-items-center" >
                            <div className="col-md-9 col-sm-12">
                                <img
                                    className="vendorCoverImage"
                                    src={`${fileUrl}/upload/compressedVendorImages/${vendorInfo.cover_photo}`}
                                    alt={vendorInfo.name}
                                    title={vendorInfo.name}
                                />
                            </div>

                            <div className="col-md-3 col-sm-12">
                                <img
                                    className="img-fluid mt-4"
                                    src="https://admin.banijjo.com.bd/upload/product/compressedProductImages/banner3.png"
                                    alt="Ads"
                                    title="Ads"
                                />
                            </div>
                        </div>

                        {items.length > 0 &&
                            items.map((item) => (
                                <div key={item.categoryId}>
                                    <div className="row mt-2">
                                        <div className="col-12">
                                            <h1 className="h5 vendor-title py-2 pl-2">
                                                {capitalizeStr(item.categoryName)}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="row mt-1">
                                        {item.products.length > 0 &&
                                            item.products.map((product) => (
                                                <div
                                                    className="col-vendor mb-3"
                                                    key={product.product_id}
                                                >
                                                    <ProductCard product={product} />
                                                </div>
                                            ))}
                                    </div>

                                    {!item.seeMore && (
                                        <div className="row mb-3">
                                            <div className="col-12">
                                                <button
                                                    type="submit"
                                                    onClick={this.onClickHandler(item.categoryId)}
                                                    className="btn btn-sm btn-primary rounded-0 d-block mx-auto"
                                                    aria-label="See More Button"
                                                >
                                                    See More
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                }


            </Fragment>
        );
    }
}

export default Vendor;