import React, { Component } from 'react';
import classes from "./Login.module.css";
import Input from "./AuthFormElement";
import Button from "../../component/UI/Button/Button";
import { login } from "../../redux/action/AuthAction";
import {connect} from "react-redux";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {ALL_FIELDS_ARE_REQUIRED, isValidInput} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
    return {
        login: userData => dispatch(login(userData)),
    };
}

class ConnectedLogin extends Component {
    state = {
        loginForm : {
            username: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeHolder: 'Enter User Name'
                },
                value: '',
                label: 'Username'
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeHolder: 'Enter Password'
                },
                value: '',
                label: 'Password'
            },
        },
        loginError: false
    }

    inputChangeHandler = (event, keyIdentifier) => {
        event.preventDefault()
        const updatedLoginForm = {...this.state.loginForm}
        const updatedElement = { ...updatedLoginForm[keyIdentifier]}

        updatedElement.value = event.target.value;

        updatedLoginForm[keyIdentifier] = updatedElement;
        this.setState({loginForm: updatedLoginForm, loginError: false})

    }

    cancelHandler = () => {
        this.props.navigate('/', {replace:true})
    }

    loginHandler = async (event) => {
        event.preventDefault();
        const userData = {};
        for(let key in this.state.loginForm){
            if(isValidInput(this.state.loginForm[key].value)){
                userData[key] = this.state.loginForm[key].value
            }else{
                this.setState({loginError: true})
                return;
            }
        }

        !this.state.loginError &&
        await this.props.login(userData).then(()=>{
            setTimeout(() => {
                this.props.navigate('/', {replace:true});
            }, 500)
         }).catch(error=> {
            event.preventDefault();
            ToastsStore.error(error, 2000)
        });
    }

    render(){
        const loginElementArray = [];
        for(let key in this.state.loginForm){
            loginElementArray.push({
                id: key,
                config: this.state.loginForm[key]
            })
        }

        return(
            <div className={classes.Login}>
                <ToastsContainer position='top_center' store={ToastsStore} />
                <h4 className={classes.Title}>LOGIN</h4>
                <form>
                    {loginElementArray.map(ele => (
                        <Input elementType={ele.config.elementType}
                               elementConfig={ele.config.elementConfig}
                               value={ele.config.value}
                               label={ele.config.label}
                               changed={(event) => this.inputChangeHandler(event, ele.id)}
                        />
                    ))}
                    {this.state.loginError && <p className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED}</p>}
                    <Button btnType='Success' clicked={this.loginHandler}> LOGIN </Button>
                    <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>
                </form>
            </div>
        )
    }

}

const Login = connect(
    null,
    mapDispatchToProps
)(ConnectedLogin)

export default Login;