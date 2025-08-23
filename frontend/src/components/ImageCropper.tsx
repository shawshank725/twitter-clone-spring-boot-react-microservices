import "@styles/components-styles/ImageCropper.css";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Cropper from 'react-easy-crop';

type ImageCropperProp = {
    file: File;
    closeImageCropModal: (visible: boolean) => void;
    setCroppedFile: (file: File) => void;
}

export default function ImageCropper({ file, closeImageCropModal, setCroppedFile }: ImageCropperProp) {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropComplete = (_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const getCroppedImg = async (imageSrc: string, crop: any): Promise<File> => {
        const image: HTMLImageElement = await new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Canvas context not available");

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return;
                resolve(new File([blob], file.name, { type: file.type }));
            }, file.type);
        });
    };

    const handleCrop = async () => {
        if (!croppedAreaPixels) return;
        const croppedFile = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels);
        setCroppedFile(croppedFile); // send back to EditProfileModal
        closeImageCropModal(false);  // close the cropper
    };
    
    return (
        <div className="imageCropperOuterContainer">
            <div className="imageCropperHeader">
                <div className="imageCropperHeaderLeftContainer">
                    <ArrowLeft className="arrowLeftImageCropperHeader" color="white" size={20} onClick={() => { closeImageCropModal(false) }} />
                    <span className="cropImageHeading">Crop image</span>
                </div>
                <div>
                    <button className="cropButton"
                        onClick={handleCrop}
                    >Crop</button>
                </div>
            </div>
            <div className="imageDivContainer">
                {/* <img src={URL.createObjectURL(file)} className="imageToBeCropped"/> */}
                <Cropper
                    image={URL.createObjectURL(file)}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
        </div>
    )
}