import React, { Fragment, useEffect, useState } from "react";
import { isEmpty, trim } from "lodash";

import axios from "axios";

const fileUrl = process.env.REACT_APP_FILE_URL;
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

const Advertisement = () => {
  const [advertImg, setAdvertImg] = useState({});

  useEffect(() => {
    axios
      .get(`${base}/api/get_advertisement`)
      .then(res => setAdvertImg(res.data.data));
  }, []);

  return (
    <Fragment>
      <div
        className="modal"
        id="image-gallery"
        tabIndex="-1"
        role="dialog"
        aria-hidden="false"
        style={{ backgroundColor: "rgba(0, 0, 0, .9)" }}
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            style={{ backgroundColor: "transparent" }}
          >
            <div
              className="modal-body"
              style={{
                padding: "0px"
              }}
            >
              <button
                type="button"
                className="close campaign-modal-close-btn"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i
                  className="fa fa-times-circle"
                  style={{
                    fontSize: "24px",
                    color: "#ffffff"
                  }}
                >
                  {""}
                </i>
              </button>
              {advertImg.hasOwnProperty("image") &&
                !isEmpty(trim(advertImg.image)) && (
                  <img
                    className="img-responsive"
                    src={`${fileUrl}/upload/product/compressedProductImages/${advertImg.image}`}
                    alt={advertImg.name}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

      <div id="boxes">
        <div id="dialog" className="window">
          <div className="frameAdsBig">
            <span className="helperAdsBig">
              {advertImg.hasOwnProperty("image") &&
                !isEmpty(trim(advertImg.image)) && (
                  <img
                    className="img-responsive"
                    src={`${fileUrl}/upload/product/compressedProductImages/${advertImg.image}`}
                    alt={advertImg.name}
                  />
                )}
            </span>
          </div>

          <div id="popupfoot">
            <button
              type="button"
              style={{ color: "#ffffff", marginBottom: "8px" }}
              className="btn-sm closeButton agree"
            >
              <i
                className="fa fa-remove"
                style={{
                  fontSize: "30px",
                  color: "#EC1624",
                  marginTop: "5px",
                  marginLeft: "-4px"
                }}
              >
                {""}
              </i>
            </button>
          </div>
        </div>
        <div id="mask">{""}</div>
      </div>
    </Fragment>
  );
};

export default Advertisement;
