import React, { Component } from "react";
import "./registration-form.css";
import { Link } from "react-router-dom";
import axios from "axios";
import LoginWithFacebook from "./social-login/login-with-facebook";
import LoginWithGoogle from "./social-login/login-with-google";
import SocialLogin from "./social-login/social-login";

const options = {
  headers: { "Content-Type": "application/json" }
};

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class Registration extends Component {
  state = {
    email: "",
    password: "",
    email_error: false
  };

  onFormSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post(`${base}/api/saveCustomerInitial`, userData, options)
      .then(res => {
        if (res.data.error) {
          this.setState({ email_error: true, password: "" });
        } else if (!res.data.error) {
          this.setState({ email_error: false });
          localStorage.setItem("customer_id", res.data.data);
          this.props.setAuthentication(true);
          this.props.history.push("/");
        }
      })
      .catch(e => this.setState({ error: true }));
  };

  /*handleSocialData = ({ name, email, id }) => {
    const userData = { name, email };
    axios.post(`${base}/api/socialLogin`, userData, options).then(res => {
      this.props.setAuthentication(true);
      localStorage.setItem("customer_id", res.data.customer_id);
      this.props.history.push("/");
    });
  };*/

  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { email, password, email_error } = this.state;
    const { setAuthentication } = this.props;
    return (
      <div className="login-form">
        <div className="login-form-div">
          <form onSubmit={this.onFormSubmit}>
            <h2 className="text-center">Sign Up</h2>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-user" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  onChange={this.onChangeHandler}
                  value={email}
                  placeholder="Email"
                  required="required"
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="fa fa-lock" />
                </span>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  onChange={this.onChangeHandler}
                  value={password}
                  placeholder="Password"
                  required="required"
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-block login-btn"
              >
                Sign up
              </button>
            </div>

            {email_error && (
              <div className="has-error">
                <p className="help-block text-center text-danger">
                  Email Already Exists! Use Another One.
                </p>
              </div>
            )}

            <div className="clearfix" />

            <div className="or-seperator">
              <i>or</i>
            </div>
          </form>
          {/*Social login*/}
          <div className="text-center social-btn">
            <SocialLogin setAuthentication={setAuthentication} />
          </div>
        </div>
        <div className="hint-text">
          Already have an account?{" "}
          <Link to="/login" className="text-success">
            Login Now!
          </Link>
        </div>
      </div>
    );
  }
}

export default Registration;
