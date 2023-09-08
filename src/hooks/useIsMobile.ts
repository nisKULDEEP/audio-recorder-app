import { useEffect, useState } from 'react';

const useIsMobile = () => {
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    const checkScreenSize = () => {
        const isSmallScreen =
            window.innerWidth <= 768 || window.innerHeight <= 768;
        setIsMobileOrTablet(isSmallScreen);
    };

    useEffect(() => {
        // Initial check on component mount
        checkScreenSize();

        // Add an event listener for window resizing
        window.addEventListener('resize', checkScreenSize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return isMobileOrTablet;
};

export default useIsMobile;
