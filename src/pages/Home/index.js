import React, {useState, useEffect} from 'react';
import api from '../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import { formatPrice } from '../../util/format';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

export default function Home() {

  const [products, setProducts] = useState([]);

  //atuliza a quantidade de produtos no carrinho
  const amount = useSelector(state => 
    state.cart.reduce((amount, product) => {
      amount[product.id] = product.amount;
  
      return amount;
    }, {})
  );

  useEffect(() => {

    async function loadProducts(){
      const response = await api.get('products');

      //formatando cada preço 
      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));
      setProducts(data);
    }

    loadProducts();

  },[]);

  const dispatch = useDispatch();

  //função que adiciona o produto ao carrinho
  function handleAddProduct(id) {
    //o addToCart dispara uma Action para o redux
    //função que vem de dentro do CartActions
    //só é possivel usar se configurar o mapDispatchToprops
    dispatch(CartActions.addToCartRequest(id));
  };

  return (
    <ProductList>
      {
        products.map(product =>(
          <li key={product.id}>
            <img 
              src={product.image} 
              alt={product.title}
            />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
  
            <button type="button" onClick={() => handleAddProduct(product.id)}>
              <div>
                <MdAddShoppingCart size={16} color="#FFF" /> 
                { amount[product.id] || 0 }             
              </div>
              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>      
        ))
      }
    </ProductList>
  );
}

