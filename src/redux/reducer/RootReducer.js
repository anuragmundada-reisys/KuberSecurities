import { ADD_RAW_MATERIAL_PURCHASE, GET_MASTER_DATA } from '../constant/ActionType';

const initialState = {
    masterData: {
        rawMaterialType: [],
        productType:[]
    },
    rawMaterialPurchase: {}
  };
  
  function rootReducer(state = initialState, action) {
     switch(action.type){
         case ADD_RAW_MATERIAL_PURCHASE:
             return{
                 ...state, rawMaterialPurchase:action.payload
             }
          case GET_MASTER_DATA:
              return{
                  ...state, masterData: action.payload
              }
          default:
              return state;
     }
  };
  
  export default rootReducer;