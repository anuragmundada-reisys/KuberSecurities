import {GET_MASTER_DATA, GET_CUSTOMER_NAMES, GET_RECEIVER_NAMES, GET_BILL_NUMBERS} from '../constant/ActionType';
import axios from '../../axios';
import {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";

export function getMasterData(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/dictionary/v1').then(response=>{
            dispatch({ type: GET_MASTER_DATA, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
      };
}

export function getCustomerNames(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/dictionary/v1/customers').then(response=>{
            dispatch({ type: GET_CUSTOMER_NAMES, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    };
}

export function getReceiverNames(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/dictionary/v1/receivers').then(response=>{
            dispatch({ type: GET_RECEIVER_NAMES, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    };
}

export function getBillNumbers(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/dictionary/v1/billno').then(response=>{
            dispatch({ type: GET_BILL_NUMBERS, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    };
}