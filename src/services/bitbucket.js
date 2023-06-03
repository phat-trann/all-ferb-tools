import axios from 'axios';

const axiosBitbucketCall = async (url, method, username, password, params = {}) => {
    return await axios({
        baseURL: url,
        method,
        auth: {
            username,
            password
        },
        params
    });
};

export const getAllWorkspaces = async (username, password) => {
    return await axiosBitbucketCall('https://api.bitbucket.org/2.0/workspaces', 'GET', username, password);
};

export const getAllRepos = async (username, password, workspace, page = 1) => {
    return await axiosBitbucketCall(`https://api.bitbucket.org/2.0/repositories/${workspace}`, 'GET', username, password, {
        pagelen: 100,
        page
    });
};
