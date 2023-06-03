import { useRoutes } from 'react-router-dom';
import Layout from '../layout';
import { children } from './routerChild';
import Home from '../pages/Home';

const Routes = () => {
    return useRoutes([
        {
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                ...children
            ]
        }
    ]);
};

export default Routes;
