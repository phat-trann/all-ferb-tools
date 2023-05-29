import { Col, Row } from 'antd';
import LibraryForm from './form';
import '../../styles/library.scss';

const Library = () => {
    return (
        <Row>
            <Col span={8}></Col>
            <Col span={8} className="library-container">
                <LibraryForm/>
            </Col>
            <Col span={8}></Col>
        </Row>
    );
};

export default Library;
