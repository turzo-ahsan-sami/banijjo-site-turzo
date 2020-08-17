import {
  CHANGE_CUSTOMER_ADDRESS,
  CHANGE_CUSTOMER_PASSWORD,
  GET_CUSTOMER_INFO,
  GET_ORDER_HISTORY,
  RESET_PASSWORD_ERROR,
  UPLOAD_CUSTOMER_PHOTO
} from "./customer-action-types";

const initial_state = {
  profile: {
    id: "",
    name: "",
    email: "",
    address: "",
    profile_pic: "",
    phone_number: "",
    district_id: "",
    city_id: "",
    area_id: "",
    district_name: "",
    city_name: "",
    area_name: ""
  },
  order_history: [],
  password_error: {
    error: false,
    success: false,
    msg: ""
  }
};

export const customer_reducer = (state = initial_state, { type, payload }) => {
  switch (type) {
    case GET_CUSTOMER_INFO:
      return { ...state, profile: { ...payload } };
    case GET_ORDER_HISTORY:
      return { ...state, order_history: payload };
    case CHANGE_CUSTOMER_ADDRESS:
      return { ...state, profile: { ...payload } };
    case CHANGE_CUSTOMER_PASSWORD:
      return { ...state, password_error: { ...payload } };
    case RESET_PASSWORD_ERROR:
      return { ...state, password_error: { ...payload } };
    case UPLOAD_CUSTOMER_PHOTO:
      return { ...state, profile: { ...state.profile, profile_pic: payload } };
    default:
      return state;
  }
};
