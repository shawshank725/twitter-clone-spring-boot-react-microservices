import { useState, useEffect } from "react";
import { getAllUsernames, getAllEmails } from "@/api/service/UserService";
import type { NewUser } from "@/types/Users/NewUser";

export function useRegisterValidation(newUser: NewUser) {
    const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
    const [emailExists, setEmailExists] = useState<boolean | null>(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const usernameRegex =
        /^[\p{L}\p{N}_\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u;

    useEffect(() => {
        async function checkUsername() {
            try {
                const response = await getAllUsernames(newUser.username);
                setUsernameExists(response.data);
            } catch (error) {
                console.error("Username check error:", error);
            }
        }

        async function checkEmail() {
            try {
                const response = await getAllEmails(newUser.email);
                setEmailExists(response.data);
            } catch (error) {
                console.error("Email check error:", error);
            }
        }

        if (newUser.username) checkUsername();
        if (newUser.email) checkEmail();
    }, [newUser.username, newUser.email]);

    const validate = (): boolean => {
        const hasEmptyFields = Object.values(newUser).some(
            (value) => value == null || String(value).trim() === ""
        );

        if (hasEmptyFields) {
            alert("All fields must be filled.");
            return false;
        }

        if (!passwordRegex.test(newUser.password)) {
            alert(
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
            );
            return false;
        }

        if (!emailRegex.test(newUser.email)) {
            alert("Invalid email format.");
            return false;
        }

        if (!usernameRegex.test(newUser.username)) {
            alert(
                "Username can only contain letters, digits, underscores, or emojis. No spaces or special characters allowed."
            );
            return false;
        }

        if (usernameExists === true) {
            alert("Username already exists.");
            return false;
        }

        if (emailExists === true) {
            alert("Email is already registered.");
            return false;
        }

        return true;
    };

    return { validate };
}
