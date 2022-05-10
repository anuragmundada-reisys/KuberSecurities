import { ADD_EXPENSE, GET_EXPENSE} from '../constant/ActionType';
import axios from '../../axios';
import {stringify} from "querystringify";
import authHeader, {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";

export function addExpense(payload) {
    return function(dispatch){
        return axios.post('/kuberbeverages/expense/v1', payload, { headers: authHeader() }).then(()=>{
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    }
};

export function getExpense(params){
    return function(dispatch) {
        return axios.get('/kuberbeverages/expense/v1?' + stringify(params)).then(response=>{
            dispatch({ type: GET_EXPENSE, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
    };
}
