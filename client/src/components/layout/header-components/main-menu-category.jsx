import React, { Component } from "react";
import axios from "axios";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class MainMenuCategory extends Component {
  state = {
    categories: []
  };

  componentDidMount() {
    this.getAllCategories();
  }

  getAllCategories = () => {
    axios
      .get(`${base}/api/getTopNavbarCategory`)
      .then(res => this.setState({ categories: res.data.data }));
  };

  render() {
    const { categories } = this.state;
    return (
      <div className="row mt-n1">
        <div className="col-12">
          {categories.length > 0
            ? categories.map(el => (
                <span className="mr-2 main-menu" key={el.id}>
                  <a
                    href={`/productList/${el.slug}`}
                  >
                    {el.category_name}
                  </a>
                </span>
              ))
            : null}
        </div>
      </div>
    );
  }
}

export default MainMenuCategory;
