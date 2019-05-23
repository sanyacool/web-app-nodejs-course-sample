import React, {Component} from 'react';
import Axios from 'axios';
import Auth from './Auth';

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products :[]
    }
    this.handleClick = this.handleClick.bind(this);
  };

  componentWillMount(){
    Axios.get('/products').then((response) => {
      console.log(response.data);
      this.setState({
        products: response.data
      })
    });
  }

  handleClick(product) {
    alert(product);
    //const {product} = name;
    console.log('product is: ', product);
    let userid = Auth.getUserId();
    console.log({userid});
    Axios.post('/buy', {product, userid}).then((result)=>{
      console.log(result);
    });
  }

  render(){
    let products = this.state.products.map((product)=>{
      return(
        <tr>
          <td>{product.name}</td>
          <td><img src={product.image}/></td>
          <td>{product.price}</td>
          <td><button onClick={() => this.handleClick(product.name)}>Buy the {product.name}</button>
          </td>
        </tr>
      )
    });
    return(<tbody> {products} </tbody>);
  }
}

export default Shop;