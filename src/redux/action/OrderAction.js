import { ADD_ORDER, GET_ALL_ORDERS, RECEIVED_PAYMENTS, GET_ORDER_ASSIGNEE_HISTORY} from '../constant/ActionType';
import axios from '../../axios';
import authHeader, {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";
import {stringify} from "querystringify";

export function addOrder(payload) {
    return function(dispatch){
      return axios.post('/kuberbeverages/orders/v1', payload, { headers: authHeader() }).then(()=>{
          dispatch({ type: ADD_ORDER, payload: payload });
      }).catch(error=>{
          if(error.response){
              throw error.response.data;
          }else{
              throw INTERNAL_ERROR_MESSAGE
          }
      })
    }
  };

export function updateOrder(payload) {
    return function(dispatch){
        return axios.patch('/kuberbeverages/orders/v1', payload, { headers: authHeader() })
        .then()
        .catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    }
};

export function deleteOrder(orderId) {
    return function(dispatch){
        return axios.delete('/kuberbeverages/orders/v1/'+orderId, { headers: authHeader() })
            .then()
            .catch(error=>{
                if(error.response){
                    throw error.response.data;
                }else{
                    throw INTERNAL_ERROR_MESSAGE
                }
            })
    }
};

export function addReceivedPayment(payload) {
    return function(dispatch){
        return axios.post('/kuberbeverages/paymenthistory/v1/', payload, { headers: authHeader() }).then()
            .catch(error=>{
                if(error.response){
                    throw error.response.data;
                }else{
                    throw INTERNAL_ERROR_MESSAGE
                }})
    }
};

export function getReceivedPayment(orderId) {
    return function(dispatch){
        return axios.get('/kuberbeverages/paymenthistory/v1/' + orderId).then((response)=>{
            dispatch({ type: RECEIVED_PAYMENTS, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
        }})
    }
};

export function getAllOrders(params){
    return function(dispatch) {
        return axios.get('/kuberbeverages/orders/v1?'+ stringify(params)).then(response=>{
            dispatch({ type: GET_ALL_ORDERS, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
      };
}

export function getOrderAssigneeHistory(orderId){
    return function(dispatch) {
        return axios.get('/kuberbeverages/orders/v1/assigneehistory/' + orderId).then(response=>{
            dispatch({ type: GET_ORDER_ASSIGNEE_HISTORY, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
       }})
    };
}