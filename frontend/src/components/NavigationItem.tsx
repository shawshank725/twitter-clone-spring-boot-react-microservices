import '@styles/components-styles/Sidebar.css';
import type { NavigationItem } from "@/types/NavigationItem";
import { useNavigate } from "react-router-dom";

type NavigationItemProp = {
    navigationItem: NavigationItem;
    isActive: boolean;
    numberIndicator?: number;
}

export default function NavigationItem( {navigationItem, isActive, numberIndicator}: NavigationItemProp) {
    const navigate = useNavigate();

    return (
        <div className={`navigationItem ${isActive ? "active" : ""}`} onClick={()=> {navigate(navigationItem.url)}}>
            <div className='sidebarNavigationIconContainer'>
                {isActive ? navigationItem.iconSolid : navigationItem.iconOutlined}

                {
                    numberIndicator && (
                        <div className='numberIndicatorContainer'>{numberIndicator}</div>
                    )
                }
            </div>
            <p>{navigationItem.title}</p>
        </div>
    )
}