import React from "react";

const Table = ({ columns, data, actions, emptyMessage = "No data found" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`p-4 text-left font-semibold text-gray-700 ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="p-4 text-center font-semibold text-gray-700">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-blue-50/50 transition-colors duration-150">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`p-4 ${col.cellClassName || ""}`}>
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {actions(row, rowIndex)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
