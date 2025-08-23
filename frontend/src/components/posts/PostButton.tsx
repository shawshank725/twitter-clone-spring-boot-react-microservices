import { FeatherIcon } from "@constants/FeatherIcon";
import "@styles/components-styles/posts/PostButton.css";

type ButtonProp = {
    value:boolean;
    setValue:(value: boolean)=> void;
}

export default function PostButton({value, setValue}: ButtonProp) {
    
    return (
        <div className="postButtonContainer">
            <button className="postButton" onClick={()=> {setValue(!value)}}>
                <div className="featherIconContainer">{FeatherIcon}</div>
                <p className="postButtonText">Post</p>    
            </button>
        </div>
    );
}