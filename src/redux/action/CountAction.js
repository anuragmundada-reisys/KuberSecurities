import { GET_COUNT } from '../constant/ActionType';
import axios from '../../axios';

export function getOrderRawMaterialCount(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/metrics/v1').then(response=>{
            dispatch({ type: GET_COUNT, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        })

      };
}
