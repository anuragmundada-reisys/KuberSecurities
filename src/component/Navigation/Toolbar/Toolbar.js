import React from 'react';
import classes from './Toolbar.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../Logo/Logo';
import UserAccount from "../../../container/UserAccount/UserAccount";
import {connect} from "react-redux";

const Toolbar = (props) => {

    return(
         <header className={classes.Toolbar}>
             <div className={classes.LogoAndMenu}>
               <Logo/>
               <div className={classes.Menu}> KUBER BEVERAGES </div>
             </div>
             <div className={classes.NavbarAndAccount}>
                 <nav className={classes.smallScreenOnly}>
                     <NavigationItems />
                 </nav>
                 {props.isLoggedIn && <UserAccount/>}
             </div>


         </header>
       
    )
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.auth.isLoggedIn,
    };
}

export default connect(mapStateToProps)(Toolbar);