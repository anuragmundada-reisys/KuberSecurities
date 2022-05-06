import axios from "../../axios";
import {stringify} from "querystringify";
import { GET_ALL_ORDERS_RECEIVED_PAYMENT} from "../constant/ActionType";
import {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";

export function getAllOrdersReceivedPayment(params){
    return function(dispatch) {
        return axios.get('/kuberbeverages/receivedpayment/v1?'+ stringify(params)).then(response=>{
            dispatch({ type: GET_ALL_ORDERS_RECEIVED_PAYMENT, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    };
}