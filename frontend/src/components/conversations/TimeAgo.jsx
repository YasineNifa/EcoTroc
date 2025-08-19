import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";

const TimeAgo = ({ date }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (date) {
      const formattedDate = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
      setTimeAgo(formattedDate.replace(/^dans/, "il y a"));
    }
  }, [date]);

  return <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo}</span>;
};

export default TimeAgo;
