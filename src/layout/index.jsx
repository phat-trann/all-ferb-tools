import { useState } from 'react';
import Layout, { Content, /* Footer, */ Header } from 'antd/es/layout/layout';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Image, Row, Col } from 'antd';
import '../styles/global.scss';
import { useRecoilState } from 'recoil';
import { loading } from '../store/atom';
import LoadingComponent from '../components/Loading';
import { children } from '../router/routerChild';

const LayoutComponent = () => {
    const [visible, setVisible] = useState(false);
    const [loadingState] = useRecoilState(loading);

    return (
        <Layout className="container">
            {loadingState && <LoadingComponent />}
            <Header className="header">
                <Link to="/" className="avatar">
                    <Image preview={false} width={30} src="public/logo.svg" />
                </Link>
                {children.map((link) => (
                    <NavLink to={link.path} key={link.path} className={({ isActive }) => isActive && 'active'}>
                        {link.text}
                    </NavLink>
                ))}
            </Header>
            <Layout>
                <Content>
                    <Row>
                        <Col span={4}>
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
                        <Col span={20} className="library-container">
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
