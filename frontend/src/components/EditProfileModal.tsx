import { TextField } from "@mui/material";
import { Camera, X } from "lucide-react";
import type { User } from "@/types/Users/User";
import '@styles/components-styles/EditModal.css';
import { backgroundPhotoUrlConstant, profilePhotoUrlConstant } from "@/constants/PhotoUrls";
import { deleteMedia } from "@/api/service/MediaService";
import { toast } from "react-toastify";
import { useState } from "react";
import ImageCropper from "./ImageCropper";

type EditProfileModalParts = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    editableUserInfo: User | null;
    setEditableUserInfo: (user: User) => void;

    profilePhotoRef: React.RefObject<HTMLInputElement | null>;
    backgroundPhotoRef: React.RefObject<HTMLInputElement |null>;

    setProfilePhoto: (file: File) => void;
    setBackgroundPhoto: (file: File) => void;

    closeModal: () => void;
    // refer: React.RefObject<HTMLDivElement | null>;
};

export default function EditProfileModal({
    handleSubmit,
    handleChange,
    editableUserInfo,
    setEditableUserInfo,
    profilePhotoRef,
    backgroundPhotoRef,
    setProfilePhoto,
    setBackgroundPhoto,
    closeModal,
    // refer
}: EditProfileModalParts) {

    const [showImageCropper, setShowImageCropper] = useState<boolean>(false);
    const [profilePhotoImageCropper, setProfilePhotoImageCropper] = useState<File>();

    return (
        <div className="editModalContainer">
            <div className="editModalCurverContainer">
                <form onSubmit={handleSubmit}>
                    <div className="editModal">
                        <div className="closeIconHeadingContainer">
                            <X
                                color="black"
                                className="closeIconForModal"
                                onClick={closeModal}
                            />
                            <p>Edit your profile</p>
                            <button className="saveProfileChangesButton" type="submit">
                                Save
                            </button>
                        </div>

                        <div className="userInformationContainer">
                            <div className="backgroundProfilephotoContainer">
                                <div className="backgroundPhotoContainerModal">
                                    <img src={editableUserInfo?.backgroundPhoto} className="backgroundPhotoModal" />
                                    <div className="cameraContainer">
                                        <input
                                            ref={backgroundPhotoRef}
                                            hidden
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            name="backgroundPhoto"
                                            onChange={(event) => {
                                                const file = event?.target?.files?.[0];
                                                if (file) {
                                                    setBackgroundPhoto(file);
                                                    const previewURL = URL.createObjectURL(file);
                                                    setEditableUserInfo({
                                                        ...editableUserInfo!,
                                                        backgroundPhoto: previewURL
                                                    });
                                                }
                                            }}
                                        />
                                        <Camera color="white" onClick={() => backgroundPhotoRef.current?.click()} />
                                    </div>
                                </div>

                                <div className="profilePhotoContainerModal">
                                    <img src={editableUserInfo?.profilePhoto} className="profilePhotoModal" />
                                    <div className="cameraContainer">
                                        <input
                                            ref={profilePhotoRef}
                                            hidden
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            name="profilePhoto"
                                            onChange={(event) => {
                                                const file = event?.target?.files?.[0];

                                                if (file) {
                                                    setProfilePhoto(file);
                                                    const previewURL = URL.createObjectURL(file);
                                                    setEditableUserInfo({
                                                        ...editableUserInfo!,
                                                        profilePhoto: previewURL
                                                    });
                                                    setProfilePhotoImageCropper(file);
                                                    setShowImageCropper(true);
                                                }
                                            }}
                                        />
                                        <Camera color="white" onClick={() => profilePhotoRef.current?.click()} />
                                    </div>
                                </div>
                            </div>
                            <div className="bioLocationWebsiteContainers">
                                <div className="photoRemovalButtonContainer">
                                    <button
                                        type="button"
                                        className="removePhotoButton"
                                        onClick={async () => {
                                            if (editableUserInfo?.profilePhoto && editableUserInfo.profilePhoto !== profilePhotoUrlConstant) {
                                                try {
                                                    await deleteMedia(editableUserInfo.profilePhoto); 
                                                    toast("Background photo removed!");
                                                } catch (err) {
                                                    console.error("Error deleting profile photo:", err);
                                                }
                                            }
                                            else {
                                                toast("Profile photo is already removed.");
                                            }
                                            // Reset to default placeholder
                                            setEditableUserInfo({
                                            ...editableUserInfo!,
                                            profilePhoto: profilePhotoUrlConstant,
                                            });
                                        }}
                                    >
                                        Remove Profile Photo
                                    </button>

                                    <button
                                        type="button"
                                        className="removePhotoButton"
                                        onClick={async () => {
                                            if (editableUserInfo?.backgroundPhoto && editableUserInfo.backgroundPhoto !== backgroundPhotoUrlConstant) {
                                                try {
                                                    await deleteMedia(editableUserInfo.backgroundPhoto);
                                                    toast("Background photo removed!");
                                                } catch (err) {
                                                    console.error("Error deleting background photo:", err);
                                                }
                                            }
                                            else {
                                                toast("Background photo is already removed.");
                                            }
                                            setEditableUserInfo({
                                            ...editableUserInfo!,
                                            backgroundPhoto: backgroundPhotoUrlConstant,
                                            });
                                        }}
                                    >
                                        Remove Background Photo
                                    </button>

                                </div>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    name="name"
                                    value={editableUserInfo?.name || ""}
                                    fullWidth
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Bio"
                                    variant="outlined"
                                    fullWidth
                                    name="bio"
                                    value={editableUserInfo?.bio || ""}
                                    className="bioTextField"
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Website"
                                    variant="outlined"
                                    fullWidth
                                    className="websiteTextField"
                                    onChange={handleChange}
                                    name="website"
                                    value={editableUserInfo?.website || ""}
                                />
                                <TextField
                                    label="Location"
                                    variant="outlined"
                                    fullWidth
                                    className="locationTextField"
                                    onChange={handleChange}
                                    name="location"
                                    value={editableUserInfo?.location || ""}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {
                profilePhotoImageCropper &&
                showImageCropper &&
                <ImageCropper 
                    file={profilePhotoImageCropper} 
                    closeImageCropModal={setShowImageCropper}
                    setCroppedFile={(croppedFile) => {
                        setProfilePhoto(croppedFile);
                        const previewURL = URL.createObjectURL(croppedFile);
                        setEditableUserInfo({
                            ...editableUserInfo!,
                            profilePhoto: previewURL
                        });
                    }}
                />
            }
        </div>
    );
}
