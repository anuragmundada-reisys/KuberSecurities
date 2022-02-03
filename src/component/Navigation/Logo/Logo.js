import React from 'react';
import KuberLogo from '../../../assets/images/Kuber-Logo.JPG';
import classes from './Logo.module.css';

const logo = () => {
    return(
        <div className={classes.Logo}>
            <img src={KuberLogo}/>
        </div>
    )
}

export default logo;