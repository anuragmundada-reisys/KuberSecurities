import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT, RESET_PASSWORD,
} from "../constant/ActionType";
const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
    ? { isLoggedIn: true, isResetPassword: false, user }
    : { isLoggedIn: false, isResetPassword: false, user: null };

 function authReducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isLoggedIn: false,
            };
        case SIGNUP_FAIL:
            return {
                ...state,
                isLoggedIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case RESET_PASSWORD:
            return {
                ...state,
                isLoggedIn: true,
                user: null,
                isResetPassword: true
            };
        default:
            return state;
    }
}

export default authReducer