import React from 'react';
import classes from './Toolbar.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../Logo/Logo';

const toolbar = (props) => {
    return(
         <header className={classes.Toolbar}>
             <div className={classes.LogoAndMenu}>
               <Logo/>
               <div className={classes.Menu}> KUBER BEVERAGES </div>
             </div>
           <nav className={classes.smallScreenOnly}>
              <NavigationItems />
            </nav>
        </header>
       
    )
}

export default toolbar;