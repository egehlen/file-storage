import Router from 'components/Router';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

function App() {

    window.Buffer = window.Buffer || require('buffer').Buffer;
    
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
}

export default App;