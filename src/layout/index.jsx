import react from 'react';
import Layout, { Content, /* Footer, */ Header } from 'antd/es/layout/layout';
import { Link, Outlet } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Image } from 'antd';
import '../styles/global.scss';

const index = () => {
    const [visible, setVisible] = react.useState(false);

    return (
        <Layout className="container">
            <Header className="header">
                <Link to="/">
                    <Image
                        preview={false}
                        width={30}
                        src="public/logo.svg"
                    />
                </Link>
                <Link to="/shared-library">Select Locale in Shared library & Category data</Link>
            </Header>
            <Layout hasSider>
                <Sider>
                    <Image
                        preview={{ visible: false }}
                        width={350}
                        src="public/donate.JPG"
                        onClick={() => setVisible(true)}
                    />
                    <div style={{ display: 'none' }}>
                        <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
                            <Image src="public/donate.JPG" />
                        </Image.PreviewGroup>
                    </div>
                </Sider>
                <Content>
                    <Outlet />
                </Content>
            </Layout>
            {/* <Footer className='footer'>
                There isn't footer yet
            </Footer> */}
        </Layout>
    );
};

export default index;
