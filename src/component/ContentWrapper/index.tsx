import React from 'react';
import './index.css';

interface Props {
    children: React.ReactNode;
}

const ContentWrapper: React.FC<Props> = ({ children }) => {
    return <div className="wrapper-container">{children}</div>;
};

export default ContentWrapper;
