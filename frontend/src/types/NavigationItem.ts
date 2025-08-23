import type { ReactNode } from "react";

export type NavigationItem = {
    title: string;
    onClickAction?: () => void;
    iconOutlined: ReactNode;
    iconSolid: ReactNode;
    url: string;
}