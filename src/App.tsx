import { BrowserRouter } from 'react-router-dom';
import MyRoutes from './routes/MyRoutes';
import store from './store/store';
import { Provider } from 'react-redux';
import Header from './component/Header';
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Toaster />
                <Header />
                <MyRoutes />
            </Provider>
        </BrowserRouter>
    );
}

export default App;
