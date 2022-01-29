import { SelectColumnFilter } from './ColumnFilter';

export function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

export const RAW_MATERIAL_COLUMNS =  [
  {
     Header: "Raw Material",
     accessor: "RawMaterial_Type",
     Filter: SelectColumnFilter, 
     filter: 'includes',
   },
   {
     Header: "Product Type",
     accessor: "Product_Type",
     Filter: SelectColumnFilter, 
     filter: 'includes',
   },
   {
     Header: "Quantity",
     accessor: "Quantity",
   },
   {
     Header: "Status",
     accessor: "Status",
   },
   {
     Header: "Purchase Date",
     accessor: "Date",
     Filter: SelectColumnFilter, 
     filter: 'includes',
   },
]
