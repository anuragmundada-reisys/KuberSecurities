import React from 'react';
import classes from './NavigationItem.module.css';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => 
    (
        <li className={classes.NavigationItem}>
            <NavLink to={props.link} exact={props.exact} style={({ isActive }) =>
                isActive
                    ? {
                        color: '#fff',
                        background: '#5e1d8a',
                    }
                    : { color: '#5e1d8a', background: '#f0f0f0' }
            }>
                {props.children}
            </NavLink>
        </li>
    )


export default navigationItem;