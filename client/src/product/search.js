import React, { Component, Fragment } from "react";
import axios from "axios";

import CategoriesMb from '../components/home-page/category-sidebar/categories-mb';
import MainCategoriesSidebar from '../components/home-page/category-sidebar/main-categories-sidebar';
import ProductCard from '../components/shared/product-card';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: this.props.match.params.keyName,
      categories: [],
      productList: []
    };
  }

  componentDidMount() {
    this.getAllCtegoryList();
    this.categoryProductLIst();    
  }
  

  getAllCtegoryList() {
    axios
      .get(`${base}/api/all_category_list`)
      .then(res => this.setState({ categories: res.data.data }));
  }

  categoryProductLIst() {
    fetch(base + "/api/searchProductList", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        searchKey: this.state.searchKey
      })
    })
      .then(res => {
        return res.json();
      })
      .then(products => {
        this.setState({
          productList: products.data
        });
      });
  }

  render() {
    const { productList, categories } = this.state;
    
    return (

      <div className="container mt-2">
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


            <div className="row">
              <div className="col-12 mt-2">
                Search Results for "<b>{this.state.searchKey}</b>"
                </div>
            </div>

            <div className="row">
              {productList && productList.length > 0 && productList.map((product) => (
                <div className="col-productlist mb-3" key={product.product_id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>


          </div>

        </div>
      </div>

    );
  }
}
export default Search;
