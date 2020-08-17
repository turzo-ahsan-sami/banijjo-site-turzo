import React from "react";
import { Helmet } from "react-helmet";

const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;

const NotFoundPage = () => {
  return (
    <div>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,700,900"
          rel="stylesheet"
        />
      </Helmet>
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">{/*<h1>Oops!</h1>*/}</div>
          <h2>404 - Page not found</h2>
          <p>
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>
          <a href={frontEndUrl}>Go To Homepage</a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
