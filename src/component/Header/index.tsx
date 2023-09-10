import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedIn, setAuthenticated } from '../../store/authReducer';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../ContentWrapper';
import axiosInstance from '../../store/axiosConfig';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ResponseType } from '../interface';
import './index.css';

const loginExceptEndpoints = ['/login', '/signup'];

const Header = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axiosInstance.get('users/logout');
            localStorage.removeItem('token');
            dispatch(
                setAuthenticated({
                    isLoggedIn: false,
                    user: '',
                    stage: 'UNAUTHENTICATED',
                    userId: ''
                })
            );
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Something went wrong');
        }
    };

    const handleOnLoadLogin = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res: ResponseType = await axiosInstance.get(
                    '/users/details'
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
            }
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        }
    };

    useEffect(() => {
        handleOnLoadLogin();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (
            !token &&
            !loginExceptEndpoints.includes(window.location.pathname)
        ) {
            dispatch(
                setAuthenticated({
                    isLoggedIn: false,
                    user: '',
                    stage: 'UNAUTHENTICATED',
                    userId: ''
                })
            );
            navigate('/login');
        }
    }, [window.location.pathname]);

    return (
        <div className="header-parent-container">
            <ContentWrapper>
                <div className="header-container">
                    <h3 className="title" onClick={() => navigate('/')}>
                        Audio Recorder
                    </h3>
                    {isLoggedIn && (
                        <div className="navigation-links">
                            <Link to={'/history'}>
                                <div>History </div>
                            </Link>
                            <a onClick={handleLogout}>Logout</a>
                        </div>
                    )}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default Header;
