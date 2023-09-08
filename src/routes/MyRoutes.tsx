import { Route, Routes } from 'react-router-dom';
import Recorder from '../component/Recorder';
import Login from '../component/auth/Login';
import Signup from '../component/auth/Signup';
import History from '../component/History';

const MyRoutes = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/history" element={<History />} />
        <Route path="/" element={<Recorder />} />
    </Routes>
);

export default MyRoutes;
