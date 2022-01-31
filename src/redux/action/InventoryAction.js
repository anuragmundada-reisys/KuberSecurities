import { ADD_INVENTORY, GET_INVENTORY_DATA} from '../constant/ActionType';
import axios from '../../axios';

export function addInventory(payload) {
    return function(dispatch){
      return axios.post('/kuberbeverages/inventory/v1', payload).then(()=>{
          dispatch({ type: ADD_INVENTORY, payload: payload });
      }).catch(err=>{
        console.log("error", err)
      })
    }
  };

export function getInventoryData(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/inventory/v1').then(response=>{
            dispatch({ type: GET_INVENTORY_DATA, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        })
      };
}
