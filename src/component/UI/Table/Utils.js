
export function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export const ORDER_LIST_COLUMNS =  [
    {
        Header: "Bill Number",
        accessor: "billNo"
    },
  {
     Header: "Customer Name",
     accessor: "customerName",
   },
    {
        Header: "Total Amount",
        accessor: "totalAmount",
    },
    {
        Header: "Balance Due",
        accessor: "balanceDue",
    },
   {
     Header: "Status",
     accessor: "status",
     Cell: ({ row: { original } }) => {
         return original.balanceDue === 0 ? 'Completed' : 'Pending';
     },

   },
   {
     Header: "Order Date",
     accessor: "orderDate",
   },
  
]

export const COLLECTION_ORDERS_COLUMNS =  [
    {
        Header: "Bill Number",
        accessor: "billNo",
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
    },
    {
        Header: "Balance Due",
        accessor: "balanceDue",
    },
    {
        Header: "Order Date",
        accessor: "orderDate",
    },
    {
        Header: "Assigned Status",
        accessor: "assignedStatus",
        Cell: ({row}) => {
            const data =  row.original
            return (
                data.assignedStatus ?
                    <p style={{backgroundColor: "#3cb371"}}> Assigned </p> :
                    <p> Unassigned</p>
            )
        },
    },
    {
        Header: "Assignee Name",
        accessor: "assigneeName",
        Cell: ({ row: { original } }) => {
            return original.assigneeName === null ? '-' : original.assigneeName;
        },
    },
    {
        Header: "Updated Date",
        accessor: "updatedDate",
        Cell: ({ row: { original } }) => {
            return original.updatedDate === null ? '-' : original.updatedDate;
        },
    },

]

export const INVENTORY_LIST_COLUMNS =  [
   {
     Header: "Product Type",
     accessor: "productType",
   },
   {
     Header: "Quantity",
     accessor: "quantity",
   },
   {
     Header: "Production Date",
     accessor: "productionDate",
   },
]
