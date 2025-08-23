import { useEffect, useState } from "react";
import { getAllUsernames } from "@/api/service/UserService";
import type { LoginUser } from "@/types/Users/LoginUser";

export function useLoginValidation(loginUser: LoginUser) {
    const [usernameExists, setUsernameExists] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkUsername() {
            try {
                const response = await getAllUsernames(loginUser.username);
                setUsernameExists(response.data);
            } catch (error) {
                console.error("Username check error:", error);
            }
        }

        if (loginUser.username) checkUsername();
    }, [loginUser.username]);

    const validate = (): boolean => {
        const hasEmptyFields = Object.values(loginUser).some(
            (value) => value == null || String(value).trim() === ""
        );

        if (hasEmptyFields) {
            alert("All fields must be filled.");
            return false;
        }


        if (usernameExists === false) {      
            alert("No such user with this username found.");      
            return false;
        }

        return true;
    };


    return {validate};
    
}