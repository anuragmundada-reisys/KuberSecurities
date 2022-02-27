import React from 'react';
import classes from './Footer.module.css'
import {MdCopyright } from 'react-icons/md';

const Footer = (props) => {
    return(
        <div className={classes.Footer}>
            <MdCopyright className={classes.Copyright}/>
            <p> {props.currentYear} kuberbeverages.in. All Rights Reserved</p>
        </div>
        )
}

export default Footer;