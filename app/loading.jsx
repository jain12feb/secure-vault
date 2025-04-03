import { Spinner } from "@/components/ui/spinner";
import { FadeLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-[100vh] dark:bg-gray-950">
      {/* <div className="relative w-16 h-16">
        <FadeLoader className="text-gray-900 dark:text-gray-100" />
      </div> */}
      <Spinner size="large" />
    </div>
  );
};

export default Loading;
