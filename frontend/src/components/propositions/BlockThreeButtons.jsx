import React from "react";
import Button from "../ui/Button";

function BlockThreeButtons({
  onPrimary,
  onSecondary,
  onThird,
  primaryText,
  secondaryText,
  thirdText,
}) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      <Button onClick={onPrimary} variant="primary" className="!py-2.5">
        {primaryText}
      </Button>
      <div className="flex gap-2">
        <Button onClick={onSecondary} variant="secondary" className="flex-1">
          {secondaryText}
        </Button>
        <Button onClick={onThird} variant="secondary" className="flex-1">
          {thirdText}
        </Button>
      </div>
    </div>
  );
}

export default BlockThreeButtons;
