import { Button } from "@/components/ui/button";
import React from "react";
import { generatePortalLink } from "../../../actions/generatePortalLink";

const ManageAccountButton = () => {
  return (
    // Server action to redirect user to Stripe Billing Portal to manage account details
    <form action={generatePortalLink}>
      <button type="submit"> Manage Billing</button>
    </form>
  );
};

export default ManageAccountButton;
