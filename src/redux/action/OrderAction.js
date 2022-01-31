import { ADD_ORDER, GET_ALL_ORDERS} from '../constant/ActionType';
import axios from '../../axios';

export function addOrder(payload) {
    return function(dispatch){
      return axios.post('/kuberbeverages/orders/v1', payload).then(()=>{
          dispatch({ type: ADD_ORDER, payload: payload });
      }).catch(err=>{
        console.log("error", err)
      })
    }
  };

export function getAllOrders(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/orders/v1').then(response=>{
            dispatch({ type: GET_ALL_ORDERS, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        })
      };
}