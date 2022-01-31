import { SelectColumnFilter } from './ColumnFilter';

export function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

export const RAW_MATERIAL_COLUMNS =  [
  {
     Header: "Raw Material",
     accessor: "rawMaterialName",
     Filter: SelectColumnFilter, 
     filter: 'includes',
   },
   {
     Header: "Product Type",
     accessor: "productType",
     Filter: SelectColumnFilter, 
     filter: 'includes',
   },
   {
     Header: "Quantity",
     accessor: "quantity",
   },
   {
     Header: "Status",
     accessor: "status",
     Cell: ({ row: { original } }) => {
         return original.status === true ? 'Success' : 'Pending';
     },
   },
   {
     Header: "Purchase Date",
     accessor: "purchaseDate",
     Filter: SelectColumnFilter, 
     filter: 'includes',
   },
]
