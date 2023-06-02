import { Col, Row } from 'antd';
import LibraryForm from './form';
import '../../styles/library.scss';

const Library = () => {
    return (
        <Row>
            <Col span={4}></Col>
            <Col span={16} className="library-container">
                <LibraryForm/>
            </Col>
            <Col span={4}></Col>
        </Row>
    );
};

export default Library;
