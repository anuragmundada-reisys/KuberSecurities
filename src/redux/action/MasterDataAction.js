import { GET_MASTER_DATA} from '../constant/ActionType';
import axios from '../../axios';

export function getMasterData(){
    return function(dispatch) {
        return axios.get('/kuberbeverages/dictionary/v1').then(response=>{
            dispatch({ type: GET_MASTER_DATA, payload: response.data });
        }).catch(err=>{
            console.log("error", err)
        })
      };
}
