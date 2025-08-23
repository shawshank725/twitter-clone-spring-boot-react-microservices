import { useState } from 'react';
import '@/styles/pages-styles/LoginPage.css';
import type { LoginUser } from '@/types/Users/LoginUser';
import { login } from '@/api/service/UserService';
import { useLoginValidation } from '@hooks/useLoginValidation';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';

const LoginPage = () => {
    const [user, setUser] = useState<LoginUser>({password: "", username: ""});
    const [showPassword, setShowPassword] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const { validate } = useLoginValidation(user);

    const navigate = useNavigate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) return;

        setIsDisabled(true);

        try {
            const result = await login(user); 
            if (result?.data) {
                localStorage.setItem("authToken", result.data);
                navigate("/home", { replace: true });
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Incorrect username or password.");
            setIsDisabled(false);
        }
    };


    const togglePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowPassword(e.target.checked);
    };

    return (
        <div className="container">
            <div className="formContainer">
                <p className='createAccountHeading'>Sign in to our App</p>
                <form className="form" onSubmit={handleSubmit}>
                    <div className='textfieldsContainer'>
                        <TextField type='text' label="Username" 
                                        id='username'
                                        name='username'
                                        value={user.username}
                                        onChange={handleChange} className='usernameTextField'/>
                        <div className='passwordContainer'>
                            <div className='passwordWrapper'>
                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    label="Password"
                                    id='password'
                                    name='password'
                                    value={user.password}
                                    onChange={handleChange}
                                    className='passwordTextField'
                                    fullWidth
                                />
                                <input
                                    type='checkbox'
                                    className='checkboxInput'
                                    checked={showPassword}
                                    onChange={togglePassword}
                                />
                            </div>
                        </div>
                    </div>
                    

                    <div className='buttonContainer'>
                        <button className='submitButton' disabled={isDisabled} type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
