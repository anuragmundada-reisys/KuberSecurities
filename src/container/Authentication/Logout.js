import React, {useEffect} from 'react';
import { logout } from "../../redux/action/AuthAction";
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout()),
    };
}



const Logout = (props) => {

    useEffect(() => {
        props.logout();
        props.navigate('/', {replace: true})
    });

    return(
        <></>
    )
}



export default connect(null,mapDispatchToProps )(Logout)
