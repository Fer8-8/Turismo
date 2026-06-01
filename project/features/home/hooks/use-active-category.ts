import { useCallback, useRef, useState } from "react";
import { CATEGORIES } from "../constants/categories";

type CategoryId = (typeof CATEGORIES)[number]["id"];

export function useActiveCategory() {
  const [activeTab, setActiveTab] = useState(0);
  const activeCategory = CATEGORIES[activeTab].id;

  // Track which categories have been visited so we only mount them once.
  const mountedRef = useRef<Set<CategoryId>>(new Set([activeCategory]));

  const handleTabChange = useCallback((index: number) => {
    mountedRef.current.add(CATEGORIES[index].id);
    setActiveTab(index);
  }, []);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    activeCategory,
    isMounted: (id: CategoryId) => mountedRef.current.has(id),
  };
}
