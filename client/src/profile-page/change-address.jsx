import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Autosuggest from "react-autosuggest";

import { change_customer_address } from "../redux/customer-profile/customer-actions";

import "./react-autosuggest.css";
import "./change-address.css";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestions(states, value) {
  if (states.length !== 0) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    return states.filter(el => regex.test(el.name));
  } else {
    return [];
  }
}

function getSuggestionDistrict(suggestion) {
  return suggestion.name;
}

function getSuggestionCity(suggestion) {
  return suggestion.name;
}

function getSuggestionArea(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.name}</span>;
}

const mapState = state => ({
  current_user: state.customer.profile
});

function getCitySuggestions(states, value) {
  if (states.length !== 0) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    return states.filter(el => regex.test(el.name));
  } else {
    return [];
  }
}

class ChangeAddress extends Component {
  state = {
    address:
      this.props.current_user.address === null
        ? ""
        : this.props.current_user.address,
    district_id: "",
    city_id: "",
    area_id: "",
    phone_number:
      this.props.current_user.phone_number === null
        ? ""
        : this.props.current_user.phone_number,
    district_arr: [],
    city_arr: [],
    area_arr: [],
    district_value: "",
    district_suggestions: [],
    city_value: "",
    city_suggestions: [],
    area_value: "",
    area_suggestions: []
  };

  componentDidMount() {
    axios
      .get(`${base}/api/get_districts`)
      .then(res => this.setState({ district_arr: res.data }));
  }

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = e => {
    e.preventDefault();
    const { address, phone_number, city_id, district_id, area_id } = this.state;
    this.props.change_customer_address(this.props.current_user.id, {
      address,
      phone_number,
      city_id,
      district_id,
      area_id
    });
    this.setState({
      address: "",
      city_value: "",
      district_value: "",
      area_value: "",
      phone_number: ""
    });
    this.props.history.push("/profile/view-profile");
  };

  onDistrictChange = (event, { newValue }) => {
    this.setState({
      district_value: newValue
    });
  };

  onDistrictSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      district_suggestions: getSuggestions(this.state.district_arr, value)
    });
  };

  onDistrictSuggestionsClearRequested = () => {
    this.setState({
      district_suggestions: []
    });
  };

  onDistrictSuggestionSelected = (event, { suggestion }) => {
    axios
      .get(`${base}/api/get_cities_by_district_id/${suggestion.id}`)
      .then(res =>
        this.setState({ city_arr: res.data, district_id: suggestion.id })
      );
  };

  onCityChange = (event, { newValue }) => {
    this.setState({
      city_value: newValue
    });
  };

  onCitySuggestionsFetchRequested = ({ value }) => {
    this.setState({
      city_suggestions: getSuggestions(this.state.city_arr, value)
    });
  };

  onCitySuggestionsClearRequested = () => {
    this.setState({
      city_suggestions: []
    });
  };

  onCitySuggestionSelected = (event, { suggestion }) => {
    axios
      .get(`${base}/api/get_areas_by_city_id/${suggestion.id}`)
      .then(res =>
        this.setState({ area_arr: res.data, city_id: suggestion.id })
      );
  };

  onAreaChange = (event, { newValue }) => {
    this.setState({
      area_value: newValue
    });
  };

  onAreaSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      area_suggestions: getSuggestions(this.state.area_arr, value)
    });
  };

  onAreaSuggestionsClearRequested = () => {
    this.setState({
      area_suggestions: []
    });
  };

  onAreaSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      area_id: suggestion.id
    });
  };

  render() {
    const {
      address,
      phone_number,
      district_value,
      district_suggestions,
      city_value,
      city_suggestions,
      area_value,
      area_suggestions
    } = this.state;

    const districtInputProps = {
      placeholder: "District",
      value: district_value,
      onChange: this.onDistrictChange,
      className: "form-control"
    };

    const cityInputProps = {
      placeholder: "Enter City Name",
      value: city_value,
      onChange: this.onCityChange,
      className: "form-control"
    };

    const areaInputProps = {
      placeholder: "Enter Area Name",
      value: area_value,
      onChange: this.onAreaChange,
      className: "form-control"
    };

    return (
      <Fragment>
        <h3>Change Address</h3>
        <div className="well" style={{ borderRadius: "0" }}>
          <form onSubmit={this.onSubmitHandler} autoComplete="chrome-off">
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="input"
                id="phone_number"
                className="form-control"
                name="phone_number"
                value={phone_number}
                onChange={this.onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                className="form-control"
                rows="3"
                name="address"
                value={address}
                onChange={this.onChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="district">District</label>
              <Autosuggest
                suggestions={district_suggestions}
                onSuggestionsFetchRequested={
                  this.onDistrictSuggestionsFetchRequested
                }
                onSuggestionsClearRequested={
                  this.onDistrictSuggestionsClearRequested
                }
                onSuggestionSelected={this.onDistrictSuggestionSelected}
                getSuggestionValue={getSuggestionDistrict}
                renderSuggestion={renderSuggestion}
                inputProps={districtInputProps}
              />
            </div>

            <div className="form-group">
              <label htmlFor="district">City</label>
              <Autosuggest
                suggestions={city_suggestions}
                onSuggestionsFetchRequested={
                  this.onCitySuggestionsFetchRequested
                }
                onSuggestionsClearRequested={
                  this.onCitySuggestionsClearRequested
                }
                onSuggestionSelected={this.onCitySuggestionSelected}
                getSuggestionValue={getSuggestionCity}
                renderSuggestion={renderSuggestion}
                inputProps={cityInputProps}
              />
            </div>

            <div className="form-group">
              <label htmlFor="district">Area</label>
              <Autosuggest
                suggestions={area_suggestions}
                onSuggestionsFetchRequested={
                  this.onAreaSuggestionsFetchRequested
                }
                onSuggestionsClearRequested={
                  this.onAreaSuggestionsClearRequested
                }
                onSuggestionSelected={this.onAreaSuggestionSelected}
                getSuggestionValue={getSuggestionArea}
                renderSuggestion={renderSuggestion}
                inputProps={areaInputProps}
              />
            </div>

            <div className="row">
              <div className="col-md-3">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <div className="col-md-3 pull-right">
                <Link to="/profile/view-profile" className="btn btn-default">
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapState, { change_customer_address })(ChangeAddress);
