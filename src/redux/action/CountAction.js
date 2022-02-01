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
            order: 1000,
            inventory: 2000,
            title: '250ml',
            rawMaterial: {
              cartoon: 100,
              cap: 200,
              label: 100,
              preform: 100,
              tape: 10
            }
          },
          {
            order: 50,
            inventory: 100,
            title: '500ml',
            rawMaterial: {
              cartoon: 100,
              cap: 200,
              label: 100,
              preform: 100,
              tape: 10
            }
          },
          {
            order: 90,
            inventory: 1450,
            title: '1L',
            rawMaterial: {
              cartoon: 100,
              cap: 200,
              label: 100,
              preform: 100,
              tape: 40
            }
          },
          {
            order: 80,
            inventory: 160,
            title: '2L',
            rawMaterial: {
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
