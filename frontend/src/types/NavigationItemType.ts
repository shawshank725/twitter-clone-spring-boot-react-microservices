import type { ReactNode } from "react";

export type NavigationItemType = {
  title: string;
  icon?: ReactNode;
  action?: () => void;
};