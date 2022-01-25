import React from 'react';
import BailleyLogo from '../../../assets/images/Bailley_logo.jpg';
import classes from './Logo.module.css';

const logo = () => {
    return(
        <div className={classes.Logo}>
            <img src={BailleyLogo}/>
        </div>
    )
}

export default logo;