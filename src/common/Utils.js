
export  const INTERNAL_ERROR_MESSAGE = 'Something went wrong, Please try again later!';
export const DATA_NOT_FOUND= 'Data Not Found';
export const ORDER_ASSIGNED_SUCCESSFULLY = 'Order Assigned Successfully.';
export const ORDER_UNASSIGNED_SUCCESSFULLY = 'Order Unassigned Successfully.';
export const RECEIVED_AMOUNT_GREATER_THAN_BALANCE_DUE = 'Received Amount is greater than balance due.';
export const RECEIVED_AMOUNT_ADDED_SUCCESSFULLY = 'Received Amount Added Successfully.'
export const ADDED_ITEMS_TO_INVENTORY = 'Added items to Inventory Successfully!';
export const SELECT_DATE_DASHBOARD = 'Please select date to view Order and Payment Metrics';

export const isValidInput = (value) => {
    if(value === '' || value === null || value === undefined){
        return false;
    }else{
        return true;
    }
}