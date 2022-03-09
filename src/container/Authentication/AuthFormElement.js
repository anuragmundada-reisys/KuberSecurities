import React from 'react';
import classes from './AuthFormElement.module.css';

const AuthFormElement = (props) => {
    let inputElement = null;

    switch(props.elementType){

        case 'input':
            inputElement = <input
                className={classes.AuthInputElement}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
                placeholder={props.placeholder}/>
            break;
        default:
            break;
    }
    return(
        <div className={classes.Input}>
            {inputElement}
            <label className={classes.Label}>{props.label}</label>
            {!props.isValid && <span className={classes.AuthErrorMessage}>{props.errorMessage}</span>}
        </div>
    )
}

export default AuthFormElement;