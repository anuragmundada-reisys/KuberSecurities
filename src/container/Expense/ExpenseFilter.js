import React, { Component } from 'react';
import classes from './ExpenseFilter.module.css';
import Button from "../../component/UI/Button/Button";
import DatePicker from "react-datepicker";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {formatInTimeZone} from "date-fns-tz";

class InventoryFilter extends  Component {
    state = {
        expenseDate: '',
    }

    inputChangeHandler = (event, keyIdentifier) => {
        if(keyIdentifier === 'expenseDate'){
            const userInput = event;
            this.setState({expenseDate: userInput})
        }
    }

    render(){
        return(
            <>
                <div className={classes.ExpenseFilter}>
                    <ToastsContainer position='top_center' store={ToastsStore} />
                    <div className={classes.DateSearch}>
                        <label className={classes.Label}>Expense Date</label>
                        <DatePicker className={classes.DatePicker} selected={this.state.expenseDate} popperPlacement={'left-start'}
                                    onChange={(event)=>this.inputChangeHandler(event, 'expenseDate')} name={'StartDate'} placeholderText={'Search Expense Date'}
                                    dateFormat={'yyyy-MM-dd'}/>
                    </div>
                </div>
                <div className={classes.ButtonWrapper}>
                    <Button btnType='Success' clicked={()=>this.props.clicked({
                        expenseDate: formatInTimeZone(this.state.expenseDate, 'IST', 'yyyy-MM-dd')
                    })}>
                        SEARCH </Button>
                    <Button btnType='Success' clicked={this.props.clearClicked}>
                        CLEAR </Button>
                </div>
            </>
        )
    }
}
export default InventoryFilter;