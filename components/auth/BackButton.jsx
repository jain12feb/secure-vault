"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BackButton = ({ label, href }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center h-10 px-4 py-2 gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-sm hover:bg-accent hover:text-accent-foreground"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Link>
  );
};

export default BackButton;
