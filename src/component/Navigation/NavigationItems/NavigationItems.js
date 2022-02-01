import React from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';
const navigationItems = () => (
    <ul className={classes.NaviagtionItems}>
        <NavigationItem link='/' exact >HOME</NavigationItem>
        <NavigationItem link='/raw-material/purchase' exact >PURCHASE</NavigationItem>
        <NavigationItem link='/inventory' exact>INVENTORY</NavigationItem>
        <NavigationItem link='/order' exact>ORDERS</NavigationItem>
    </ul>
)

export default navigationItems;