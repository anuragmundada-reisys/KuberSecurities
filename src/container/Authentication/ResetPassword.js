import React, { Component } from 'react';
import classes from "./ResetPassword.module.css";
import Input from "./AuthFormElement";
import Button from "../../component/UI/Button/Button";
import { resetpassword} from "../../redux/action/AuthAction";
import {connect} from "react-redux";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {
    ALL_FIELDS_ARE_REQUIRED,
    isValidInput,
    NEW_CONFIRM_PASSWORD,
    STRONG_PASSWORD
} from "../../common/Utils";
import validator from "validator";

function mapDispatchToProps(dispatch) {
    return {
        resetpassword: userData => dispatch(resetpassword(userData)),
    };
}

class ConnectedResetPassword extends Component {
    state = {
        resetPasswordForm : {

            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeHolder: 'Enter New Password'
                },
                value: '',
                label: 'New Password'
            },
            confirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeHolder: 'Confirm Password'
                },
                value: '',
                label: 'Confirm Password'
            },
        },
        resetPasswordError: false,
        passwordNotMatchError: false,
        isStrongPassword: true    }

    inputChangeHandler = (event, keyIdentifier) => {
        event.preventDefault()
        const updatedResetPasswordForm = {...this.state.resetPasswordForm}
        const updatedElement = { ...updatedResetPasswordForm[keyIdentifier]}

        updatedElement.value = event.target.value;

        updatedResetPasswordForm[keyIdentifier] = updatedElement;
        this.setState({resetPasswordForm: updatedResetPasswordForm, resetPasswordError: false, passwordNotMatchError: false, isStrongPassword:true})
    }

    cancelHandler = () => {
        this.props.navigate('/', {replace:true})
    }

    resetPasswordHandler = async (event) => {
        event.preventDefault();
        const userData = {};
        for(let key in this.state.resetPasswordForm){
            if(isValidInput(this.state.resetPasswordForm[key].value)){
                if(key==='password'){
                    if (validator.isStrongPassword(this.state.resetPasswordForm[key].value, {
                        minLength: 8, minLowercase: 1,
                        minUppercase: 1, minNumbers: 1, minSymbols: 1
                    })) {
                        userData[key] = this.state.resetPasswordForm[key].value
                    }else{
                        this.setState({isStrongPassword:false});
                        return;
                    }

                }else{
                    userData[key] = this.state.resetPasswordForm[key].value
                }

            }else{
                this.setState({resetPasswordError: true})
                return;
            }
        }

        if(userData['password'] !== userData['confirmPassword']){
            this.setState({passwordNotMatchError: true})
            return
        }
        userData['username'] = this.props.user ? this.props.user.userName: '';

        !this.state.resetPasswordError && !this.state.passwordNotMatchError && this.state.isStrongPassword &&
        await this.props.resetpassword(userData).then(()=>{
            setTimeout(() => {
                this.props.navigate('/logout', {replace:true});
            }, 500)
        }).catch(error=> {
            event.preventDefault();
            ToastsStore.error(error, 2000)
        });
    }

    render(){
        const resetPasswordElementArray = [];
        for(let key in this.state.resetPasswordForm){
            resetPasswordElementArray.push({
                id: key,
                config: this.state.resetPasswordForm[key]
            })
        }

        return(
            <div className={classes.ResetPassword}>
                <ToastsContainer position='top_center' store={ToastsStore} />
                <h3 className={classes.Title}>RESET PASSWORD</h3>
                <form>
                    <h4 className={classes.UserName}>{this.props.user ? this.props.user.userName: ''}</h4>
                    {resetPasswordElementArray.map(ele => (
                        <Input elementType={ele.config.elementType}
                               elementConfig={ele.config.elementConfig}
                               value={ele.config.value}
                               label={ele.config.label}
                               changed={(event) => this.inputChangeHandler(event, ele.id)}
                        />
                    ))}
                    {!this.state.isStrongPassword && <p className={classes.ErrorMessage}> {STRONG_PASSWORD}</p>}
                    {this.state.passwordNotMatchError && <p className={classes.ErrorMessage}> {NEW_CONFIRM_PASSWORD}</p>}
                    {this.state.resetPasswordError && <p className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED}</p>}
                    <Button btnType='Success' clicked={(event)=>this.resetPasswordHandler(event)}> RESET </Button>
                    <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>
                </form>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        user: state.auth.user,
    };
}

const ResetPassword = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedResetPassword)

export default ResetPassword;