import {LOGIN_SUCCESS, LOGOUT, RESET_PASSWORD} from '../constant/ActionType';
import axios from '../../axios';
import authHeader, {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";

export function signup(payload) {
    return function(dispatch){
        return axios.post('/kuberbeverages/auth/v1/signup', payload, { headers: authHeader() }).then(()=>{
            //dispatch({ type: SIGNUP_SUCCESS, payload: payload });
        }).catch(error=>{
            if(error.response && error.response.data && error.response.data.error){
                throw error.response.data.error;
            }else if(error.response && error.response.data){
                throw error.response.data
            } else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    }
};

export function login(payload) {
    return function(dispatch){
        return axios.post('/kuberbeverages/auth/v1/login', payload).then((response)=>{
            if(response && response.data && response.data.token){
                localStorage.setItem("user", JSON.stringify(response.data) )
                dispatch({ type: LOGIN_SUCCESS, payload: response.data });
            }
        }).catch(error=>{
            if(error.response && error.response.data && error.response.data.error){
                throw error.response.data.error;
            }else if(error.response && error.response.data){
                throw error.response.data
            } else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    }
};

export const logout = () => (dispatch) => {
    return axios.get('/kuberbeverages/auth/v1/logout').then((response)=>{
        localStorage.removeItem("user" )
        dispatch({ type: LOGOUT});
    }).catch(error=>{
        if(error.response){
            throw error.response.data;
        }else{
            throw INTERNAL_ERROR_MESSAGE
        }})

};

export const resetpassword = (resetpasswordData) => (dispatch) => {
    return axios.patch('/kuberbeverages/auth/v1/resetpassword', resetpasswordData, { headers: authHeader() }).then((response)=>{
        dispatch({ type: RESET_PASSWORD});
    }).catch(error=>{
        if(error.response){
            throw error.response.data;
        }else{
            throw INTERNAL_ERROR_MESSAGE
        }})

};

