// 372727999602-9pmrm8dik0ivtbokkh76rprc11iaenr1.apps.googleusercontent.com

import React from "react";
import GoogleLogin from "react-google-login";
import "./social-login.css";

const LoginWithGoogle = ({ submittedData }) => {
  const responseGoogle = (response) => {
    const { name, email, googleId } = response.profileObj;
    submittedData({ name, email, id: googleId });
  };

  return (
    <GoogleLogin
      // clientId="372727999602-vdp9vopdupngd3erqk0ho9le97q3narb.apps.googleusercontent.com"
      clientId="347434048473-o9s430qumgukn4fb6c60tdv4ius9sfoh.apps.googleusercontent.com"
      render={(renderProps) => (
        <button
          className="loginBtn loginBtn--google"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          Sign in with <b>Google</b>
        </button>
      )}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
    />
  );
};

export default LoginWithGoogle;
