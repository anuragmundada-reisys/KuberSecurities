import { ADD_ORDER, GET_ALL_ORDERS, RECEIVED_PAYMENTS, GET_ORDER_ASSIGNEE_HISTORY} from '../constant/ActionType';
import axios from '../../axios';
import {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";

export function addOrder(payload) {
    return function(dispatch){
      return axios.post('/kuberbeverages/orders/v1', payload).then(()=>{
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
        return axios.patch('/kuberbeverages/orders/v1', payload)
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
        return axios.post('/kuberbeverages/paymenthistory/v1/', payload).then()
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
        }) .catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
        }})
    }
};

export function getAllOrders(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/orders/v1').then(response=>{
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