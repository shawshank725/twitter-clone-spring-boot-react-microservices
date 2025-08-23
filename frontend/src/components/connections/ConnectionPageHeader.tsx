import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import '@/styles/components-styles/connections/ConnectionPageHeader.css';

type ConnectionPageHeaderProps = {
    previousPageUrl: string;
    username:string;
    name:string;
}

export default function ConnectionPageHeader({previousPageUrl, username, name}: ConnectionPageHeaderProps) {
    const navigate = useNavigate();
    return (
        <div className="connectionPageHeader">
            <div className="arrowLeftConnectionHeaderContainer" onClick={()=> {
                navigate(previousPageUrl);
            }}>
                <ArrowLeft className="arrowLeftConnectionHeader" />
            </div>
            <div className="userInfoConnectionHeaderContainer">
                <span className="userNameTextConnectionHeader">{name}</span>
                <span className="usernameTextConnectionHeader">@{username}</span>
            </div>
        </div>
    )
}