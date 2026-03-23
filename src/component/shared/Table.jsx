import React from "react";

const Table = ({ columns, data, actions, emptyMessage = "No data found" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b text-gray-600 font-medium">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-3 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
            {actions && (
              <th className="p-3 text-center">Action</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`p-3 ${col.cellClassName || ""}`}>
                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      {actions(row, rowIndex)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="p-6 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
