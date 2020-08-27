import React, { Fragment } from "react";
import axios from "axios";
import LoginWithFacebook from "./login-with-facebook";
import LoginWithGoogle from "./login-with-google";
import { withRouter } from "react-router-dom";

const options = {
  headers: { "Content-Type": "application/json" }
};

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

const SocialLogin = ({ setAuthentication, history }) => {
  const handleSocialData = ({ name, email, id }) => {
    const userData = { name, email, id };
    axios.post(`${base}/api/socialLogin`, userData, options).then(res => {
      setAuthentication(true);
      localStorage.setItem("customer_id", res.data.customer_id);
      history.push("/");
      window.location.reload(false);
    });
  };

  return (
    <Fragment>
      <LoginWithFacebook submittedData={handleSocialData} />
      <LoginWithGoogle submittedData={handleSocialData} />
    </Fragment>
  );
};

export default withRouter(SocialLogin);
