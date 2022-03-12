import React, {useEffect} from 'react';
import { logout } from "../../redux/action/AuthAction";
import { connect } from 'react-redux';
import {ToastsContainer, ToastsStore} from "react-toasts";

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
    };
}

const Logout = (props) => {

    useEffect(() => {
        props.logout().then().catch(error=> ToastsStore.error(error, 2000));;
        props.navigate('/', {replace: true})
    });

    return(
        <ToastsContainer position='top_center' store={ToastsStore} />
    )
}

export default connect(null,mapDispatchToProps )(Logout)
