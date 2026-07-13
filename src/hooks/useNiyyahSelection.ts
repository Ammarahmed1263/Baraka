import { useState, useCallback, useMemo, useEffect } from "react";

export function useNiyyahSelection(initialIds: string[]) {
  const [localSelected, setLocalSelected] = useState<string[]>(initialIds);

  useEffect(() => {
    setLocalSelected(initialIds);
  }, [initialIds]);

  const toggleNiyyah = useCallback((id: string) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const cleanSelected = useMemo(
    () => localSelected.filter((id) => !id.endsWith("_basic")),
    [localSelected]
  );

  const cleanSelectedCount = cleanSelected.length;
  const ajrCount = cleanSelectedCount + 1;

  return {
    localSelected,
    cleanSelected,
    cleanSelectedCount,
    ajrCount,
    toggleNiyyah,
  };
}
