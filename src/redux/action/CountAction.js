import { GET_COUNT } from '../constant/ActionType';
import axios from '../../axios';

export function getOrderRawMaterialCount(){
    return function(dispatch) {
       /*  return axios.get('/kuberbeverages/count/v1').then(response=>{
            dispatch({ type: GET_COUNT, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        }) */

        const count = [{
            pendingOrder: 1000,
            availableStock: 2000,
            title: '250ml',
            availableRawMaterial: {
              cartoon: 100,
              cap: 200,
              label: 100,
              preform: 100,
              tape: 10
            }
          },
          {
            pendingOrder: 50,
            availableStock: 100,
            title: '500ml',
            availableRawMaterial: {
              cartoon: 100,
              cap: 200,
              label: 100,
              preform: 100,
              tape: 10
            }
          },
          {
            pendingOrder: 90,
            availableStock: 1450,
            title: '1L',
            availableRawMaterial: {
              cartoon: 100,
              cap: 200,
              label: 100,
              preform: 100,
              tape: 40
            }
          },
          {
            pendingOrder: 80,
            availableStock: 160,
            title: '2L',
            availableRawMaterial: {
              cartoon: 100,
              cap: 200,
              label: 100,
              preform: 100,
              tape: 10
            }
          },
        ]
        dispatch({ type: GET_COUNT, payload: count });
      };
}
