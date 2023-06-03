import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Select, Upload, Input } from 'antd';
import { executeFile } from '../../helpers/xmlUtils';
import { getAllLocale, keepAllContentByLocale } from '../../helpers/xmlHelpers';
import { downloadXMLfile } from '../../helpers/fileHelpers';
import { useSetRecoilState } from 'recoil';
import { loading } from '../../store/atom';

const LibraryForm = () => {
    const [fileList, setFileList] = useState([]);
    const [locales, setLocales] = useState([]);
    const [selectedLocale, setSelectedLocale] = useState('');
    const [fileName, setFileName] = useState('');
    const setLoadingState = useSetRecoilState(loading);

    const props = {
        onRemove: () => {
            setFileList([]);
            setLocales([]);
            setSelectedLocale('');
        },
        beforeUpload: (file) => {
            setFileList([file]);

            return false;
        },
        onChange: async (event) => {
            setLocales([]);
            setSelectedLocale('');
            if (!event.fileList?.length) return;
            setLoadingState(true);
            const [contents] = await executeFile(fileList);
            const allLocale = await getAllLocale(contents);

            setLocales(allLocale);
            setLoadingState(false);
        },
        fileList
    };

    const handleSelectLocale = (selectedData) => {
        setSelectedLocale(selectedData);
    };

    const handleCreateNewFile = async () => {
        setLoadingState(true);
        const [contents, root, xmlDoc] = await executeFile(fileList);
        keepAllContentByLocale(contents, root, selectedLocale);
        downloadXMLfile(xmlDoc, fileName);
        setLoadingState(false);
    };

    return (
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Form.Item label="Select XML file">
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
            </Form.Item>
            <Form.Item label="Select locale">
                <Select disabled={locales.length <= 0} onChange={handleSelectLocale} value={selectedLocale}>
                    {locales.map((locale) => (
                        <Select.Option value={locale} key={locale} selected={locale === selectedLocale}>
                            {locale}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="Output name">
                <Input value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </Form.Item>
            <Form.Item label="Button">
                <Button disabled={!selectedLocale || !fileName} onClick={handleCreateNewFile}>
                    Execute
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LibraryForm;
