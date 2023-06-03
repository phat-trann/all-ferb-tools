import { Spin } from 'antd';
import '../styles/loading.scss';

const LoadingComponent = () => {
    return (
        <div className="loading-container">
            <div className="spinner">
                <Spin size="large" />
            </div>
        </div>
    );
};

export default LoadingComponent;
