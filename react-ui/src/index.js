import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

class App extends Component {
    
  render() {
    return(
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'));
registerServiceWorker();
