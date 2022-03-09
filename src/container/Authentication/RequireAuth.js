
import React from "react";
import {connect} from "react-redux";
import { Navigate } from "react-router-dom"

const ConnectedRequireAuth = (props) => {
    return(
        props.isLoggedIn ? props.children : <Navigate to="/login" replace />
    )
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.auth.isLoggedIn,
    };
}

const RequireAuth = connect(mapStateToProps)(ConnectedRequireAuth)

export default RequireAuth;