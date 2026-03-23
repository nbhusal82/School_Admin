import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex justify-between mb-8 items-center border-b pb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
