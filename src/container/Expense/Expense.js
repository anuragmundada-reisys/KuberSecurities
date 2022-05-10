import React, {Component} from 'react';
import Button from '../../component/UI/Button/Button';
import Input from '../../component/UI/FormElement/FormElement';
import classes from './Expense.module.css';
import { connect } from 'react-redux';
import {ToastsContainer, ToastsStore} from "react-toasts";
import {
    ADDED_EXPENSES,
    ALL_FIELDS_ARE_REQUIRED,
    isValidInput, PLEASE_ADD_EXPENSES,
} from "../../common/Utils";
import {GoDiffAdded} from "react-icons/go";
import {CgCloseO} from "react-icons/cg";
import {formatInTimeZone} from "date-fns-tz";
import {addExpense} from "../../redux/action/ExpenseAction";

function mapDispatchToProps(dispatch) {
    return {
        addExpense: expense => dispatch(addExpense(expense)),
    };
}

class ConnectedExpense extends Component {
    state ={
        expenseForm : {
            expenseType: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeHolder: 'Enter Expense Type'
                },
                value: '',
                label: 'Expense Type'
            },
            amount: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeHolder: 'Enter Amount'
                },
                value: '',
                label: 'Amount'
            },
            expenseDate: {
                elementType: 'datePicker',
                elementConfig: {
                    name: 'startDate',
                    placeholder: 'Select Date',
                },
                value: '',
                label: 'Expense Date'
            },
        },
        expenseError: false,
        addExpense: false,
        expenseAddDisabled: true,
        expenseDate: '',
        expenseDetails: []
    }

    addExpenseHandler = (event) => {
        event.preventDefault();

        let valid = true;
        const formData = {
            expenseDate: formatInTimeZone(this.state.expenseDate, 'IST', 'yyyy-MM-dd'),
            expenses: this.state.expenseDetails
        };

        if(formData.expenses.length === 0){
            ToastsStore.error(PLEASE_ADD_EXPENSES, 2000)
        }else{
            for(let key in formData){
                if(key === 'expenseDate')
                    valid = isValidInput(formData[key])
                if(key==='expenses') {
                    formData[key].length !==0 && formData[key].forEach((expense)=>{
                        for(let element in expense){
                            valid = isValidInput(expense[element])
                            if(!valid){
                                return;
                            }
                        }
                    })
                }
                if(!valid){
                    this.setState({expenseError: true})
                    return;
                }
            }

            console.log("expense form dtata", formData)
            valid &&
            this.props.addExpense(formData).then(()=>{
                ToastsStore.success(ADDED_EXPENSES, 1500);
                setTimeout(() => {
                    this.props.navigate('/expense', {replace:true});
                }, 500)
            }).catch(error=> ToastsStore.error(error, 2000));
        }
    }

    addExpenseDetailsHandler = () => {
        let newExpenseDetails= [...this.state.expenseDetails, {
            expenseId: Math.random(),
            expenseType: '',
            amount: ''
        }]
        this.setState({expenseDetails: newExpenseDetails,
            addExpense: true,
            expenseAddDisabled: false}
        )
    }

    expenseInputChangeHandler = (id, key ,event) => {
        const updatedExpense = this.state.expenseDetails.map(expense => {
            if(id === expense.expenseId) {
                if(key === 'amount')
                expense[key] = parseInt(event.target.value);
                else{
                    expense[key] = event.target.value
                }
            }
            return expense;
        })

        this.setState({productDetails: updatedExpense, expenseError: false })
    }


    inputChangeHandler = (event) => {
        let expenseOccurredDate = event
        this.setState({expenseDate: expenseOccurredDate, expenseError: false})
    }

    removeExpenseHandler = (expenseId) => {
        let updatedExpenseDetails =  [...this.state.expenseDetails];
        let index = updatedExpenseDetails.findIndex(expense  => expense.expenseId === expenseId)
        updatedExpenseDetails.splice(index, 1);
        this.setState({expenseDetails: updatedExpenseDetails })
    }

    cancelHandler = () => {
        this.props.navigate('/expense', {replace:true});
    }

    render() {
        const expenseElementArray=[];
        const expenseElement = ['expenseType', 'amount'];
        for (let key in this.state.expenseForm ) {
            if(expenseElement.includes(key)){
                expenseElementArray.push({
                    id: key,
                    config: this.state.expenseForm[key]
                })
            }
        }
        return (
            <>
                <ToastsContainer position='top_center' store={ToastsStore}/>
                <div className={classes.Expense}>
                    <h4 className={classes.Title}>Enter Expense Details</h4>
                    <form>
                        <div className={classes.AddExpenseTitle}>
                            <p> Add Expenses?</p>
                            <GoDiffAdded className={classes.AddMoreExpenseButton} onClick={this.addExpenseDetailsHandler}/>
                        </div>
                        {this.state.expenseDetails.map((expense) => (
                            <div className={classes.MoreExpenseElement} key={expense.expenseId}>
                                {expenseElementArray.map(ele => (
                                    <Input elementType={ele.config.elementType}
                                           elementConfig={ele.config.elementConfig}
                                           value={expense[ele.id]}
                                           label={ele.config.label}
                                           changed={(event) => this.expenseInputChangeHandler(expense.expenseId, ele.id, event)}
                                    />
                                ))}
                                <CgCloseO onClick={()=>this.removeExpenseHandler(expense.expenseId)} className={classes.CloseIcon}/>
                            </div>))}
                        <Input elementType={'datePicker'}
                               elementConfig={{name: 'Expense Date', placeholder: 'Select Expense Date'}}
                               value={this.state.expenseDate}
                               label={'Expense Date'}
                               changed={(event) => this.inputChangeHandler( event)}
                        />
                        {this.state.expenseError &&
                            <p className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED}</p>}
                        <Button btnType='Success' disabled={this.state.expenseAddDisabled} clicked={this.addExpenseHandler}> ADD </Button>
                        <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>

                    </form>
                </div>
            </>)
    }
}

const Expense = connect(
    null,
    mapDispatchToProps
)(ConnectedExpense)

export default Expense;
