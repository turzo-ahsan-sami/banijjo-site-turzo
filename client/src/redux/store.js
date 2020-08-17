import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore } from "redux-persist";

import root_reducer from "./root-reducer";

const middlewares = [logger, thunk];

export const store = createStore(
  root_reducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export const persistor = persistStore(store);
