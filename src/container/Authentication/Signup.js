import React, { Component } from 'react';
import classes from "./Signup.module.css";
import Input from "./AuthFormElement";
import Button from "../../component/UI/Button/Button";
import { signup } from "../../redux/action/AuthAction";
import {connect} from "react-redux";
import {ToastsContainer, ToastsStore} from "react-toasts";
import  validator  from "validator";
import {ALL_FIELDS_ARE_REQUIRED, isValidInput} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
    return {
        signup: userData => dispatch(signup(userData)),
    };
}

class ConnectedSignup extends Component {
    state = {
        signupForm : {
            userName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeHolder: 'Enter User Name'
                },
                value: '',
                label: 'Username',
                errorMessage: 'UserName should not be greater than 40 characters'
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeHolder: 'Enter Email'
                },
                value: '',
                label: 'Email',
                errorMessage: 'This is not a valid Email'
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeHolder: 'Enter Password'
                },
                value: '',
                label: 'Password',
                errorMessage: 'Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
            },
        },
        signupError: false,
        valid: {
            email: true,
            password: true,
            userName: true
        }
    }


    inputChangeHandler = (event, keyIdentifier) => {
        event.preventDefault()
        const updatedSignupForm = {...this.state.signupForm}
        const updatedValidElements = {...this.state.valid}
        const updatedElement = { ...updatedSignupForm[keyIdentifier]}
        updatedElement.value = event.target.value;

        updatedSignupForm[keyIdentifier] = updatedElement;
        if(keyIdentifier === 'email') {
            updatedValidElements['email'] = true;
            this.setState({signupForm: updatedSignupForm, signupError: false, valid: updatedValidElements})
        }else if(keyIdentifier === 'password'){
            updatedValidElements['password'] = true;
            this.setState({signupForm: updatedSignupForm, signupError: false, valid: updatedValidElements})
        }else{
            this.setState({signupForm: updatedSignupForm, signupError: false})
        }

    }

    cancelHandler = () => {
        this.props.navigate('/', {replace:true})
    }

    signupHandler = async (event) => {
        event.preventDefault();
        const userData = {};
        const updatedValidElements = {...this.state.valid};
        for(let key in this.state.signupForm){
            if(isValidInput(this.state.signupForm[key].value)) {
                if(key==='email'){
                    if(validator.isEmail(this.state.signupForm[key].value)){
                        userData[key] = this.state.signupForm[key].value
                    }else{
                        updatedValidElements['email'] = false;
                        this.setState({valid:updatedValidElements});
                        return;
                    }
                }else if(key==='password'){
                    if (validator.isStrongPassword(this.state.signupForm[key].value, {
                        minLength: 8, minLowercase: 1,
                        minUppercase: 1, minNumbers: 1, minSymbols: 1
                    })) {
                        userData[key] = this.state.signupForm[key].value
                    }else{
                        updatedValidElements['password'] = false;
                        this.setState({valid:updatedValidElements});
                        return;
                    }

                }else{
                    userData[key] = this.state.signupForm[key].value;
                }
            }else{
                this.setState({signupError: true})
                return;
            }
        }


        !this.state.signupError && this.state.valid['email'] && this.state.valid['password'] &&
        await this.props.signup(userData).then(()=>{
            ToastsStore.success("User registered successfully!", 2000);
            setTimeout(() => {
                this.props.navigate('/', {replace:true});
            }, 500)
        }).catch(error=> ToastsStore.error(error, 2000));
    }
    render(){
        const signupElementArray = [];
       for(let key in this.state.signupForm){
           signupElementArray.push({
               id: key,
               config: this.state.signupForm[key]
           })
        }

        return(
            <div className={classes.Signup}>
                <ToastsContainer position='top_center' store={ToastsStore} />
                <h4 className={classes.Title}>SIGN UP</h4>
                <form>
                     {signupElementArray.map(ele => (
                                <Input elementType={ele.config.elementType}
                                       elementConfig={ele.config.elementConfig}
                                       value={ele.config.value}
                                       label={ele.config.label}
                                       isValid={this.state.valid[ele.id]}
                                       errorMessage={ele.config.errorMessage}
                                       changed={(event) => this.inputChangeHandler(event, ele.id)}
                                />
                     ))}
                    {this.state.signupError && <p className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED}</p>}
                    <Button btnType='Success' clicked={this.signupHandler}> SIGN UP </Button>
                    <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>
                </form>
            </div>
        )
    }

}

const Signup = connect(
  null,
    mapDispatchToProps
)(ConnectedSignup)

export default Signup;