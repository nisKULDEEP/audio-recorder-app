import { BrowserRouter } from 'react-router-dom';
import MyRoutes from './routes/MyRoutes';
import store from './store/store';
import { Provider } from 'react-redux';
import Header from './component/Header';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Header />
                <MyRoutes />
            </Provider>
        </BrowserRouter>
    );
}

export default App;
