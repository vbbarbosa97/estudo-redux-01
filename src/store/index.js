import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';
//importando o rootReducer que passa todos os reducers

import rootSaga from './modules/rootSaga';


const sagaMiddleware = createSagaMiddleware();//cria o middleware
const enhacer = applyMiddleware(sagaMiddleware); //aplica o middleware

const store = createStore(rootReducer, enhacer);

sagaMiddleware.run(rootSaga);

export default store;