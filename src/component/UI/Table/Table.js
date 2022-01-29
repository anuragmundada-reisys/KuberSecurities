import React from "react";
import { useTable, useGlobalFilter, useFilters, useSortBy, usePagination } from "react-table";
import Pagination from "./Pagination";

function Table({ columns, data }) {
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
    preGlobalFilteredRows, 
    setGlobalFilter,
    } =
    useTable({
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination);

  return (
      <>
      <div className="mt-2 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="flex items-stretch ml-5 mt-5 mb-10 ">
            {headerGroups.map((headerGroup) =>
                headerGroup.headers.map((column) =>
                column.Filter ? (
                    <div key={column.id}>
                    {column.render("Filter")}
                    </div>
                ) : null
                )
            )}    
            </div> 
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 border-t border-gray-400">
            <thead className="bg-gray-50 w-full">
            {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                         <th
                         scope="col"
                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
            <tbody {...getTableBodyProps()}  className="bg-white divide-y divide-gray-200">
                {page.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                        return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">{cell.render("Cell")}</td>;
                    })}
                    </tr>
                );
                })}
            </tbody>
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