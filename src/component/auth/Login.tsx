import React, { useState } from 'react';
import ContentWrapper from '../ContentWrapper';
import axiosInstance from '../../store/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../store/authReducer';
import './index.css';
import toast from 'react-hot-toast';

const Login = () => {
    const [userDetails, setUserDetails] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const res = await axiosInstance.post('/users/signin', {
                ...userDetails
            });

            if ('error' in res) {
                throw res.error.response.data.message || 'signup error';
            }
            localStorage.setItem('token', 'Bearer ' + res.data.token);
            axiosInstance.defaults.headers.common['token'] =
                'Bearer ' + res.data.token;
            dispatch(
                setAuthenticated({
                    isLoggedIn: true,
                    user: res?.data?.userDetail?.email,
                    stage: 'AUTHENTICATED',
                    userId: res?.data?.userDetail?._id
                })
            );
            toast.success('Login successful');
            navigate('/');
        } catch (error) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        }
    };
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    return (
        <ContentWrapper>
            <div className="login-container">
                <h2>Login Page</h2>
                <input
                    type="string"
                    placeholder="email"
                    name="email"
                    onChange={handleChange}
                    value={userDetails.email}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                    value={userDetails.password}
                />
                <button onClick={handleLogin} className="login-button">
                    Login
                </button>
                <p className="message">
                    Not registered?{' '}
                    <a onClick={() => navigate('/signup')}>Create an account</a>
                </p>
            </div>
        </ContentWrapper>
    );
};

export default Login;
