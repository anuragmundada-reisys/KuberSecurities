import React from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';
import { connect } from 'react-redux';
import {SUPER_ADMIN_ROLE} from "../../../common/Utils";

const NavigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/' exact={'true'}>HOME</NavigationItem>
        { !props.isLoggedIn && <NavigationItem link='/login' exact={'true'}>LOGIN</NavigationItem>}
        { props.isLoggedIn && props.user && props.user.roles && props.user.roles.includes(SUPER_ADMIN_ROLE) ? <NavigationItem link='/signup' exact={'true'}>SIGNUP</NavigationItem>: null}
        { props.isLoggedIn ? (
            <>
                    <NavigationItem link='/dashboard' exact={'true'}>DASHBOARD</NavigationItem>
                    {/*<NavigationItem link='/inventory' exact={'true'}>INVENTORY</NavigationItem>*/}
                    <NavigationItem link='/expense' exact={'true'}> EXPENSE </NavigationItem>
                    <NavigationItem link='/received-payment' exact={'true'}> PAYMENT</NavigationItem>
                    <NavigationItem link='/order' exact={'true'}>ORDERS</NavigationItem>
                    <NavigationItem link='/collection' exact={'true'}>COLLECTION</NavigationItem>

            </>)
           : null}

    </ul>
)

function mapStateToProps(state) {
        return {
                isLoggedIn: state.auth.isLoggedIn,
                user: state.auth.user
        };
}

export default connect(mapStateToProps)(NavigationItems);