import React from 'react';
import classes from './Button.module.css';

const button = (props) => {
    const buttonClass = [classes.Button, classes[props.btnType]];
    if(props.disabled){
        buttonClass.push(classes.Disabled)
    }
    return(
        <button disabled={props.disabled} className={buttonClass.join(' ')} onClick={props.clicked} >{props.children}</button>
    )
}

export default button;