import React from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';
const navigationItems = () => (
    <ul className={classes.NaviagtionItems}>
        <NavigationItem link='/' exact={true} activeClassName="active" >HOME</NavigationItem>
        <NavigationItem link='/raw-material/purchase' exact={true} activeClassName="active" >PURCHASE</NavigationItem>
        <NavigationItem link='/inventory' exact={true} activeClassName="active">INVENTORY</NavigationItem>
        <NavigationItem link='/order' exact={true} activeClassName="active">ORDERS</NavigationItem>
    </ul>
)

export default navigationItems;