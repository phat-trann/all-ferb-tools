import { useRoutes } from 'react-router-dom';
import Layout from '../layout';
import Home from '../pages/Home';
import Library from '../pages/Library';

const Routes = () => {
    return useRoutes([
        {
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '/shared-library',
                    element: <Library />
                }
                // {
                //   path: '/follow',
                //   element: <Follow />,
                // },
                // {
                //   path: '/search',
                //   element: <Search />,
                // },
                // {
                //   path: '/activity',
                //   element: <Activity />,
                // },
                // {
                //   path: '/setting',
                //   element: <Setting />,
                // },
                // {
                //   path: '/notice',
                //   element: <Notice />,
                // },
                // {
                //   path: '/language',
                //   element: <Language />,
                // },
                // {
                //   path: '/user',
                //   element: <User />,
                // },
                // {
                //   path: ':id',
                //   children: [
                //     { path: '', element: <ComicDetail /> },
                //     {
                //       path: ':chap',
                //       element: <Chapters />,
                //     },
                //   ],
                // },
            ]
        }
    ]);
};

export default Routes;
