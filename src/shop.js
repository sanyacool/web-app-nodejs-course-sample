import React, {Component} from 'react';
import axios from 'axios';
import Auth from './Auth';

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products :[]
        };
    }

    componentWillMount(){
        axios.get('/products',{headers: {
            Authorization: "Bearer " + Auth.getToken()
         }}).then((response) => {
            console.log(response.data);
            this.setState({
                products: response.data
            })
        });
    }

    render(){
        let products = this.state.products.map((product)=>{
            return(
                <tr>
                    <td>{product.name}</td>
                    <td><img class="itemShop" src={product.image}/></td>
                    <td>{product.price}</td>
                </tr>
            )
        });
        return(<tbody> {products} </tbody>);
        
    }
}

export default Shop;