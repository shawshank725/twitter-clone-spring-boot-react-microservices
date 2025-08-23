import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/pages-styles/SettingsPage.css";
import { useAuth } from "@/context/AuthContext";
import { changePassword, deleteUserAccount, getAllUsernames, updateUsername } from "@/api/service/UserService";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { deleteAllUsersPosts } from "@/api/service/PostingService";

export default function SettingsPage() {
    useEffect(() => { document.title = "Settings" }, []);
    const navigate = useNavigate();

    const { authUser } = useAuth();
    const usernameOld = authUser?.username ?? "";
    const [username, setUsername] = useState<string>(usernameOld);
    const [password, setPassword] = useState<string>("");

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    const [passwordForDeleting, setPasswordForDeleting] = useState<string>("");

    const [usernameFound, setUsernameFound] = useState<boolean>(false);

    useEffect(() => {
        const checkUsername = async (username: string) => {
            try {
                const result = await getAllUsernames(username);
                if (result.data === true) { setUsernameFound(true); }
                else { setUsernameFound(false); }
            }
            catch (error) {
                console.error(error);
            }
        }
        checkUsername(username);
    }, [username]);

    function validateUsername(username: string, usernameOld: string, usernameFound: boolean): boolean {
        if (!username || username.trim() === "") return false;
        if (username.length > 50) return false;
        if (username === usernameOld) return false;
        if (usernameFound) return false;
        return true;
    }

    async function handleUsernameChange() {
        try {
            if (password) {
                const result = await updateUsername(usernameOld, username, password);
                if (result.data === "success") {
                    localStorage.removeItem("authToken");
                    toast("Your username has been changed successfully! Login again.");
                    setTimeout(() => {
                        window.location.href = "/auth";
                    }, 1500);
                }
                else if (result.data === "failure: passwords don't match") {
                    alert("Entered password is wrong.");
                }
                else {
                    toast("Failed to change the username. Please try again later.");
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function handlePasswordChange() {
        try {
            if (confirmPassword && newPassword && authUser) {
                const result = await changePassword(authUser?.username, confirmPassword, newPassword);
                console.log("THIS IS THE RESULT ", result);
                if (result.data === "success") {
                    toast("Your password has been changed successfully.");
                    setConfirmPassword("");
                    setNewPassword("");
                }
                else {
                    toast("Failed to change the password. Please try again later.");
                }
            }
        }
        catch (error) {

        }
    }
    async function deleteAccount() {
        try {
            if (authUser && passwordForDeleting) {
                const deletingPostsResult = await deleteAllUsersPosts(authUser.id);
                console.log(deletingPostsResult);
                if (deletingPostsResult.data === "success") {
                    const deletingAccountResult = await deleteUserAccount(authUser.username, passwordForDeleting);
                    console.log("THIS ISTHE ACCOUTN RESULT - ", deletingAccountResult);
                    if (deletingAccountResult.data === "success") {
                        localStorage.removeItem("authToken");
                        navigate("/register");
                        toast("Your account has been deleted successfully.");
                    } else if (deletingAccountResult.data === "failure: incorrect password") {
                        toast("Incorrect password. Account not deleted.");
                    } else {
                        toast("Failed to delete your account.");
                    }
                } else {
                    toast("Failed to delete user’s posts, account not deleted.");
                }
            }
        } catch (error) {
            console.error(error);
            toast("An error occurred while deleting your account.");
        }
    }


    return (
        <div className="settingsPageContainer">
            <div className="notificationHeadingContainer">
                <div className="arrowLeftNotificationViewerHeaderContainer">
                    <ArrowLeft
                        className="arrowLeftNotificationViewerHeader"
                        size={20}
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/home');
                            }
                        }}
                    />
                </div>
                <span className="notificationHeaderHeadingSpan">Settings</span>
            </div>

            {/* CHANGING THE USERNAME HERE */}
            <div className="settingsFormContainer">
                <span className="settingsFormHeading">Change username</span>
                <form className="formItself" onSubmit={(e) => {
                    e.preventDefault();
                    handleUsernameChange();
                }}>
                    <div className="formRow">
                        <input
                            type="text"
                            value={username}
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="formInputField" />
                        <button
                            className="formSubmitButton"
                            disabled={!(validateUsername(username, usernameOld, usernameFound) && password && password.trim() !== "")}
                            type="submit"
                        >Change username</button>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                username === "" ? (
                                    <span style={{ color: "red" }}>Username can't be empty</span>
                                ) : username.length > 50 ? (
                                    <span style={{ color: "red" }}>Username must be less than 50 characters</span>
                                ) : username === usernameOld ? (
                                    null
                                ) : usernameFound ? (
                                    <XCircleIcon width={30} color="red" />
                                ) : (
                                    <CheckCircleIcon width={30} color="green" />
                                )
                            }
                        </div>
                    </div>
                    <div className="formRow">
                        <input
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="formInputField" />
                    </div>
                </form>
            </div>

            {/* CHANGE THE PASSWORD */}
            <div className="settingsFormContainer">
                <span className="settingsFormHeading">Change Password</span>
                <form className="formItself" onSubmit={(e) => {
                    e.preventDefault();
                    handlePasswordChange();
                }}>
                    <div className="formRow">
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="formInputField"
                        />
                        <button
                            className="formSubmitButton"
                            disabled={confirmPassword === "" || newPassword === ""}
                        >Change password</button>
                    </div>
                    <div className="formRow">
                        <input
                            type="password"
                            value={newPassword}
                            placeholder="New password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="formInputField"
                        />
                        <button
                            className="formSubmitButton"
                            onClick={() => { setConfirmPassword(""); setNewPassword(""); }}
                        >Clear all</button>
                    </div>
                </form>
            </div>

            {/* DELETING THE ACCOUNT HERE */}
            <div className="settingsFormContainer">
                <span className="settingsFormHeading" style={{ color: 'red' }}>Delete account</span>
                <span style={{ fontWeight: 'bold', fontStyle: 'italic', color: "grey" }}>Note: This account is irreversible.</span>
                <form className="formItself" onSubmit={(e) => {
                    e.preventDefault();
                    deleteAccount();
                }}>
                    <div className="formRow">
                        <input
                            type="password"
                            value={passwordForDeleting}
                            placeholder="Password"
                            onChange={(e) => setPasswordForDeleting(e.target.value)}
                            className="formInputField"
                        />
                        <button
                            className="formSubmitButton"
                            disabled={!passwordForDeleting ? true : false}
                            type="submit"
                        >Delete</button>
                    </div>
                </form>
            </div>
        </div>
    )
}