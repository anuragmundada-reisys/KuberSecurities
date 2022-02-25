import React from 'react';
export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id, render },
  }) {

    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
  
    return (
      
      <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700 w-30">{render("Header")}:</span>
      <select
        className="mt-1 mr-4 block py-0 w-30 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
    );
  }


export function SelectAssignedStatusFilter({
      column: { filterValue, setFilter, preFilteredRows, id, render },
   }) {

/*  const options = React.useMemo(() => {
    const options = new Set();
   /!* preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });*!/
    options.add('Assigned');
    options.add('Unassigned')
    return [...options.values()];
  }, [id, preFilteredRows]);*/

  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add((row.values[id]));
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (

      <label className="flex gap-x-2 items-baseline">
        <span className="text-gray-700 w-30">{render("Header")}:</span>
        <select
            className="mt-1 mr-4 block py-0 w-30 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name={id}
            id={id}
            value={filterValue}
            onChange={e => {
              setFilter(JSON.parse(e.target.value))
            }}
        >
          <option value="">All</option>
          {options.map((option, i) => (
              <option key={i} value={option}>
                {option ? 'Assigned' : 'Unassigned'}
              </option>
          ))}
        </select>
      </label>
  );
}