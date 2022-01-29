import { ADD_RAW_MATERIAL_PURCHASE, GET_MASTER_DATA , GET_RAW_MATERIAL_PURCHASE} from '../constant/ActionType';

export function addRawMaterialPurchase(payload) {
    //add post call to API
    return { type: ADD_RAW_MATERIAL_PURCHASE, payload }
  };

export function getMasterData(){
    return function(dispatch) {
       /*  return fetch("https://jsonplaceholder.typicode.com/posts")
          .then(response => response.json())
          .then(json => {
            dispatch({ type: "DATA_LOADED", payload: json });
          }); */
         const masterData = {
             rawMaterialType:[
                 {Raw_Material_Id: 1, Raw_Material_Name: 'Cartoon' },
                 {Raw_Material_Id: 2, Raw_Material_Name: 'Cap' },
                 {Raw_Material_Id: 3, Raw_Material_Name: 'Label' },
                 {Raw_Material_Id: 4, Raw_Material_Name: 'Preform' },
             ],
             productType:[
                 {Product_Id: 1, Product_Type:'250ml'},
                 {Product_Id: 2, Product_Type:'500ml'},
                 {Product_Id: 3, Product_Type:'1L'},
                 {Product_Id: 4, Product_Type:'2L'},
             ]
         }
          dispatch({ type: GET_MASTER_DATA, payload: masterData });
      };
}

export function getRawMaterialPurchase(){
    return function(dispatch) {
       /*  return fetch("https://jsonplaceholder.typicode.com/posts")
          .then(response => response.json())
          .then(json => {
            dispatch({ type: "DATA_LOADED", payload: json });
          }); */
         const list = [
             {RawMaterial_Type: 'Cartoon', Product_Type: '250ml', Quantity: 34, Status: 'Success', Date: '02/12/2022'},
             {RawMaterial_Type: 'Cap', Product_Type: '-', Quantity: 34, Status: 'Success', Date: '02/12/2022'},
             {RawMaterial_Type: 'Preform', Product_Type: '500ml', Quantity: 34, Status: 'Success', Date: '03/12/2022'},
             {RawMaterial_Type: 'Label', Product_Type: '250ml', Quantity: 34, Status: 'Success', Date: '04/22/2022'},
             {RawMaterial_Type: 'Cartoon', Product_Type: '500ml', Quantity: 34, Status: 'Success', Date: '02/12/2022'},
             {RawMaterial_Type: 'Cap', Product_Type: '-', Quantity: 34, Status: 'Success', Date: '05/12/2021'},
             {RawMaterial_Type: 'Preform', Product_Type: '250ml', Quantity: 34, Status: 'Success', Date: '02/12/2022'},
          ]
          const rawMaterialPurchaseList = [...list, ...list, ...list, ...list];
          dispatch({ type: GET_RAW_MATERIAL_PURCHASE, payload: rawMaterialPurchaseList });
      };
}