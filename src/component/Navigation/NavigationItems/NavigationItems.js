import React from 'react';
import NavigationItem from '../NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';

const NavigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/' exact={'true'}>HOME</NavigationItem>
        <NavigationItem link='/dashboard' exact={'true'}>DASHBOARD</NavigationItem>
        <NavigationItem link='/inventory' exact={'true'}>INVENTORY</NavigationItem>
        <NavigationItem link='/order' exact={'true'}>ORDERS</NavigationItem>
        <NavigationItem link='/collection' exact={'true'}>COLLECTION</NavigationItem>
    </ul>
)

export default NavigationItems;