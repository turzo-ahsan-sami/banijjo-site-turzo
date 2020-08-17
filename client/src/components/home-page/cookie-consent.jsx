import React from "react";
import CookieConsent, { Cookies } from "react-cookie-consent";

const CookieConsentComponent = () => {
  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="CookieConsent"
        expires={365}
        acceptOnScroll={true}
        cookieValue={true}
        cookieSecurity={true}
      >
        {/* <h1 className="h6">Cookies Policy</h1> */}
        <small>
          This website uses cookies to enhance the user experience.
        </small>
      </CookieConsent>
    </>
  );
};

export default CookieConsentComponent;
