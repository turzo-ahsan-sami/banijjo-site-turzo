import React from "react";
import { fileUrl } from "./../../utils/common-helpers";

const OverviewReviewSpecification = ({product_full_description, product_specification_details_description}) => {

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

  let counter = 1;
  
  return (
    <>
      {/* OVERVIEW, CUSTOMER REVIEWS, SPECIFICATIONS */}
      <div className="row">
        <div className="col-12">
          <div className="sap_tabs mt-4">
            <div id="horizontalTab1">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <a
                    className="d-inline-block resp-tab-item px-3  py-1 m-1"
                    id="nav-home-tab"
                    data-toggle="tab"
                    href="#nav-home"
                    role="tab"
                    aria-controls="nav-home"
                    aria-selected="true"
                  >
                    OVERVIEW
                  </a>
                  {/* <a
                          className="d-inline-block resp-tab-item px-3 py-1 m-1"
                          id="nav-profile-tab"
                          data-toggle="tab"
                          href="#nav-profile"
                          role="tab"
                          aria-controls="nav-profile"
                          aria-selected="false"
                        >
                          CUSTOMER REVIEWS
                        </a> */}
                  <a
                    className="d-inline-block resp-tab-item px-3 py-1 m-1"
                    id="nav-contact-tab"
                    data-toggle="tab"
                    href="#nav-contact"
                    role="tab"
                    aria-controls="nav-contact"
                    aria-selected="false"
                  >
                    SPECIFICATIONS
                  </a>
                </div>
              </nav>

              <div className="tab-content pl-1" id="nav-tabContent">
                {/* // Overview    */}
                <div
                  className="tab-pane resp-tab-content additional_info_grid p-4 fade show active"
                  id="nav-home"
                  role="tabpanel"
                  aria-labelledby="nav-home-tab"
                >
                  {productDescriptions()}
                </div>

                {/* Review  */}
                {/* <div
                        className="tab-pane resp-tab-content additional_info_grid p-4 fade"
                        id="nav-profile"
                        role="tabpanel"
                        aria-labelledby="nav-profile-tab"
                      >
                        {""}
                      </div> */}

                {/* Specifications  */}
                <div
                  className="tab-pane resp-tab-content additional_info_grid p-4 fade"
                  id="nav-contact"
                  role="tabpanel"
                  aria-labelledby="nav-contact-tab"
                >
                  <div className="row">
                    <div className="col-md-6">
                      {product_specification_details_description
                        ? product_specification_details_description.forEach(
                            (item, key) => {
                              if (counter === 1) {
                                if ((key + 1) % 8 === 0) {
                                  counter = key;
                                  return false;
                                } else {
                                  return (
                                    <li>
                                      {item.specificationDetailsName}:{" "}
                                      {item.specificationDetailsValue}
                                    </li>
                                  );
                                }
                              }
                            }
                          )
                        : ""}
                    </div>

                    <div className="col-md-6">
                      {counter > 1
                        ? product_specification_details_description.map(
                            (item, key) => {
                              if (key >= counter) {
                                return (
                                  <li>
                                    {counter}
                                    {item.specificationDetailsName}:{" "}
                                    {item.specificationDetailsValue}
                                  </li>
                                );
                              }
                              return "";
                            }
                          )
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* END OF  OVERVIEW, CUSTOMER REVIEWS, SPECIFICATIONS */}
    </>
  );
};

export default OverviewReviewSpecification;
