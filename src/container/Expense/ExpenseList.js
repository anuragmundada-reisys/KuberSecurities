import React, {Component } from 'react';
import { connect } from 'react-redux';
import Table from '../../component/UI/Table/Table';
import Button from '../../component/UI/Button/Button';
import classes from './ExpenseList.module.css';
import {EXPENSE_LIST_COLUMNS} from '../../component/UI/Table/Utils';
import {ToastsContainer, ToastsStore} from "react-toasts";
import {DATA_NOT_FOUND} from "../../common/Utils";
import {getExpense} from "../../redux/action/ExpenseAction";
import ExpenseFilter from "./ExpenseFilter";

function mapDispatchToProps(dispatch) {
    return {
        getExpense: (params)=> dispatch(getExpense(params)),
    };
}

class ConnectedExpenseList extends Component {
    state={
        dataFound:true
    }
    componentDidMount() {
        this.props.getExpense().catch(error=> ToastsStore.error(error, 2000));
    }

    addExpenseHandler =()=> {
        this.props.navigate('/expense/add', {replace:true});
    }

    searchExpenseHandler = async (params) => {
        await this.props.getExpense(params).then(()=>{
            if(this.props.expenseData.length === 0){
                this.setState({dataFound: false})
                ToastsStore.error(DATA_NOT_FOUND, 2000);
            }else{
                this.setState({ dataFound:true});
            }
        }).catch(error=> ToastsStore.error(error, 2000));
    }

    clearSearchHandler = () => {
        window.location.reload();
    }

    render(){
        return (
            <>
                <ToastsContainer position='top_center' store={ToastsStore} />
                <div className="min-h-screen bg-gray-100 text-gray-900">
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                        <div className={classes.AddExpense}>
                            <span className={classes.Text}>New Expense?</span>
                            <Button btnType='Success' clicked={this.addExpenseHandler}> ADD </Button>
                        </div>
                        <div className="mt-4">
                            <ExpenseFilter clicked={(params)=>this.searchExpenseHandler(params)} clearClicked={this.clearSearchHandler}/>
                            <Table columns={EXPENSE_LIST_COLUMNS} data={this.props.expenseData} dataFound={this.state.dataFound}/>
                        </div>
                    </main>
                </div>
            </>
        )
    }
}
function mapStateToProps(state) {
    return {
        expenseData: state.localSales.expenseData,
    };
}

const ExpenseList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedExpenseList)

export default ExpenseList;
