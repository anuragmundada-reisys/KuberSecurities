import {GET_AVAILABLE_STOCK, GET_COUNT, GET_PAYMENT_METRICS} from '../constant/ActionType';
import axios from '../../axios';

export function getMetrics(receivedDate){
    return function(dispatch) {
        return axios.get('/kuberbeverages/metrics/v1', { params: { receivedDate: receivedDate } }).then(response=>{
            dispatch({ type: GET_COUNT, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        })
      };
}

export function getPaymentMetrics(receivedDate){
    return function(dispatch) {
        return axios.get('/kuberbeverages/paymentmetrics/v1', { params: { receivedDate: receivedDate } }).then(response=>{
            dispatch({ type: GET_PAYMENT_METRICS, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        })

    };
}

export function getAvailableStock(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/metrics/v1/availablestock').then(response=>{
            dispatch({ type: GET_AVAILABLE_STOCK, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        })

    };
}