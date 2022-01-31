import { ADD_RAW_MATERIAL_PURCHASE, GET_MASTER_DATA, GET_RAW_MATERIAL_PURCHASE, GET_ALL_ORDERS, ADD_ORDER } from '../constant/ActionType';

const initialState = {
    masterData: {
        rawMaterialType: [],
        productType:[]
    },
    rawMaterialPurchase: {},
    rawMaterialPurchaseList: [],
    orderList: [],
    order:{}
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
          case GET_RAW_MATERIAL_PURCHASE:
              return {
                  ...state, rawMaterialPurchaseList: action.payload
              }
           case GET_ALL_ORDERS:
               return {
                   ...state, orderList: action.payload
               }
           case ADD_ORDER:
                return {
                    ...state, order: action.payload
                }
          default:
              return state;
     }
  };
  
  export default rootReducer;