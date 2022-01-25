import React from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';
const navigationItems = () => (
    <ul className={classes.NaviagtionItems}>
        <NavigationItem link='/' exact >PURCHASE</NavigationItem>
        <NavigationItem link='/inventory' exact>INVENTORY</NavigationItem>
        <NavigationItem link='/orders' exact>ORDERS</NavigationItem>
    </ul>
)

export default navigationItems;