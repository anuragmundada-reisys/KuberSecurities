import { combineReducers } from "redux";
import LocalSalesReducer from "./LocalSalesReducer";
import AuthReducer from "./AuthReducer";

export default combineReducers({
    localSales: LocalSalesReducer,
    auth: AuthReducer,
});