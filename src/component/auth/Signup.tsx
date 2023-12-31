import { useState } from 'react';
import ContentWrapper from '../ContentWrapper';
import axiosInstance from '../../store/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../store/authReducer';

import './index.css';
import toast from 'react-hot-toast';
import { ResponseType } from '../interface';

const Signup = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const res: ResponseType = await axiosInstance.post(
                '/users/signup',
                {
                    ...userDetails
                }
            );

            if (res?.error) {
                console.log(res);
                throw res?.error;
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
            toast.success('Signup successful');
            navigate('/');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'signup error');
        }
    };
    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    return (
        <ContentWrapper>
            <div className="login-container">
                <h2>Signup Page</h2>
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
                    disabled={!(userDetails.email && userDetails.password)}
                    className="login-button"
                >
                    SignUp
                </button>
                <p className="message">
                    Already registered?{' '}
                    <a onClick={() => navigate('/login')}>Log in</a>
                </p>
            </div>
        </ContentWrapper>
    );
};

export default Signup;
