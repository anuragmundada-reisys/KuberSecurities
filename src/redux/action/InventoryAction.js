import { ADD_INVENTORY, GET_INVENTORY_DATA} from '../constant/ActionType';
import axios from '../../axios';
import {stringify} from "querystringify";
import {INTERNAL_ERROR_MESSAGE} from "../../common/Utils";

export function addInventory(payload) {
    return function(dispatch){
      return axios.post('/kuberbeverages/inventory/v1', payload).then(()=>{
          dispatch({ type: ADD_INVENTORY, payload: payload });
      }).catch(error=>{
          if(error.response){
              throw error.response.data;
          }else{
              throw INTERNAL_ERROR_MESSAGE
          }
      })
    }
  };

export function getInventoryData(params){
    return function(dispatch) {
        return axios.get('/kuberbeverages/inventory/v1?' + stringify(params)).then(response=>{
            dispatch({ type: GET_INVENTORY_DATA, payload: response.data });
        }).catch(error=>{
            if(error.response){
                throw error.response.data;
            }else{
                throw INTERNAL_ERROR_MESSAGE
            }
        })
      };
}


