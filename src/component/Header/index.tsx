import { useSelector } from 'react-redux';
import { selectLoggedIn } from '../../store/authReducer';
import { Link, useNavigate } from 'react-router-dom';
import ContentWrapper from '../ContentWrapper';
import useIsMobile from '../../hooks/useIsMobile';
import './index.css';

const Header = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    console.log('isMobile', isMobile);

    return (
        <div className="header-parent-container">
            <ContentWrapper>
                <div className="header-container">
                    <h3 className="title" onClick={() => navigate('/')}>
                        Audio Recorder
                    </h3>
                    {!isLoggedIn && (
                        <div className="navigation-links">
                            <Link to={'/history'}>
                                <div>History </div>
                            </Link>
                            <Link to={'/login'}>Logout</Link>
                        </div>
                    )}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default Header;
