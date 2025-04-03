import { cn } from "@/lib/utils";
import { MdErrorOutline } from "react-icons/md";
import { TiInfoLarge } from "react-icons/ti";
import { CircleCheck, TriangleAlert } from "lucide-react";
import React from "react";

const AlertMessage = ({ type, message }) => {
  if (!type) return null;

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     document.querySelector("#alert-message").classList.add("hidden");
  //   }, 5000);
  // }, [type, message]);

  return (
    <>
      <div
        id="alert-message"
        className={cn(
          "p-3 rounded-md flex items-center gap-x-2 text-sm font-semibold",
          {
            "bg-emerald-500/15 text-emerald-500": type === "success",
            "bg-red-500/15 text-red-500": type === "error",
            "bg-yellow-500/15 text-yellow-700": type === "warning",
            "bg-blue-500/15 text-blue-500": type === "info",
          }
        )}
      >
        {type === "success" ? (
          <CircleCheck className="h-5 w-5" />
        ) : type === "error" ? (
          <MdErrorOutline className="h-5 w-5" />
        ) : type === "warning" ? (
          <TriangleAlert className="h-5 w-5" />
        ) : type === "info" ? (
          <TiInfoLarge className="h-5 w-5" />
        ) : null}

        <p>{message}</p>
      </div>
    </>
  );
};

export default AlertMessage;
