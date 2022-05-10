
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
        accessor: "assignedUpdatedDate",
        Cell: ({ row: { original } }) => {
            return original.assignedUpdatedDate === null ? '-' : original.assignedUpdatedDate;
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

export const RECEIVED_PAYMENTS_COLUMNS =  [
    {
        Header: "Bill Number",
        accessor: "billNo"
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
    },
    {
        Header: "Received Amount",
        accessor: "receivedAmount",
    },
    {
        Header: "Payment Mode",
        accessor: "paymentMode",
    },
    {
        Header: "Receiver Name",
        accessor: "receiverName",
    },
    {
        Header: "Received Date",
        accessor: "receivedPaymentDate",
    },

]

export const EXPENSE_LIST_COLUMNS =  [
    {
        Header: "Expense Type",
        accessor: "expenseType",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Expense Date",
        accessor: "expenseDate",
    },
]
