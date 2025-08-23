import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import '@styles/components-styles/posts/PostTextBar.css';
import "react-circular-progressbar/dist/styles.css";

type PostTextProps = {
    percentage: number;
    maxValue: number;
}

export default function PostTextBar ({percentage, maxValue}: PostTextProps) {
    const isLimitReached = percentage > maxValue;

    return (
        <div className="progressBarContainer">
            <CircularProgressbar
                strokeWidth={20}
                value={percentage} 
                maxValue={maxValue}
                styles={buildStyles({
                    pathColor: isLimitReached ? '#e63946' : '#0c7ab6', 
                    trailColor: '#eee',
                })}
            />
            <div className='tooltip'>
                {`${percentage}/${maxValue}`}
            </div>
        </div>
    )
}