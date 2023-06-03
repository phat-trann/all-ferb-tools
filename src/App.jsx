import { BrowserRouter } from 'react-router-dom';
import Routes from './router';
import { RecoilRoot } from 'recoil';

const App = () => {
    return (
        <div className="App">
            <RecoilRoot>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </RecoilRoot>
        </div>
    );
};

export default App;
