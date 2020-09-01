import React, { useState, useEffect } from "react";
import ScrollToTop from "../shared/scroll-to-top";
import axios from "axios";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const file_url = process.env.REACT_APP_FILE_URL;
const img_src = `${file_url}/upload/company`;

const Footer = ({ companyInfo }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = () => {
    axios
      .get(`${base}/api/getTopNavbarCategory`)
      .then((res) => setCategories(res.data.data));
  };

  return (
    <>
      <div className="footer-background-first mt-4" />

      <div className="d-none d-lg-block">
        <footer className="footer-background-second">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <h1 className="h5 mt-2">About Us</h1>
                <ul className="footer-font-size">
                  <li>
                    <a href="/policy/privacy-policy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/policy/cookie-policy">Cookie Policy</a>
                  </li>
                  <li>
                    <a href="/policy/warranty-policy">Warranty Policy</a>
                  </li>
                  <li>
                    <a href="/policy/shipping-policy">Shipping Policy</a>
                  </li>
                  <li>
                    <a href="/policy/terms-and-condition">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="/policy/returns-and-replacement">
                      Returns and Replacement
                    </a>
                  </li>
                  <li>
                    <a href="/faq">FAQ</a>
                  </li>
                  <li>
                    <a href="/contactUs">Contact us</a>
                  </li>
                </ul>
              </div>

              <div className="col-4">
                <h1 className="h5 mt-2">Special Category</h1>
                <ul className="footer-font-size">
                  {categories.length > 0
                    ? categories.map((el) => (
                        <li key={el.id}>
                          <a href={`/productList/${el.slug}`}>
                            {el.category_name}
                          </a>
                        </li>
                      ))
                    : null}
                </ul>
              </div>

              <div className="col-4">
                <h1 className="h5 mt-2">Contact</h1>

                <ul className="footer-font-size">
                  <li>
                    <a href="/contactUs">Contact us</a>
                  </li>
                </ul>

                <div className="row">
                  <div className="col-6">
                    <img
                      // src="image/qr_code_banijjo.png"
                      src={`${img_src}/${companyInfo.qrcode}`}
                      className="img-fluid qr-img"
                      alt="QR Code Banijjo"
                    />
                  </div>
                </div>

                <div className="row mt-3 mb-2">
                  <div className="col-1 facebook-color mr-2">
                    <a
                      href="https://www.facebook.com/banijjo.com.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-facebook-square fa-2x" />
                    </a>
                  </div>

                  <div className="col-1 twitter-color mr-2">
                    <a
                      href="https://twitter.com/banijjo"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-twitter-square fa-2x" />
                    </a>
                  </div>

                  <div className="col-1 linkedin-color mr-2">
                    <a
                      href="https://www.linkedin.com/showcase/banijjo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-linkedin fa-2x" />
                    </a>
                  </div>

                  <div className="col-1 instagram-color mr-2">
                    <a
                      href="https://www.instagram.com/banijjo/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-instagram-square fa-2x" />
                    </a>
                  </div>

                  <div className="col-1 youtube-color mr-2">
                    <a
                      href="https://www.youtube.com/banijjomela"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-youtube-square fa-2x" />
                    </a>
                  </div>

                  <div className="col-1 pinterest-color mr-2">
                    <a
                      href="https://www.pinterest.com/banijjo/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-pinterest-square fa-2x" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <div className="d-block d-lg-none">
        <footer className="footer-background-second">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1 className="h5 mt-2">About us</h1>
                <ul className="footer-font-size">
                  <li>
                    <a href="/policy/privacy-policy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/policy/cookie-policy">Cookie Policy</a>
                  </li>
                  <li>
                    <a href="/policy/warranty-policy">Warranty Policy</a>
                  </li>
                  <li>
                    <a href="/policy/shipping-policy">Shipping Policy</a>
                  </li>
                  <li>
                    <a href="/policy/terms-and-condition">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="/policy/returns-and-replacement">
                      Returns and Replacement
                    </a>
                  </li>
                  <li>
                    <a href="/faq">FAQ</a>
                  </li>
                  <li>
                    <a href="/contactUs">Contact Us</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <div className="footer-background-social mb-2">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-sm-12 mt-1 pt-md-1">
              <div className="row">
                <h1 className="h5 ml-3">Payment Partner</h1>
              </div>
              <div className="row justify-content-between align-items-center">
                <img
                  className="img-fluid"
                  src="/image/associate/SSL_Commerz_pay_with_logo.png"
                  alt="SSL-Commerz-Pay-With-logo"
                  title="SSL-Commerz-Pay-With-logo"
                />
              </div>
            </div>
            <div className="col-md-4 col-sm-12 mt-1 pt-md-1">
              <div className="row">
                <h1 className="h5 ml-3">Associate/Partners</h1>
              </div>
              <div className="row justify-content-between align-items-center mt-md-4 pt-md-1">
                <div className="col-3">
                  <a href="#" rel="noopener noreferrer">
                    <img
                      className="img-fluid"
                      src="/image/associate/eCAB_Logo.png"
                      alt="eCAB"
                      title="eCAB"
                    />
                  </a>
                </div>

                <div className="col-3">
                  <a href="#" rel="noopener noreferrer">
                    <img
                      className="img-fluid"
                      src="/image/associate/ekshop_logo.png"
                      alt="ekshop"
                      title="ekshop"
                    />
                  </a>
                </div>

                <div className="col-3">
                  <a href="#" rel="noopener noreferrer">
                    <img
                      className="img-fluid"
                      src="/image/associate/ecourier_logo.png"
                      alt="ecourier"
                      title="ecourier"
                    />
                  </a>
                </div>

                <div className="col-3">
                  <a href="#" rel="noopener noreferrer">
                    <img
                      className="img-fluid"
                      src="/image/associate/ITC_SheTrades_logo.png"
                      alt="ITC_SheTrades"
                      title="ITC_SheTrades"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-background-last">
        <div className="container">
          <div className="row py-3">
            {companyInfo && (
              <div className="col-lg-6 col-md-12">
                &copy; 2020-2029{" "}
                <a href="https://banijjo.com" className="banijjo-link">
                  <span>banijjo.com</span>
                </a>
                &nbsp; All rights reserved.
              </div>
            )}

            <div className="col-lg-4 offset-lg-2 col-md-12 mt-lg-0 mt-md-1">
              <span> Designed and Developed By</span>{" "}
              <a
                href="http://www.ambalait.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="d-inline-block mt-n2"
                  src="/image/ambala_it.png"
                  alt="ambala_it"
                  title="ambala_it"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </>
  );
};

export default Footer;
