import React from "react";

const PasswordEntryCardSkelton = React.forwardRef(({ key }, ref) => {
  return (
    <div ref={ref} key={key} className="animate-pulse border rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between w-full mx-auto">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded-full w-1/5"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
      </div>
      <div className="p-4">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="flex space-x-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="flex space-x-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col gap-1 justify-between mt-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-2 w-full p-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 w-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
});
export default PasswordEntryCardSkelton;
