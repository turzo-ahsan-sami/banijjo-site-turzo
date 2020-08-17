import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { customer_reducer } from "./customer-profile/customer-reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["customer"]
};

const root_reducer = combineReducers({
  customer: customer_reducer
});

// export default root_reducer;

export default persistReducer(persistConfig, root_reducer);
