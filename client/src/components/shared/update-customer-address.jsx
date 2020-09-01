import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { base } from "../../utils/common-helpers";

import { IsNullOrEmpty } from "../../utils/utils";

const UpdateCustomerAddress = () => {
  const history = useHistory();

  const [customerId, set_customerId] = useState(localStorage.customer_id);

  const [hasCustomerAddress, set_hasCustomerAddress] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
  });

  const [name, set_name] = useState("");
  const [phone_number, set_phone_number] = useState("");
  const [email, set_email] = useState("");
  const [address, set_address] = useState("");
  const [zipcode, set_zipcode] = useState("");

  const [city_id, set_city_id] = useState("");
  const [district_id, set_district_id] = useState("");
  const [area_id, set_area_id] = useState("");

  const [cityList, set_cityList] = useState([]);
  const [customerCity, set_customerCity] = useState("");

  const [thanaList, set_thanaList] = useState([]);
  const [customerThana, set_customerThana] = useState("");

  const [areaList, set_areaList] = useState([]);
  const [customerArea, set_customerArea] = useState("");

  const [districtList, set_districtList] = useState([]);
  const [customerDistrict, set_customerDistrict] = useState("");

  const [customerPostCode, set_customerPostCode] = useState("");

  const [alert_text, set_alert_text] = useState(
    "Could not complete purchase. Please try again later."
  );

  useEffect(() => {
    getCustomerInfo();
    getCityList();
  }, []);

  const getCustomerInfo = () => {
    const customerId = localStorage.customer_id ? localStorage.customer_id : 0;
    if (customerId) {
      axios.get(`${base}/api/get_customer_info/${customerId}`).then((res) => {
        const {
          name,
          email,
          address,
          phone_number,
          city,
          thana,
          area,
          district,
          zipcode,
        } = res.data;
        setCustomerInfo({
          customerName: name ? name : "",
          customerAddress: address ? address : "",
          customerPhone: phone_number ? phone_number : "",
        });
        set_name(name);
        set_email(email);
        set_address(address);
        set_phone_number(phone_number);
        set_customerCity(city);
        set_customerThana(thana);
        set_customerArea(area);
        set_customerDistrict(district);
        set_customerPostCode(zipcode);
        set_hasCustomerAddress(true);
      });
    }
  };

  const getCityList = () => {
    axios.get(`${base}/api/getCityList`).then((res) => {
      set_cityList(res.data);
      set_districtList(res.data);
    });
  };

  const handle_change_district = (e) => {
    if (!e.target.value) {
      set_customerDistrict("");
      return;
    }
    set_customerDistrict(e.target.value);
  };

  const handle_change_city = (e) => {
    if (!e.target.value) {
      set_thanaList([]);
      set_areaList([]);
      set_customerCity("");
      set_customerThana("");
      set_customerArea("");
      set_customerPostCode("");
      return;
    }
    set_customerCity(e.target.value);
    set_customerDistrict(e.target.value);
    axios.get(`${base}/api/getThanaList/${e.target.value}`).then((res) => {
      set_thanaList(res.data);
    });
  };

  const handle_change_thana = (e) => {
    if (!e.target.value) {
      set_areaList([]);
      set_customerThana("");
      set_customerArea("");
      set_customerPostCode("");
      return;
    }
    set_customerThana(e.target.value);
    axios.get(`${base}/api/getAreaList/${e.target.value}`).then((res) => {
      set_areaList(res.data);
    });
  };

  const handle_change_area = (e) => {
    if (!e.target.value) {
      set_customerArea("");
      set_customerPostCode("");
      return;
    }
    set_customerArea(e.target.value);
    axios.get(`${base}/api/getPostCode/${e.target.value}`).then((res) => {
      set_customerPostCode(res.data[0].postcode);
      console.log(res.data);
    });
  };

  const addressSubmit = (event) => {
    event.preventDefault();

    if (IsNullOrEmpty(name)) {
      showAddressAlertModal();
      set_alert_text("Name can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(address)) {
      showAddressAlertModal();
      set_alert_text("Address can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(phone_number)) {
      showAddressAlertModal();
      set_alert_text("Phone number can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(email)) {
      showAddressAlertModal();
      set_alert_text("Email can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(customerCity)) {
      showAddressAlertModal();
      set_alert_text("City can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(customerThana)) {
      showAddressAlertModal();
      set_alert_text("Thana can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(customerArea)) {
      showAddressAlertModal();
      set_alert_text("Area can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(customerDistrict)) {
      showAddressAlertModal();
      set_alert_text("District can not be empty !!");
      return;
    }
    if (IsNullOrEmpty(customerPostCode)) {
      showAddressAlertModal();
      set_alert_text("Postcode can not be empty !!");
      return;
    }

    console.log("check failed...");

    fetch(base + "/api/saveCustomerAddress", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
        name,
        address,
        phone_number,
        email,
        customerCity,
        customerThana,
        customerArea,
        customerDistrict,
        customerPostCode,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (!response.error) {
          scrollToTop();
          getCustomerInfo();
          showAddressAlertModal();
          set_alert_text("Address Updated Successfully !!");
        }
      });
  };

  const handle_change_name = (e) => {
    set_name(e.target.value);
  };

  const handle_change_phone_number = (e) => {
    set_phone_number(e.target.value);
  };

  const handle_change_email = (e) => {
    set_email(e.target.value);
  };

  const handle_change_address = (e) => {
    set_address(e.target.value);
  };

  const showAddressAlertModal = () => {
    var link = document.getElementById("adressAlertModalButton");
    link.click();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="checkout-form">
        <form action="#">
          <div className="checkout-input mb-3">
            <p className="mb-3">
              Name<span>*</span>
            </p>
            <input
              type="text"
              onChange={(e) => handle_change_name(e)}
              value={name}
              className="checkout-input-add mb-3"
            />
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="checkout-input mb-3">
                <p className="mb-3">
                  Phone<span>*</span>
                </p>
                <input
                  type="text"
                  onChange={(e) => handle_change_phone_number(e)}
                  value={phone_number}
                  className="checkout-input-add"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="checkout-input">
                <p className="mb-3">
                  Email<span>*</span>
                </p>
                <input
                  type="text"
                  onChange={(e) => handle_change_email(e)}
                  value={email}
                  className="checkout-input-add"
                />
              </div>
            </div>
          </div>

          <div className="checkout-input mb-3">
            <p className="mb-3">
              Address<span>*</span>
            </p>
            <input
              type="text"
              onChange={(e) => handle_change_address(e)}
              value={address}
              className="checkout-input-add"
            />
          </div>

          <div className="row">
            <div className="col-lg-4">
              <div className="checkout-input mb-3">
                <p className="mb-3">
                  City<span>*</span>
                </p>
                <select
                  className="form-control"
                  name="city"
                  onChange={(e) => handle_change_city(e)}
                  value={customerCity}
                >
                  <option value="">Select City</option>
                  {cityList.length > 0 &&
                    cityList.map((item) => (
                      <option value={item.district} key={item.district}>
                        {item.district}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="checkout-input mb-3">
                <p className="mb-3">
                  Thana<span>*</span>
                </p>
                <select
                  className="form-control"
                  name="thana"
                  onChange={(e) => handle_change_thana(e)}
                  value={customerThana}
                >
                  <option value="">Select Thana</option>
                  {thanaList.length > 0 &&
                    thanaList.map((item) => (
                      <option value={item.thana} key={item.thana}>
                        {item.thana}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="checkout-input mb-3">
                <p className="mb-3">
                  Area<span>*</span>
                </p>

                <select
                  className="form-control"
                  name="area"
                  onChange={(e) => handle_change_area(e)}
                  value={customerArea}
                >
                  <option value="">Select Area</option>
                  {areaList.length > 0 &&
                    areaList.map((item) => (
                      <option value={item.postoffice} key={item.postoffice}>
                        {item.postoffice}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="checkout-input mb-3">
                <p className="mb-3">
                  District<span>*</span>
                </p>
                <select
                  className="form-control"
                  name="district"
                  onChange={(e) => handle_change_district(e)}
                  value={customerDistrict}
                >
                  <option value="">Select District</option>
                  {districtList.length > 0 &&
                    districtList.map((item) => (
                      <option value={item.district} key={item.district}>
                        {item.district}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="checkout-input mb-3">
                <p className="mb-3">
                  Postcode / ZIP<span>*</span>
                </p>
                <input
                  type="text"
                  value={customerPostCode}
                  className="checkout-input-add"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="checkout-input mb-3">
            <button
              className="btn btn-primary"
              onClick={(e) => addressSubmit(e)}
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Address Alert Modal  */}
      <button
        style={{ display: "none !important" }}
        id="adressAlertModalButton"
        className="d-none"
        type="button"
        data-toggle="modal"
        data-target="#adressAlertModal"
      ></button>

      <div
        className="modal fade"
        id="adressAlertModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="adressAlertModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            {alert_text == "Address Updated Successfully !!" ? (
              <div className="modal-body cart-modal-body-warning">
                <p className="pt-4">
                  <i className="fa fa-check font-80" />
                </p>
                <p className="pt-2 pb-2">{alert_text}</p>
              </div>
            ) : (
              <div className="modal-body cart-modal-body-success">
                <p className="pt-4">
                  <i className="fa fa-exclamation-circle font-80" />
                </p>
                <p className="pt-2 pb-2 font-weight-bold text-danger">
                  {alert_text}
                </p>
              </div>
            )}

            <div className="modal-footer cart-modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/profile/view-profile";
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End of Address Alert Modal  */}
    </>
  );
};

export default UpdateCustomerAddress;
