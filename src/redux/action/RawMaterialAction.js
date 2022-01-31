import { GET_RAW_MATERIAL_PURCHASE, ADD_RAW_MATERIAL_PURCHASE} from '../constant/ActionType';
import axios from '../../axios';

export function addRawMaterialPurchase(payload) {
    return function(dispatch){
      return axios.post('/kuberbeverages/rawmaterials/v1', payload).then(()=>{
          dispatch({ type: ADD_RAW_MATERIAL_PURCHASE, payload: payload });
      }).catch(err=>{
        console.log("error", err)
      })
    }
  };


export function getRawMaterialPurchase(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/rawmaterials/v1').then(res => {
            dispatch({type: GET_RAW_MATERIAL_PURCHASE, payload: res.data});
        }).catch(err => {
            console.log("error", err)
        })
    };
}
