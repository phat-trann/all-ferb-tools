import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Select, Upload, Input } from 'antd';
import { executeFile, removeExtraNewlines } from '../../helpers/xmlUtils';

const LibraryForm = () => {
    const [fileList, setFileList] = useState([]);
    const [locales, setLocales] = useState([]);
    const [selectedLocale, setSelectedLocale] = useState();
    const [fileName, setFileName] = useState('');

    const props = {
        onRemove: () => {
            setFileList([]);
            setLocales([]);
            setSelectedLocale(undefined);
            console.log(fileList)
        },
        beforeUpload: (file) => {
            setFileList([file]);

            return false;
        },
        onChange: () => {
            setLocales([]);
            setSelectedLocale(undefined);
            executeFile(fileList, (contents) => {
                let localeObject = {};

                for (const content of contents) {
                    for (const childNode of content.children) {
                        const langAttribute = childNode.attributes?.['xml:lang']?.value;

                        if (langAttribute) {
                            localeObject = {
                                ...localeObject,
                                [langAttribute]: true
                            };
                        } else if (childNode.children.length > 0) {
                            for (const subChildNote of childNode.children) {
                                const subLangAttribute = subChildNote.attributes?.['xml:lang']?.value;

                                if (subLangAttribute) {
                                    localeObject = {
                                        ...localeObject,
                                        [subLangAttribute]: true
                                    };
                                }
                            }
                        }
                    }
                }

                setLocales(Object.keys(localeObject));
            });
        },
        fileList
    };

    const handleSelectLocale = (selectedData) => {
        setSelectedLocale(selectedData);
    };

    const handleCreateNewFile = () => {
        executeFile(fileList, (contents, root, xmlDoc) => {
            for (let i = contents.length - 1; i >= 0; i--) {
                let isKeep = false;
                const content = contents[i];

                for (let j = content.children.length - 1; j >= 0; j--) {
                    const childNode = content.children[j];
                    const langAttribute = childNode.attributes?.['xml:lang']?.value;

                    if (langAttribute !== selectedLocale) {
                        if (childNode.children.length > 0) {
                            let isRemove = true;

                            for (let k = childNode.children.length - 1; k >= 0; k--) {
                                const subChildNote = childNode.children[k];
                                const subLangAttribute = subChildNote.attributes?.['xml:lang']?.value;

                                if (subLangAttribute === selectedLocale) {
                                    isRemove = false;
                                    isKeep = true;
                                } else {
                                    childNode.removeChild(subChildNote);
                                }
                            }

                            if (isRemove) {
                                content.removeChild(childNode);
                            }
                        } else {
                            content.removeChild(childNode);
                        }
                    } else {
                        isKeep = true;
                    }
                }

                if (!isKeep) {
                    root.removeChild(content);
                }
            }

            const serializedXml = new XMLSerializer().serializeToString(xmlDoc);
            const cleanedXml = removeExtraNewlines(serializedXml);
            const blob = new Blob([cleanedXml], { type: 'text/xml' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'sampleFile' + '.xml';
            a.click();

            URL.revokeObjectURL(url);
        });
    };

    return (
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <div>
                {
                    locales
                }
            </div>
            <Form.Item label="Select XML file">
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
            </Form.Item>
            <Form.Item label="Select locale">
                <Select disabled={locales.length <= 0} onChange={handleSelectLocale}>
                    {locales.map((locale) => (
                        <Select.Option value={locale} key={locale} selected={locale === selectedLocale}>
                            {locale}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item label="File name">
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
