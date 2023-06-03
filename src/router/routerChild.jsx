import CloneCode from '../pages/CloneCode';
import Library from '../pages/Library';

export const children = [
    {
        path: '/shared-library',
        text: 'Select single locale in XML file',
        element: <Library />
    },
    {
        path: '/clone-code',
        text: 'Clone code from Bitbucket',
        element: <CloneCode />
    }
];
