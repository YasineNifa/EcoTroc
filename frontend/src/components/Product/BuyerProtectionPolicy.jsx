import React from "react";
import Icon from "../ui/Icon";
import ShieldIcon from "@mui/icons-material/Shield";

function BuyerProtectionPolicy() {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-teal-600">
        <ShieldIcon />
      </Icon>
      <div>
        <h3 className="font-bold">Buyer Protection Fee</h3>
        <p className="text-xs text-gray-600 mt-1">
          For any purchase made through the "Buy" button, a service fee will be
          added.
          <a href="#" className="text-teal-600 font-semibold ml-1">
            Buyer Protection Policy
          </a>
        </p>
      </div>
    </div>
  );
}

export default BuyerProtectionPolicy;
