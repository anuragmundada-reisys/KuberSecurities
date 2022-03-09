import React, { Component } from 'react';
import Input from "../FormElement/FormElement";
import InputSuggestionList from "../FormElement/InputSuggestionList";
import classes from './OrderAndCollectionFilter.module.css';
import {getBillNumbers, getCustomerNames, getReceiverNames} from "../../../redux/action/MasterDataAction";
import {connect} from "react-redux";
import Button from "../Button/Button";
import DatePicker from "react-datepicker";

function mapDispatchToProps(dispatch) {
    return {
        getCustomerNames: ()=> dispatch(getCustomerNames()),
        getReceiverNames: ()=> dispatch(getReceiverNames()),
        getBillNumbers: ()=> dispatch(getBillNumbers()),
    };
}

class ConnectedCollectionFilter extends  Component {
    state = {
        billNo: '',
        showBillNoSuggestion: false,
        billNoFilteredSuggestions: [],
        billNoSuggestions: [],
        customerName: '',
        showCustomerNameSuggestion: false,
        customerNameFilteredSuggestions: [],
        customerNameSuggestions: [],
        orderDate: '',
        assignedStatus: '',
        assigneeName: '',
        showAssigneeNameSuggestion: false,
        assigneeNameFilteredSuggestions: [],
        assigneeNameSuggestions: [],
        updatedDate:'',
        orderStatus: '',
        inputRef: React.createRef(),
    }

  async  componentDidMount() {
        document.addEventListener("click", (event)=>this.handleOuterClick(event));
        await this.props.getBillNumbers()
        await this.props.getCustomerNames();
        await this.props.getReceiverNames();
        this.setState({billNoSuggestions: this.props.billNumbers,
            customerNameSuggestions: this.props.customerNames,
            assigneeNameSuggestions:this.props.receiverNames  })
    }

     handleOuterClick = e => {
        if (this.state.inputRef && this.state.inputRef.current && !this.state.inputRef.current.contains(e.target)) {
            this.setState({showBillNoSuggestion: false, showCustomerNameSuggestion: false, showAssigneeNameSuggestion: false});
        }
    };

    inputChangeHandler = (event, keyIdentifier) => {
        if(keyIdentifier === 'billNo'){
            const userInput = event.target.value;

            const filtered = this.state.billNoSuggestions.filter(
                (suggestion) =>
                    suggestion && suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );

            this.setState({billNo: userInput, billNoFilteredSuggestions: filtered, showBillNoSuggestion: true})
        }else if(keyIdentifier === 'customerName'){
            const userInput = event.target.value;

            const filtered = this.state.customerNameSuggestions.filter(
                (suggestion) =>
                    suggestion && suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );

            this.setState({customerName: userInput, customerNameFilteredSuggestions: filtered, showCustomerNameSuggestion: true})
        }else if(keyIdentifier === 'assigneeName'){
            const userInput = event.target.value;

            const filtered = this.state.assigneeNameSuggestions.filter(
                (suggestion) =>
                    suggestion && suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );

            this.setState({assigneeName: userInput, assigneeNameFilteredSuggestions: filtered, showAssigneeNameSuggestion: true})
        }
        else if(keyIdentifier === 'orderDate'){
            const userInput = event;
            this.setState({orderDate: userInput})
        }else if(keyIdentifier === 'AssignedStatus'){
            const userInput = event.target.value;
            this.setState({assignedStatus: userInput})
        }else if(keyIdentifier === 'updatedDate'){
            const userInput = event;
            this.setState({updatedDate: userInput})
        }else if(keyIdentifier === 'orderStatus') {
            const userInput = event.target.value;
            this.setState({orderStatus: userInput})
        }
    }

