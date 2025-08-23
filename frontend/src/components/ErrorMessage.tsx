import "@styles/components-styles/ErrorMessage.css";

type ErrorProp = {
    title: string;
    message:string;
}
export default function ErrorMessage({title, message}: ErrorProp) {
    return (
        <div className="errorPageContainer">
            <p className="errorTitle">{title}</p>
            <p className="errorMessage">{message}</p>
        </div>
    )
}