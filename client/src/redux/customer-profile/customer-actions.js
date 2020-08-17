import axios from "axios";
import {
  CHANGE_CUSTOMER_ADDRESS,
  CHANGE_CUSTOMER_PASSWORD,
  GET_CUSTOMER_INFO,
  GET_ORDER_HISTORY,
  RESET_PASSWORD_ERROR,
  UPLOAD_CUSTOMER_PHOTO
} from "./customer-action-types";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

const config = {
  headers: {
    "Content-Type": "application/json"
  }
};

export const get_customer_info = customer_id => async dispatch => {
  try {
    const res = await axios.get(`${base}/api/get_customer_info/${customer_id}`);
    dispatch({ type: GET_CUSTOMER_INFO, payload: res.data });
  } catch (e) {
    dispatch({ type: "ERROR" });
  }
};

export const get_order_history = customer_id => async dispatch => {
  try {
    const res = await axios.get(`${base}/api/get_order_history/${customer_id}`);
    dispatch({ type: GET_ORDER_HISTORY, payload: res.data });
  } catch (e) {
    dispatch({ type: "ERROR" });
  }
};

export const change_customer_address = (
  customer_id,
  form_data
) => async dispatch => {
  try {
    await axios.post(
      `${base}/api/change_customer_address`,
      { customer_id, form_data },
      config
    );

    const res = await axios.get(`${base}/api/get_customer_info/${customer_id}`);

    dispatch({ type: CHANGE_CUSTOMER_ADDRESS, payload: res.data });
  } catch (e) {
    dispatch({ type: "ERROR" });
  }
};

export const change_customer_password = (
  customer_id,
  form_data
) => async dispatch => {
  try {
    const res = await axios.post(
      `${base}/api/change_customer_password`,
      { customer_id, form_data },
      config
    );
    if (res.data.error) {
      dispatch({
        type: CHANGE_CUSTOMER_PASSWORD,
        payload: { ...res.data, success: false }
      });
    } else {
      dispatch({
        type: CHANGE_CUSTOMER_PASSWORD,
        payload: { ...res.data, success: true }
      });
    }
  } catch (e) {
    dispatch({ type: "ERROR" });
  }
};

export const reset_password_error = () => dispatch =>
  dispatch({
    type: RESET_PASSWORD_ERROR,
    payload: { error: false, success: false, msg: "" }
  });

export const upload_customer_photo = profile_pic => dispatch => {
  dispatch({ type: UPLOAD_CUSTOMER_PHOTO, payload: profile_pic });
};
