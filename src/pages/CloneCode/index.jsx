import { getAllRepos, getAllWorkspaces } from '../../services/bitbucket';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Card, Checkbox, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import '../../styles/cloneCode.scss';
import { useSetRecoilState } from 'recoil';
import { loading } from '../../store/atom';

const CloneCode = () => {
    const { /* handleSubmit, */ watch, control, setValue } = useForm();
    const [authorizeError, setAuthorizeError] = useState(false);
    const [getRepoError, setGetRepoError] = useState(false);
    const setLoadingState = useSetRecoilState(loading);
    const [workspaces, setWorkspaces] = useState([]);
    const [repos, setRepos] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

    const handleAuth = async () => {
        setLoadingState(true);
        setWorkspaces([]);
        setValue('workspace', undefined);
        setAuthorizeError(false);
        setGetRepoError(false);
        setRepos([]);
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
                setRepos(
                    allRepos.map((item) => {
                        return {
                            value: item?.name,
                            link: item?.links?.html?.href,
                            clone: {
                                https: item?.links?.clone.find((el) => el.name === 'https')?.href || '',
                                ssh: item?.links?.clone.find((el) => el.name === 'ssh')?.href || ''
                            }
                        };
                    })
                );
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
        setCheckedList(e.target.checked ? repos.map((el) => el.value) : []);
        setCheckAll(e.target.checked);
    };

    const handleCheckboxChange = (value) => {
        setCheckedList(value);
        setCheckAll(value.length === repos.length);
    };

    console.log(repos);

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
                        <Row>
                            <Col span={4}>
                                <Checkbox
                                    indeterminate={checkedList.length > 0 && checkedList.length < repos.length}
                                    onChange={handleCheckAll}
                                    checked={checkAll}
                                >
                                    {`Select all (${repos.length})`}
                                </Checkbox>
                            </Col>
                        </Row>
                    }
                >
                    <Checkbox.Group value={checkedList} onChange={handleCheckboxChange}>
                        <Row>
                            {repos.map((item) => (
                                <Col key={item.value} span={8}>
                                    <Checkbox value={item.value}>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                            {item.value}
                                        </a>
                                    </Checkbox>
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
