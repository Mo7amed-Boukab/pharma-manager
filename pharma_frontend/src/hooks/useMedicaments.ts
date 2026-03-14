import { useContext } from "react";
import { MedicamentsContext } from "../context/MedicamentsContext";

export function useMedicaments() {
  const context = useContext(MedicamentsContext);
  if (!context) {
    throw new Error("useMedicaments must be used within MedicamentsProvider");
  }
  return context;
}
