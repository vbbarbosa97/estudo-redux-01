import React, {Component} from 'react';
import api from '../../services/api';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'; //facilita a organização das chamadas das actions
import { formatPrice } from '../../util/format';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import * as CartActions from '../../store/modules/cart/actions';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');

    //formatando cada preço 
    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data });
  }

  //função que adiciona o produto ao carrinho
  handleAddProduct = id => {
    //o addToCart dispara uma Action para o redux
    const { addToCartRequest } = this.props;

    //função que vem de dentro do CartActions
    //só é possivel usar se configurar o mapDispatchToprops
    addToCartRequest(id);
  };

  render() {
    const { products } = this.state;
    const { amount } = this.props;

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
    
              <button type="button" onClick={() => this.handleAddProduct(product.id)}>
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
}

//adiciona a quantidade de produtos que tem no carrinho pra cada produto
const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

//converte actions em propriedades do sistema
const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

/*
Exportando o Home e fazendo a conexão
*/
