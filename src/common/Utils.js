
export  const INTERNAL_ERROR_MESSAGE = 'Something went wrong, Please try again later!';
export const DATA_NOT_FOUND= 'Data Not Found';
export const ORDER_ASSIGNED_SUCCESSFULLY = 'Order Assigned Successfully.';
export const ORDER_UNASSIGNED_SUCCESSFULLY = 'Order Unassigned Successfully.';
export const RECEIVED_AMOUNT_GREATER_THAN_BALANCE_DUE = 'Received Amount is greater than balance due.';
export const RECEIVED_AMOUNT_ADDED_SUCCESSFULLY = 'Received Amount Added Successfully.'
export const ADDED_ITEMS_TO_INVENTORY = 'Added items to Inventory Successfully!';
export const SELECT_DATE_DASHBOARD = 'Please select date to view Order and Payment Metrics';
export const ORDER_ADDED_SUCCESSFULLY = 'Order Added Successfully!';
export const ORDER_UPDATED_SUCCESSFULLY = 'Order Updated Successfully!';
export const UPDATE_ORDER_DETAILS = 'Update Order Details';
export const ENTER_PAYMENT_DETAILS = 'Enter Payment Details';
export const ENTER_ORDER_DETAILS = 'Enter Order Details';
export const ASSIGN_ORDER = 'Assign Order';
export const ALL_FIELDS_ARE_REQUIRED = 'All fields are required!';
export const PLEASE_ADD_ASSIGNEE_NAME = 'Please add Assignee Name';
export const PLEASE_ADD_RECEIVED_PRODUCTS = 'Please add received Products';
export const SUPER_ADMIN_ROLE = 'Super_Admin';
export const NEW_CONFIRM_PASSWORD = 'Confirm password does not match New password';
export const STRONG_PASSWORD = 'Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters';


export const isValidInput = (value) => {
    if(value === '' || value === null || value === undefined || Number.isNaN(value)){
        return false;
    }
    else{
        return true;
    }
}

export default function authHeader(user) {
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
}