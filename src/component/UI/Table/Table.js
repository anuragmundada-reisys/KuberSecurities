import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import Pagination from "./Pagination";

function Table({ columns, data, dataFound }) {
  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    page, 
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    prepareRow, 
    state, 
    } =
    useTable({
      columns,
      data,

    },

    useSortBy,
    usePagination);

  return (
      <>
      <div className="mt-1 flex flex-col">
        <div className="-my-1 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table {...getTableProps()} className="min-w-full w-auto divide-y divide-gray-200 border-t border-gray-400 content-center">
            <thead className="bg-gray-50 w-full">
            {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                         <th
                         scope="col"
                         className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                         {...column.getHeaderProps(column.getSortByToggleProps())}
                       >
                        {column.render('Header')}
                        <span>
                            {column.isSorted
                            ? column.isSortedDesc
                                ? ' ▼'
                                : ' ▲'
                            : ''}
                        </span>
                        
                        </th>
                    ))}
                    </tr>
                ))}
            </thead>
              {dataFound && <tbody {...getTableBodyProps()}  className="bg-white divide-y divide-gray-200">
                {page.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                        return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">{cell.render("Cell")}</td>;
                    })}
                    </tr>
                );
                }) }
            </tbody> }
            </table> 
           </div>
         </div>
       </div>
     </div>
        <Pagination 
          page={page}
          canPreviousPage = {canPreviousPage}
          canNextPage = {canNextPage}
          pageOptions = {pageOptions}
          pageCount = {pageCount}
          gotoPage = {gotoPage}
          nextPage ={nextPage}
          previousPage = {previousPage}
          setPageSize = {setPageSize}
          state = {state}
         />
    </>
  );
}

export default Table;