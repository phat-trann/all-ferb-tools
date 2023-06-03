import { useState } from 'react';
import Layout, { Content, /* Footer, */ Header } from 'antd/es/layout/layout';
import { Link, Outlet } from 'react-router-dom';
import { Image, Row, Col } from 'antd';
import '../styles/global.scss';
import { useRecoilState } from 'recoil';
import { loading } from '../store/atom';
import LoadingComponent from '../components/Loading';

const LayoutComponent = () => {
    const [visible, setVisible] = useState(false);
    const [loadingState] = useRecoilState(loading);

    return (
        <Layout className="container">
            {loadingState && <LoadingComponent />}
            <Header className="header">
                <Link to="/">
                    <Image preview={false} width={30} src="public/logo.svg" />
                </Link>
                <Link to="/shared-library">Select Locale in Shared library</Link>
            </Header>
            <Layout>
                <Content>
                    <Row>
                        <Col span={6}>
                            <Image
                                preview={{ visible: false }}
                                width="auto"
                                src="public/donate.JPG"
                                onClick={() => setVisible(true)}
                            />
                            <div style={{ display: 'none' }}>
                                <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
                                    <Image src="public/donate.JPG" />
                                </Image.PreviewGroup>
                            </div>
                        </Col>
                        <Col span={18} className="library-container">
                            <Outlet />
                        </Col>
                    </Row>
                </Content>
            </Layout>
            {/* <Footer className='footer'>
                There isn't footer yet
            </Footer> */}
        </Layout>
    );
};

export default LayoutComponent;
