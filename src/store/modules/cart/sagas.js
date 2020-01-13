import { call, select, put, all, takeLatest } from 'redux-saga/effects';
//o call permite fazer as chamadas na api
//o put permite chamar uma action

import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/format';
import { toast } from 'react-toastify';
import { addToCartSuccess, updateAmountSuccess } from './actions';

///o '*' na frente representa como se fosse o async
//intercepta a action, o id vem da action addToCart
function* addToCart({ id }) {
    
    //procura o produto dentro do state do reducer
    const productExists = yield select(
        state => state.cart.find(p => p.id === id),
    )
    
    const stock = yield call(api.get, `/stock/${id}`);

    const stockAmount = stock.data.amount;
    const currentAmount = productExists ? productExists.amount : 0;
    const amount = currentAmount + 1;

    //verifica se tem no estoque
    if(amount > stockAmount)
    {
        toast.error('Estoque esgotado!', {
            position: "top-center",
            closeOnClick: true
        });
        return;
    }

    if(productExists)
    {
        yield put(updateAmountSuccess(id, amount));
    }
    else
    {
        const response = yield call(api.get, `/products/${id}`);
    
        const data = {
            ...response.data,
            amount: 1,
            priceFormatted: formatPrice(response.data.price),
        }

        yield put(addToCartSuccess( data ));
        history.push('/cart');
    }
    
}

//FUNÇÃO QUE AUMENTA E DIMINUE A QUANTIDADE
function* updateAmount({ id, amount }) {
    if(amount <= 0) return;

    const stock = yield call(api.get, `/stock/${id}`);
    const stockAmount = stock.data.amount;

    if(amount > stockAmount)
    {
        toast.error('Estoque Esgotado!', {
            position: "top-center",
            closeOnClick: true
        });
        return ;
    }

    yield put(updateAmountSuccess(id, amount));
}

/*
o all permite chamar varios listeners
o takeLatest dispara o addTocart quando a action que foi
passada é disparada na home, ele controla pra ser 
chamada uma unica vez
*/
export default all([
    takeLatest('@cart/ADD_REQUEST', addToCart),
    takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount)
]);


/* EXPLICANDO COMO ESTA O FLUXO

O usuario clica para adiconar ao carrinho, dispara a função 
'addToCartRequest' essa func tem a action '@cart/ADD_REQUEST',
essa action é ouvida pelo saga que dispara o 'addToCart', dentro do 'addToCart'
é feita uma chamada api e disparada uma action 'addToCartSuccess' que é ouvida pelo
Reducer.
*/