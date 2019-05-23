import React, {Component} from 'react';
import Axios from 'axios';
import Auth from './Auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '',password:'',shown: true};

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
      this.setState({name: event.target.value});
  }

  handleChangePassword(event) {
      this.setState({password:event.target.value});
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.name +' - '+ this.state.password);
    event.preventDefault();

    const {name,password} = this.state;
    Axios.post('/login',{name,password}).then((response)=>{
            // access response
            //console.log('Result:',response);
            // save the token
            
            Auth.authenticateUser(response.data.token);

            //Auth.setUserId(response.data.userid)
          
            //console.log('token:',Auth.getToken());
            this.setState({name:'',password:''});
            //windows.location.reload();

            this.props.refreshPage();
        },
        (error)=>{
          console.log(error);
        }
    );
    /*
    Axios.post('/login', {name,password}).then((result)=>{
      console.log(result);
    });
    */
  }

  render() {
    return (
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
              <input type="text" value={this.state.name} onChange={this.handleChangeName} required/>
            </label>
            <label>
              Password:
              <input type="password" value={this.state.password} onChange={this.handleChangePassword} required/>
            </label>
            <input type="submit" value="Submit" />
          </form>
    );
  }
}

export default Login;