import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Menu } from './menu/Menu';

ReactDOM.render(<Menu />, document.getElementById('root'));
registerServiceWorker();
