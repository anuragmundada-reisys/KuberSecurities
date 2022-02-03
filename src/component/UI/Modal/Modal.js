import React, {Component} from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';
import { AiFillCloseCircle } from 'react-icons/ai';

class Modal extends Component{

    shouldComponentUpdate(nextProps, nextState){
        return nextProps.show !== this.props.show
    }
    render(){
        return(
            <>
            <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
            <div className={classes.Modal} style={{
                transform: this.props.show ? 'translateY(0)': 'translateY(-100vh)',
                opacity: this.props.show ? '1' : '0'
            }}>
                <div className={classes.CloseIcon}>
                  <AiFillCloseCircle onClick={this.props.modalClosed}/>
                </div>
                {this.props.children}
            </div>
            </>
            )
    }
   
}

export default Modal;