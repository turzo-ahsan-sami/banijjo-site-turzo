import React, { Component } from "react";
import "./registration-form.css";
import { Link } from "react-router-dom";
import axios from "axios";
import LoginWithGoogle from "./social-login/login-with-google";
import LoginWithFacebook from "./social-login/login-with-facebook";
import SocialLogin from "./social-login/social-login";

const options = {
  headers: { "Content-Type": "application/json" }
};

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: false
  };

  onFormSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post(`${base}/api/loginCustomerInitial`, userData, options)
      .then(res => {
        if (!res.data.error) {
          localStorage.setItem("customer_id", res.data.data);
          this.props.setAuthentication(true);
          this.props.history.push("/");
        }
      })
      .catch(e => this.setState({ error: true }));
  };

  /*handleSocialData = ({ name, email, id }) => {
    const userData = { name, email, id };
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
    const { email, password, error } = this.state;
    const { setAuthentication } = this.props;

    return (
      <div className="login-form">
        <div className="login-form-div">
          <form onSubmit={this.onFormSubmit}>
            <h2 className="text-center">Sign in</h2>
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
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-block login-btn"
              >
                Sign in
              </button>
            </div>
            <div className="clearfix">
              <a href="#!" className="pull-right text-success disabled">
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="has-error">
                <p className="help-block text-center text-danger">
                  Email or Password is not valid! Try Again.
                </p>
              </div>
            )}

            <div className="or-seperator">
              <i>or</i>
            </div>

            {/*Social login*/}
          </form>

          <div className="text-center social-btn">
            <SocialLogin setAuthentication={setAuthentication} />
          </div>
        </div>
        <div className="hint-text">
          Don't have an account?{" "}
          <Link to="/register" className="text-success">
            Register Now!
          </Link>
        </div>
      </div>
    );
  }
}

export default Login;

{
  /*<a href="#" className="btn btn-info btn-block">
              <i className="fa fa-twitter"></i> Sign in with <b>Twitter</b>
            </a>*/
}
