import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import ProductListBreadCrumb from "../components/shared/productListBreadCrumb";
import CategoriesMb from "../components/home-page/category-sidebar/categories-mb";
import MainCategoriesSidebar from "../components/home-page/category-sidebar/main-categories-sidebar";
import ProductCard from "../components/shared/product-card";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class ProductList extends Component {
  state = {
    slug: this.props.match.params.slug,
    // categoryId: this.props.match.params.cid,
    categoryId: this.props.match.params.slug.split('-').pop(),
    categories: [],
    productList: [],
  };

  componentDidMount() {
    this.getProductListByCategoryId();
    this.getAllCtegoryList();
  }

  getProductListByCategoryId() {
    axios
      .get(`${base}/api/productListByCat/${this.state.categoryId}`)
      .then((res) => this.setState({ productList: res.data }));
  }

  getAllCtegoryList() {
    axios
      .get(`${base}/api/all_category_list`)
      .then((res) => this.setState({ categories: res.data.data }));
  }

  render() {
    const { productList, categories } = this.state;

    return (
      <>
        <Helmet>
          <title>Product List</title>
          <meta
            name="viewport"
            content="user-scalable=no, width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="page containing list of products" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          {categories.length > 0 &&
            categories.map(({ category }) => (
              <meta
                name="subject"
                key={category.category_name}
                content={category.category_name}
              />
            ))}

          {productList.length > 0 &&
            productList.map(({ breadcrumbs, products }) =>
              products.map((product, index) => (
                <meta
                  name="keywords"
                  key={index}
                  content={product.product_name}
                />
              ))
            )}
        </Helmet>

        <div className="container">
          <div className="row">
            {categories.length > 0 && (
              <div className="col-lg-3 col-md-12">
                <div className="d-none d-lg-block">
                  <MainCategoriesSidebar categories={categories} />
                </div>

                <div className="d-block d-lg-none mb-4">
                  <CategoriesMb categories={categories} />
                </div>
              </div>
            )}

            <div className="col-lg-9 col-md-12">
              {productList.length > 0 &&
                productList.map(({ breadcrumbs, products }) => (
                  <div key={products.product_id}>
                    <div className="row" key={products.product_id}>
                      <div className="col-12">
                        <ProductListBreadCrumb breadcrumbs={breadcrumbs} />
                      </div>
                    </div>

                    <div className="row">
                      {products.map((product) => (
                        <div
                          className="col-productlist mb-3"
                          key={product.product_id}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ProductList;
