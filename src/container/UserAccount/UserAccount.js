import React, {Component} from "react";
import classes from './UserAccount.module.css';
import { FaUser } from "react-icons/fa"
import {connect} from "react-redux";

class ConnectedUserAccount extends Component {
    iconRef = React.createRef();
    state= {
        iconClick: false
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    iconClickHandler = () => {
        this.setState((state) => {
            return {
                iconClick: !this.state.iconClick,
            };
        });
    };

    handleClickOutside = (event) => {
        if (
            this.iconRef.current &&
            !this.iconRef.current.contains(event.target)
        ) {
            this.setState({
                iconClick: false,
            });
        }
    };

    render(){
        return(
            <div className={classes.UserAccount} ref={this.iconRef}>
                <button type="button" className={classes.userIcon} onClick={this.iconClickHandler}>
                    <FaUser/>
                </button>
                {this.state.iconClick &&
                <div className="dropdown">
                    <ul className={classes.MenuItems}>
                        <li style={{fontSize:'13px'}}>You are LoggedIn as:</li>
                        <li className={classes.UserName}>{this.props.user? this.props.user.userName: ''}</li>
                        <hr style={{height:'2px', color: 'gray' , backgroundColor: 'gray'}}/>
                        <li className={classes.Link}><a href={'/resetpassword'}> Reset Password</a></li>
                        <hr style={{height:'2px', color: 'gray' , backgroundColor: 'gray'}}/>
                        <li className={classes.Link}><a href={'/logout'}> Logout</a></li>
                    </ul>
                </div>}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        user: state.auth.user,
    };
}

const UserAccount = connect(
    mapStateToProps,
)(ConnectedUserAccount)
export default UserAccount