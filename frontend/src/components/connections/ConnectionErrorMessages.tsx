import '@/styles/components-styles/connections/ConnectionErrorMessages.css';
import type { User } from '@/types/Users/User';
import ConnectionPageHeader from '@/components/connections/ConnectionPageHeader';

type ConnectionErrorMessagesProps = {
    heading: string;
    message:string;
    userInfo?:User;
}
export default function ConnectionErrorMessages({heading, message, userInfo}: ConnectionErrorMessagesProps) {
    return (
        <div className="connectionMessageContainer">
            <ConnectionPageHeader 
                        previousPageUrl={`/${userInfo?.username}`} 
                        username={userInfo?.username!} 
                        name={userInfo?.name ?? ""} 
                    />
            <div className='messageContainer'>
                <div className="connectionErrorHeading">{heading}</div>
                <div className="connectionErrorMessage">{message}</div>
            </div>
        </div>
    )
}