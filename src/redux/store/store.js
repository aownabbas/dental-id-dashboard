import { applyMiddleware, combineReducers, createStore } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import authReducer from "../reducers/authReducer";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";
import profileSettingsReducer from "../reducers/profileSettingsReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  settings_data:profileSettingsReducer,
});
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(Store);
