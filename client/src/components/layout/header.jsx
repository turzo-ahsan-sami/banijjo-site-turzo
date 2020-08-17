import React from "react";
import {
  Button,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from "react-bootstrap";

import TopNav from "./header-components/top-nav";
import SearchBox from "./header-components/search-box";
import CartIcon from "./header-components/cart-icon";
import MainMenuCategory from "./header-components/main-menu-category";

const file_url = process.env.REACT_APP_FILE_URL;
const img_src = `${file_url}/upload/company`;

const Header = ({ companyInfo }) => {
  
  return (
    <>
      {/* desktop  */}
      <div className="d-none d-lg-block sticky-top">
        <div className="top-bar" />

        <div className="container">
          <div className="row">
            {/* logo  */}
            <div className="col-3">
              {companyInfo && (
                <div className="text-center">
                  {/* <a href={companyInfo.website}> */}
                  <a href="/">
                    <img
                      className="img-fluid"
                      // src="/image/banijjo.com.bd.png"
                      src={`${img_src}/${companyInfo.logo}`}
                      alt={`${companyInfo.name} logo`}
                      title={`${companyInfo.name} logo`}
                    />
                  </a>
                </div>
              )}
            </div>

            <div className="col-9">
              <div className="row">
                {/* phone  */}
                <div className="col-3">
                  <div className="d-inline-block">
                    <img
                      className="helpline-icon mt-n1"
                      src="/image/mobile_icon.png"
                      alt="help line"
                    />
                    <h1 className="text-primary h6 d-inline-block mt-1 ml-1">
                      <b>{companyInfo.telephone}</b>
                    </h1>
                  </div>
                </div>

                {/* Nav with auth dropdown */}
                <div className="col-9">
                  <div className="float-right">
                    <TopNav viewType="desktop" companyInfo={companyInfo}/>
                  </div>
                </div>
              </div>

              {/* search box and cart in desktop  */}
              <div className="row my-2">
                {/* Search box */}
                <div className="col-10">
                  <div className="search-box-area">
                    <SearchBox />
                  </div>
                </div>

                {/* cart  */}
                <div className="col-2">
                  <CartIcon viewType="desktop" />
                </div>
              </div>
              {/* end of search box and cart in desktop  */}

              {/* main menu categories  */}
              <MainMenuCategory />
            </div>
          </div>
        </div>
      </div>

      {/* mobile  */}
      <div className="d-block d-lg-none sticky-top pt-1 pb-2">
        <div className="container">
          <div className="row align-item-baseline">
            <div className="col-6">
              {/* <a href={companyInfo.website}> */}
              <a href="/">
                <img
                  className="img-fluid"
                  // src="/image/banijjo.com.bd.png"
                  style={{ verticalAlign:"middle" }}
                  // src={`${img_src}/${companyInfo.logo_mob}`}
                  src={`${img_src}/${companyInfo.logo}`}
                  alt={`${companyInfo.name} logo`}
                  title={`${companyInfo.name} logo`}
                />
              </a>
            </div>
            <div className="col-3 offset-3">
              <div className="d-flex flex-row justify-content-end">

                <TopNav viewType="mobile" companyInfo={companyInfo}/>

                {/* <div className="mt-4 ml-4">
                  <CartIcon viewType="mobile" />
                </div> */}

              </div>
            </div>
          </div>

          {/* Search box  */}
          <div className="row">
            <div className="col-12 pt-0">
              <div className="search-box-area">
                <SearchBox />
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </>
  );
};

export default Header;