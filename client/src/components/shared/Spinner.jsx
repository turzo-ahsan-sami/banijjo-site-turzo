import React from "react";
import { MoonLoader } from "react-spinners";
import { css } from "@emotion/core";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Spinner = () => {
  return (
    <div className="sweet-loading">
      <MoonLoader css={override} size={50} color={"#009345"} loading={true} />
    </div>
  );
};

export default Spinner;
