import React from "react";
import SweetAlert from "sweetalert2-react";

const ShowAlert = ({show_alert, alert_text}) => {
  return (
    <SweetAlert
        show={show_alert}
        title="Warning!"
        type= "warning"
        text={alert_text}
        onConfirm={() => { show_alert = false }}
    />
  );
};

export default ShowAlert;
