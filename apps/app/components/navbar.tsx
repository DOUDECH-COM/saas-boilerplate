import { FC } from "react";
// import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

interface navbarProps {}

const Navbar: FC<navbarProps> = ({}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white text-slate-700 shadow-xl">
      <div className="font-semibold text-xl">Logo</div>
      <div className="flex items-center gap-2">
        <Link
          href="/signup"
          className={buttonVariants({ variant: "secondary" })}
        >
          {" "}
          Sign Up{" "}
        </Link>
        <Link href="/singin" className={buttonVariants()}>
          {" "}
          Sign In{" "}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
