import { combineReducers } from 'redux';

import cart from './cart/reducer';

/*
O combineReducers faz a combinação de todos
os reducers que existirem na aplicação
*/

export default combineReducers({
    cart,
});