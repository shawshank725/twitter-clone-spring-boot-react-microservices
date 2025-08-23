import { OrbitProgress } from "react-loading-indicators";
import '@/styles/pages-styles/LoadingScreen.css';

type LoadingScreenProps = {
    text?: string;
}

export default function LoadingScreen({text}: LoadingScreenProps) {
    return (
        <div className="loadingScreenContainer">
            <div className="loaderContainer">
                <OrbitProgress dense color="#1DA1F2" size="medium" text="" textColor=""/>
                {
                    text && <p>{text}</p>
                }
            </div>
        </div>
    )
}