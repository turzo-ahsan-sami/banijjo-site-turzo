import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import CategoriesMb from '../components/home-page/category-sidebar/categories-mb';
import MainCategoriesSidebar from '../components/home-page/category-sidebar/main-categories-sidebar';
import ProductCard from '../components/shared/product-card';

import { base, frontEndUrl, fileUrl, emailPattern, options } from "../utils/common-helpers";
import { capitalizeStr } from "../utils/utils";

const FeatureProductsList = ({ match }) => {

    const [featuredProductsList, setFeaturedProductsList] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getFeatureproducts();
        getAllCtegoryList();
    }, []);


    const getFeatureproducts = () => {
        axios
            .get(`${base}/api/featureproducts/${match.params.id}`)
            .then(res => setFeaturedProductsList(res.data.data));
    }

    const getAllCtegoryList = () => {
        axios
            .get(`${base}/api/all_category_list`)
            .then(res => setCategories(res.data.data));
    }

    return (
        <>
            <Helmet>
                <title>Featured Products</title>
                <meta
                    name="viewport"
                    content="user-scalable=no, width=device-width, initial-scale=1.0"
                />
                <meta
                    name="description"
                    content="page containing list of featured products"
                />
            </Helmet>

            <div className="container">
                <div className="row">

                    {categories.length > 0 &&
                        <div className="col-lg-3 col-md-12">
                            <div className="d-none d-lg-block">
                                <MainCategoriesSidebar categories={categories} />
                            </div>

                            <div className="d-block d-lg-none mb-4">
                                <CategoriesMb categories={categories} />
                            </div>
                        </div>
                    }

                    <div className="col-lg-9 col-md-12">
                        {featuredProductsList && (
                            <>

                                <div className="row">
                                    <div className="col-12">
                                        <h1 className="h4">{capitalizeStr(featuredProductsList.featureName)}</h1>
                                    </div>
                                </div>

                                <div className="row">
                                    {featuredProductsList.products.length > 0 &&
                                        featuredProductsList.products.map(product => (
                                            <div className="col-productlist mb-3" key={product.product_id}>
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                </div>

                            </>
                        )}
                    </div>

                </div>
            </div>

        </>
    );
};

export default FeatureProductsList;
