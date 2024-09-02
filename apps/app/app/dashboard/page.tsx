import PrivateView from "@/components/private-view";
import { FC, useState } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <PrivateView>
      <div>Dashboard</div>
    </PrivateView>
  );
};

export default page;
