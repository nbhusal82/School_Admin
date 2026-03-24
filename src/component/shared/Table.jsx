import React from "react";

const Table = ({ columns, data, actions, emptyMessage = "No data found" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300">
      <div className="overflow-x-auto">
        {/* 'border-collapse' le double line huna didaina */}
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  // border-x (Vertical) ra border-b (Horizontal) header ko lagi
                  className={`p-4 text-left font-bold text-gray-700 border-x border-b border-gray-300 ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="p-4 text-center font-bold text-gray-700 border-x border-b border-gray-300">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      // 'border' class le cell ko charai tira line pathaucha
                      className={`p-4 border border-gray-200 text-gray-600 ${col.cellClassName || ""}`}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4 border border-gray-200">
                      <div className="flex justify-center gap-2">
                        {actions(row, rowIndex)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="p-8 text-center text-gray-400 border border-gray-200"
                >
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
