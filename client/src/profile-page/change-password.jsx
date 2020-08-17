import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  change_customer_password,
  reset_password_error
} from "../redux/customer-profile/customer-actions";

class ChangePassword extends Component {
  state = {
    old_password: "",
    new_password: "",
    retype_password: ""
    // error: this.props.password_error.error
  };

  // componentDidMount() {
  //   set_password_error();
  // }

  onSubmitHandler = e => {
    e.preventDefault();
    const { change_customer_password } = this.props;

    change_customer_password(this.props.current_user.id, this.state);
    this.setState({ old_password: "", new_password: "", retype_password: "" });
  };

  onChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  reset_password_error = () => {
    reset_password_error();
    this.props.history.push("/profile/view-profile");
  };

  render() {
    const { old_password, new_password, retype_password } = this.state;
    const {
      password_error: { error, msg, success },
      reset_password_error
    } = this.props;

    return (
      <Fragment>
        <h3>Change Password</h3>
        <div className="well" style={{ borderRadius: "0" }}>
          <form onSubmit={this.onSubmitHandler}>
            <div className="form-group">
              <label htmlFor="old_password">Old Password</label>
              <input
                type="password"
                id="old_password"
                className="form-control"
                name="old_password"
                value={old_password}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new_password">New Password</label>
              <input
                type="password"
                id="new_password"
                className="form-control"
                name="new_password"
                value={new_password}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="retype_password">Retype Password</label>
              <input
                type="password"
                id="retype_password"
                className="form-control"
                name="retype_password"
                value={retype_password}
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="row">
              {!success ? (
                <Fragment>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                  <div className="col-md-3 pull-right">
                    <Link
                      to="/profile/view-profile"
                      className="btn btn-default"
                      onClick={() => reset_password_error()}
                    >
                      Back
                    </Link>
                  </div>
                </Fragment>
              ) : (
                <div className="col-md-3">
                  <Link
                    to="/profile/view-profile"
                    className="btn btn-default"
                    onClick={() => reset_password_error()}
                  >
                    Back
                  </Link>
                </div>
              )}
            </div>
            {error ? (
              <span className="help-block" style={{ color: "red" }}>
                {`* ${msg}`}
              </span>
            ) : (
              <span className="help-block" style={{ color: "green" }}>
                {`${msg}`}
              </span>
            )}
          </form>
        </div>
      </Fragment>
    );
  }
}

const mapState = state => ({
  current_user: state.customer.profile,
  password_error: state.customer.password_error
});

export default connect(mapState, {
  change_customer_password,
  reset_password_error
})(ChangePassword);
