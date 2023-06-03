import { BrowserRouter } from 'react-router-dom';
import Routes from './router';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const App = () => {
    const queryClient = new QueryClient();

    return (
        <div className="App">
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <RecoilRoot>
                    <BrowserRouter>
                        <Routes />
                    </BrowserRouter>
                </RecoilRoot>
            </QueryClientProvider>
        </div>
    );
};

export default App;
