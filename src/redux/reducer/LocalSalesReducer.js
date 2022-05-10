import {
    ADD_RAW_MATERIAL_PURCHASE,
    GET_MASTER_DATA,
    GET_RAW_MATERIAL_PURCHASE,
    GET_ALL_ORDERS, ADD_ORDER,
    GET_INVENTORY_DATA,
    ADD_INVENTORY,
    GET_COUNT,
    GET_CUSTOMER_NAMES, RECEIVED_PAYMENTS,
    GET_RECEIVER_NAMES,
    GET_PAYMENT_METRICS, GET_AVAILABLE_STOCK,
    GET_ORDER_ASSIGNEE_HISTORY,
    GET_BILL_NUMBERS,
    GET_TOTAL_BALANCE_DUE, GET_ALL_ORDERS_RECEIVED_PAYMENT,
    GET_EXPENSE,
    GET_EXPENSE_BY_DATE
} from '../constant/ActionType';

const initialState = {
    masterData: {
        rawMaterialType: [],
        productType:[]
    },
    rawMaterialPurchase: {},
    rawMaterialPurchaseList: [],
    orderList: [],
    order:{},
    inventoryData: [],
    inventory:{},
    count: {
        payment:[],
        orders:[]
    },
    customerNames: [],
    receivedPayments:[],
    receiverNames:[],
    paymentMetrics: [],
    availableStock: [],
    assigneeHistory: [],
    billNumbers:[],
    totalBalanceDue:[],
    totalReceivedPayments: [],
    expenseData: [],
    expenseByDate: []
  };
  
  function localSalesReducer(state = initialState, action) {
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
            case GET_INVENTORY_DATA:
                return {
                   ...state, inventoryData: action.payload
                 }
            case ADD_INVENTORY:
                 return {
                    ...state, inventory: action.payload
                 }
            case GET_COUNT:
                  return {
                       ...state, count: action.payload
                 }
           case GET_CUSTOMER_NAMES:
             return {
                 ...state, customerNames: action.payload
             }
           case RECEIVED_PAYMENTS:
             return {
                 ...state, receivedPayments: action.payload
             }
          case GET_RECEIVER_NAMES:
             return {
                 ...state, receiverNames: action.payload
             }
          case GET_PAYMENT_METRICS:
             return {
                 ...state, paymentMetrics: action.payload
             }
         case GET_AVAILABLE_STOCK:
             return {
                 ...state, availableStock: action.payload
             }
         case GET_ORDER_ASSIGNEE_HISTORY:
             return {
                 ...state, assigneeHistory: action.payload
             }
         case GET_BILL_NUMBERS:
             return {
                 ...state, billNumbers: action.payload
             }
         case GET_TOTAL_BALANCE_DUE:
             return {
                 ...state, totalBalanceDue: action.payload
             }
         case GET_ALL_ORDERS_RECEIVED_PAYMENT:
             return {
                 ...state, totalReceivedPayments: action.payload
             }
         case GET_EXPENSE:
             return {
                 ...state, expenseData: action.payload
             }
         case GET_EXPENSE_BY_DATE:
             return {
                 ...state, expenseByDate: action.payload
             }
          default:
              return state;
     }
  };
  
  export default localSalesReducer;