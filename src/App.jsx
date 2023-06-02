import { BrowserRouter } from 'react-router-dom';
import Routes from './router';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;