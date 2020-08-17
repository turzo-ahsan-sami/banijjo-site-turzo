import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

const Policy = (props) => {

  const [policy, setPolicy] = useState({})

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getPolicy()
  }, [])

  const getPolicy = () => {

    let policySlug = "";
    if(props.match.params.policytype === "privacy-policy") policySlug = "privacy-policy-2";
    if(props.match.params.policytype === "cookie-policy") policySlug = "cookie-policy-3";
    if(props.match.params.policytype === "warranty-policy") policySlug = "warranty-policy-4";
    if(props.match.params.policytype === "shipping-policy") policySlug = "shipping-policy-5";
    if(props.match.params.policytype === "terms-and-condition") policySlug = "terms-and-condition-1";
    if(props.match.params.policytype === "returns-and-replacement") policySlug = "returns-and-replacement-6";

    axios
      .get(`${base}/api/policy/${policySlug}`)
      .then(res => setPolicy(res.data));
  }


  return (
    <>

      <Helmet>
        <title>{policy.name}</title>
        <meta name="Description" content="page containing policy" />
      </Helmet>

      {policy &&
        <div className="container">
          <div className="row">
            <div className="col-12">

              <h1 className="h3 font-weight-bold text-left mt-3">
                {policy.name}
              </h1>

              <p className="text-justify mt-3">
                {policy.terms_and_conditions}
              </p>

            </div>
          </div>
        </div>
      }

    </>
  );
}

export default Policy;