    onClick = (event, keyIdentifier) => {
         if(keyIdentifier === 'billNo'){
            this.setState({billNoFilteredSuggestions:[], billNo:event.target.innerText, showBillNoSuggestion: false})
        }else if(keyIdentifier === 'customerName'){
             this.setState({customerNameFilteredSuggestions:[], customerName:event.target.innerText, showCustomerNameSuggestion: false})
         }else if(keyIdentifier === 'assigneeName'){
             this.setState({assigneeNameFilteredSuggestions:[], assigneeName:event.target.innerText, showAssigneeNameSuggestion: false})
         }
    }
    render(){

        return(
            <>
            <div className={classes.CollectionFilter}>
                <div ref={this.state.inputRef}>
                    <Input elementType='autocompleteInput'
                           value={this.state.billNo}
                           label={'BillNo'}
                           placeholder={'Search Bill No'}
                           changed={(event)=>this.inputChangeHandler( event, 'billNo' )}/>
                    {this.state.showBillNoSuggestion  && <InputSuggestionList
                        filteredSuggestions={this.state.billNoFilteredSuggestions}
                        onClick={(event)=>this.onClick(event, 'billNo' )
                        }/>}
                </div>
                <div ref={this.state.inputRef}>
                    <Input elementType='autocompleteInput'
                           value={this.state.customerName}
                           label={'Customer Name'}
                           placeholder={'Search Customer Name'}
                           changed={(event)=>this.inputChangeHandler(event, 'customerName' )}/>
                    {this.state.showCustomerNameSuggestion && <InputSuggestionList
                        filteredSuggestions={this.state.customerNameFilteredSuggestions}
                        onClick={(event)=>this.onClick(event, 'customerName')
                        }
                    />}
                </div>
                {
                    this.props.isOrderSearch &&
                    <Input elementType={'select'}
                           elementConfig={{options:[
                                   {id: '', displayValue: 'All'},
                                   {id: true, displayValue: 'Completed'},
                                   {id: false, displayValue: 'Pending'}
                               ], placeholder: 'Search Status'}}
                           value={this.state.orderStatus}
                           label={'Status'}
                           changed={(event)=>this.inputChangeHandler( event, 'orderStatus' )}
                    />
                }
                <div className={classes.DateSearch}>
                    <label className={classes.Label}>Order Date</label>
                    <DatePicker className={classes.DatePicker} selected={this.state.orderDate} popperPlacement={'left-start'}
                                onChange={(event)=>this.inputChangeHandler(event, 'orderDate')} name={'StartDate'} placeholderText={'Search Ordered Date'}
                                dateFormat={'yyyy-MM-dd'}/>
                </div>
                { ! this.props.isOrderSearch &&
                    <>
                    <Input elementType={'select'}
                       elementConfig={{options:[
                               {id: '', displayValue: 'All'},
                                {id: true, displayValue: 'Assigned'},
                               {id: false, displayValue: 'Unassigned'}
                           ], placeholder: 'Search Assigned type'}}
                       value={this.state.assignedStatus}
                       label={'Assigned Status'}
                       changed={(event)=>this.inputChangeHandler( event, 'AssignedStatus' )}
                />
                <div ref={this.state.inputRef}>
                    <Input elementType='autocompleteInput'
                           value={this.state.assigneeName}
                           label={'Assignee Name'}
                           placeholder={'Search Assignee Name'}
                           changed={(event)=>this.inputChangeHandler( event, 'assigneeName' )}/>
                    {this.state.showAssigneeNameSuggestion  && <InputSuggestionList
                        filteredSuggestions={this.state.assigneeNameFilteredSuggestions}
                        onClick={(event)=>this.onClick(event, 'assigneeName' )
                        }/>}
                </div>
                <div className={classes.DateSearch}>
                    <label className={classes.Label}>Updated Date</label>
                    <DatePicker className={classes.DatePicker} selected={this.state.updatedDate} popperPlacement={'left-start'}
                                onChange={(event)=>this.inputChangeHandler(event, 'updatedDate')} name={'StartDate'} placeholderText={'Search Updated Date'}
                                dateFormat={'yyyy-MM-dd'}/>
                </div>
                    </>}

            </div>
            <div className={classes.ButtonWrapper}>
                <Button btnType='Success' clicked={()=>this.props.clicked({billNo: this.state.billNo,
                    customerName: this.state.customerName,
                    orderDate: this.state.orderDate && this.state.orderDate.toISOString().slice(0, 10),
                    assignedStatus: this.state.assignedStatus && JSON.parse(this.state.assignedStatus),
                    assigneeName: this.state.assigneeName,
                    updatedDate: this.state.updatedDate && this.state.updatedDate.toISOString().slice(0, 10),
                    orderStatus: this.state.orderStatus,
                })}>
                    SEARCH </Button>
                <Button btnType='Success' clicked={this.props.clearClicked}>
                    CLEAR </Button>
            </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        customerNames: state.localSales.customerNames,
        receiverNames: state.localSales.receiverNames,
        billNumbers: state.localSales.billNumbers,
    };
}

const OrderAndCollectionFilter = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedCollectionFilter)

export default OrderAndCollectionFilter;