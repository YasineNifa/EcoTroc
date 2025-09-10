import { useState, useEffect } from "react";
import apiClient from "../services/api";

export const usePropositionPolling = (initialOffer) => {
  const [currentOffer, setCurrentOffer] = useState(initialOffer);
  const { proposition } = currentOffer;
  const { status_display, id } = proposition;

  useEffect(() => {
    let intervalId;

    const fetchProposition = async () => {
      try {
        const response = await apiClient.get(`/propositions/${id}/`);
        const updatedProposition = response.data;

        if (updatedProposition.status_display !== status_display) {
          setCurrentOffer((prevOffer) => ({
            ...prevOffer,
            proposition: updatedProposition,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch proposition:", error);
        if (intervalId) clearInterval(intervalId);
      }
    };

    if (status_display === "Pending") {
      intervalId = setInterval(fetchProposition, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, status_display]);

  return currentOffer;
};
