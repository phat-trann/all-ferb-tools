import { getAllBranches, getAllRepos, getAllWorkspaces } from '../../services/bitbucket';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Card, Checkbox, Col, Dropdown, Form, Input, Modal, Row, Select, Space } from 'antd';
import '../../styles/cloneCode.scss';
import { useSetRecoilState } from 'recoil';
import { loading } from '../../store/atom';
import { DownOutlined } from '@ant-design/icons';
import { downloadFile } from '../../helpers/fileHelpers';

const CloneCode = () => {
    const { watch, control, setValue } = useForm();
    const [authorizeError, setAuthorizeError] = useState(false);
    const [getRepoError, setGetRepoError] = useState(false);
    const setLoadingState = useSetRecoilState(loading);
    const [workspaces, setWorkspaces] = useState([]);
    const [repos, setRepos] = useState([]);
    const [reposData, setReposData] = useState({});
    const [checkAll, setCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

    const handleAuth = async () => {
        setLoadingState(true);
        setWorkspaces([]);
        setValue('workspace', undefined);
        setAuthorizeError(false);
        setGetRepoError(false);
        setRepos([]);
        setCheckedList([]);
        try {
            const data = await getAllWorkspaces(watch('username'), watch('password'));

            if (data?.data?.values?.length > 0) {
                const allWorkspace = data.data.values;

                setWorkspaces(
                    allWorkspace.map((ws) => {
                        return {
                            value: ws.slug,
                            label: `${ws.name} (${ws.slug})`
                        };
                    })
                );

                setValue('workspace', allWorkspace[0].slug);
            } else {
                Modal.error({
                    title: 'Not found',
                    content: 'Can not found any workspace'
                });
                setAuthorizeError(true);
            }
        } catch (e) {
            Modal.error({
                title: e?.message || 'This is an error message',
                content: e?.response?.data || 'Something wrong!!'
            });
            setAuthorizeError(true);
        }
        setLoadingState(false);
    };

    const handleGetAllRepo = async () => {
        setLoadingState(true);
        setGetRepoError(false);
        setRepos([]);
        setReposData({});
        try {
            let allRepos = [];
            let page = 1;
            let apiData;

            do {
                apiData = await getAllRepos(watch('username'), watch('password'), watch('workspace'), page);
                allRepos = [...allRepos, ...(apiData?.data?.values || [])];
                page++;
            } while (apiData?.data?.next);

            if (allRepos?.length > 0) {
                const repos = [];
                const reposRawData = {};

                allRepos.forEach((repo) => {
                    reposRawData[repo?.name || 'error'] = {
                        link: repo?.links?.html?.href,
                        clone: {
                            https: repo?.links?.clone.find((el) => el.name === 'https')?.href || '',
                            ssh: repo?.links?.clone.find((el) => el.name === 'ssh')?.href || ''
                        }
                    };

                    repos.push(repo?.name);
                });

                setReposData(reposRawData);
                setRepos(repos);
            } else {
                Modal.error({
                    title: 'Not found',
                    content: 'Can not found any repository in this workspace'
                });
                setGetRepoError(true);
            }
        } catch (e) {
            Modal.error({
                title: e?.message || 'This is an error message',
                content: e?.response?.data || 'Something wrong!!'
            });
            setGetRepoError(true);
        }
        setLoadingState(false);
    };

    const handleCheckAll = (e) => {
        setCheckedList(e.target.checked ? repos.map((el) => el) : []);
        setCheckAll(e.target.checked);
    };

    const handleCheckboxChange = (value) => {
        setCheckedList(value);
        setCheckAll(value.length === repos.length);
    };

    const handleAfterSelect = async (method) => {
        setLoadingState(true);
        const specialRepoInfo = {};

        await Promise.all(
            checkedList.map(
                async (cartridge) =>
                    await getAllBranches(watch('username'), watch('password'), watch('workspace'), cartridge)
            )
        ).then((values) => {
            values.forEach((getBranchRes) => {
                const allBranches = getBranchRes?.data?.values;
                const specialBranch = allBranches.find((getBranchRes) => getBranchRes.name.includes('3.3'));

                if (specialBranch) {
                    specialRepoInfo[allBranches?.[0]?.target?.repository?.name || 'error'] = specialBranch?.name;
                }
            });
        });

        const shData = checkedList
            .map((el) => {
                return (
                    `echo "\\033[32mStart clone ${el} - Method: ${method.toUpperCase()} ---- \\033[0m"\necho ""` +
                    '\ngit clone ' +
                    reposData?.[el]?.clone?.[method] +
                    (specialRepoInfo?.[el] !== undefined
                        ? `\ncd ${el}\ngit checkout ${specialRepoInfo?.[el]}\ncd ../`
                        : '') +
                    `\necho ""\necho "\\033[35mDONE: ${el}\\033[0m"\necho "----------------------------"`
                );
            })
            .join('\n');

        await downloadFile(shData, 'cloneCode.sh');
        setLoadingState(false);
    };

    const handleCheckExisted = async () => {
        setLoadingState(true);

        try {
            const folderData = await window.showDirectoryPicker();
            let notExistedFolder = [];

            for (const folderName of repos) {
                try {
                    await folderData.getDirectoryHandle(folderName);
                } catch (error) {
                    notExistedFolder.push(folderName);
                }
            }

            setCheckedList(notExistedFolder);
            setCheckAll(notExistedFolder.length === repos.length);
        } catch (error) {
            Modal.error({
                title: error?.name || 'This is an error message',
                content: error?.message || 'Something wrong!!'
            });

            console.dir(error)
        }

        setLoadingState(false);
    };

    return (
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className="form-container">
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Card title="Authorization">
                    <Form.Item
                        label="Username"
                        name="username"
                        required
                        tooltip={
                            <a
                                className="tooltip"
                                href="https://bitbucket.org/account/settings/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Get user name
                            </a>
                        }
                    >
                        <Controller name="username" control={control} render={({ field }) => <Input {...field} />} />
                    </Form.Item>

                    <Form.Item
                        label="App Password"
                        name="password"
                        required
                        tooltip={
                            <a
                                className="tooltip"
                                href="https://bitbucket.org/account/settings/app-passwords/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Get / Create App password
                            </a>
                        }
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => <Input.Password {...field} />}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                        <Button
                            type="primary"
                            danger={authorizeError}
                            disabled={!(watch('username') && watch('password'))}
                            onClick={handleAuth}
                        >
                            Authorize
                        </Button>
                    </Form.Item>
                </Card>
                <Card title="Get repositories">
                    <Form.Item label={`Workspace (${workspaces.length})`} name="workspace" required>
                        <Controller
                            name="workspace"
                            control={control}
                            render={({ field }) => <Select options={workspaces} {...field} />}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                        <Button
                            type="primary"
                            danger={getRepoError}
                            disabled={!watch('workspace')}
                            onClick={handleGetAllRepo}
                        >
                            Get all repositories
                        </Button>
                    </Form.Item>
                </Card>
                <Card
                    title={
                        <Row justify="center" align="center">
                            <Col span={4}>
                                <Space>
                                    <Checkbox
                                        indeterminate={checkedList.length > 0 && checkedList.length < repos.length}
                                        onChange={handleCheckAll}
                                        checked={checkAll}
                                    >
                                        {`Select all (${checkedList.length || 0} | ${repos.length})`}
                                    </Checkbox>
                                </Space>
                            </Col>
                            <Col span={20}>
                                <Row justify="end">
                                    <Col>
                                        <Space>
                                            <Button
                                                type="primary"
                                                onClick={handleCheckExisted}
                                                disabled={repos.length <= 0}
                                            >
                                                Select not existed
                                            </Button>
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        {
                                                            label: 'SSH',
                                                            key: 'ssh'
                                                        },
                                                        {
                                                            label: 'HTTPS',
                                                            key: 'https'
                                                        }
                                                    ],
                                                    onClick: ({ key }) => {
                                                        handleAfterSelect(key);
                                                    }
                                                }}
                                                disabled={repos.length <= 0 || checkedList.length <= 0}
                                            >
                                                <Button>
                                                    <Space>
                                                        Clone code
                                                        <DownOutlined />
                                                    </Space>
                                                </Button>
                                            </Dropdown>
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    }
                >
                    <Checkbox.Group value={checkedList} onChange={handleCheckboxChange}>
                        <Row>
                            {repos.map((repo) => (
                                <Col key={repo} span={8}>
                                    <Checkbox value={repo}>{repo}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Card>
            </Space>
        </Form>
    );
};

export default CloneCode;
