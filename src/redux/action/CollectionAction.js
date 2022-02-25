import axios from "../../axios";
import {GET_COLLECTION_SEARCHED_ORDERS} from "../constant/ActionType";
import { stringify } from 'querystringify';
import {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";

export function getCollectionSearchedOrders(params) {
    return function(dispatch){
        return axios.get('/kuberbeverages/orders/v1/collection/search?' + stringify(params)).then((res)=>{
            dispatch({ type: GET_COLLECTION_SEARCHED_ORDERS, payload: res.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    }
};