import { useNavigate } from "react-router-dom";
import "@/styles/pages-styles/LandingPage.css";

export default function LandingPage () {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="logoContainer">
                <img 
                    src="https://upload.wikimedia.org/wikipedia/sco/9/9f/Twitter_bird_logo_2012.svg" 
                    //src="src\assets\images\Twitter_bird_logo.svg"
                    className="appLogo"
                />
            </div>
            <div className="actionButtonContainer">
                <p className="tagline">Join the chaos.</p>
                <button className="signUpButton" onClick={()=> {navigate("/register")}}>Sign Up</button> 
                <button className="loginButton" onClick={()=> {navigate("/login")}}>Login</button>
            </div>
        </div>
    );
}