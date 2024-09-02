import React, { FC } from "react";
import Navbar from "./navbar";

interface publicViewProps {
  children: React.ReactNode;
}

const PublicView: FC<publicViewProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PublicView;
