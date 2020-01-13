import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
/* 
O Provider permite que cada componente acesse o estado global
criado com o redux, e o store é passado como parametro
*/
import {ToastContainer} from 'react-toastify'; //trabalha com as mensagens de erro
import store from './store';
import GlobalStyle from './styles/global';
import Routes from './routes';
import Header from './components/Header';
import history from './services/history';

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Header />
        <Routes />
        <GlobalStyle />
        <ToastContainer autoClose={5000}/>
      </Router>
    </Provider>
  ); 
}

export default App;
