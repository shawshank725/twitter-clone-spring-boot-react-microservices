import { X } from 'lucide-react';
import '@styles/components-styles/PhotoViewer.css';

type PhotoViewerProp = {
    selectedPhoto: string;
    setSelectedPhoto:(selectedPhoto: string)=> void;
    isVisible: boolean;
    setVisibilty:(isVisible: boolean)=> void;
    refer: React.RefObject<HTMLDivElement | null>;
}

export default function PhotoViewer({selectedPhoto,setSelectedPhoto, isVisible, setVisibilty, refer}: PhotoViewerProp) {
    return (
        <div className="photoViewerContainer" >
            <div className='photoViewerInnerContainer'>
                <X className='closePhotoViewerButton' onClick={()=> {setVisibilty(!isVisible); setSelectedPhoto("")}}/>
                <div className='photoContainer' ref={refer}>
                    <img  src={selectedPhoto} className='selectedPhoto'/>
                </div>
            </div>
        </div>
    )
}