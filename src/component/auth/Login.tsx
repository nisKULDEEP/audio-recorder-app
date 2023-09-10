import { useState } from 'react';
import ContentWrapper from '../ContentWrapper';
import axiosInstance from '../../store/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../store/authReducer';
import './index.css';
import toast from 'react-hot-toast';
import { ResponseType } from '../interface';
import axios from 'axios';

const Login = () => {
    const [userDetails, setUserDetails] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res: ResponseType = await axiosInstance.post(
                '/users/signin',
                {
                    ...userDetails
                }
            );

            if (res?.error) {
                throw res.error.response.data.message || 'signup error';
            }
            localStorage.setItem('token', 'Bearer ' + res.data.token);

            axiosInstance.interceptors.request.use(
                (config) => {
                    config.headers['token'] = 'Bearer ' + res.data.token;
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );

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
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setIsLoading(false);
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
                <button
                    onClick={handleLogin}
                    className="login-button"
                    disabled={
                        isLoading &&
                        !(userDetails.email && userDetails.password)
                    }
                >
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
