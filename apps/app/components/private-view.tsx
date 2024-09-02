"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface privateViewProps {
  children: React.ReactNode;
}

const PrivateView: FC<privateViewProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /*
        Note: this is just a superficial auth verification for the interface.
        The API interceptor will eventually catch 401 errors and redirect the user if the fastify server
        failer to validate the token or the token doesn't exist.
    */

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) redirect("/signin");
    else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated)
    return (
      <>
        <div className="flex justify-between items-center bg-white shadow-md px-7 py-2">
          <div className="font-semibold text-xl text-zinc-600">Logo</div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-5">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-1 text-red-500">
                  <LogOut size={14} /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {children}
      </>
    );
};

export default PrivateView;
