import React, { Component } from 'react';
import Input from "../../component/UI/FormElement/FormElement";
import InputSuggestionList from "../../component/UI/FormElement/InputSuggestionList";
import classes from './ReceivedPayment.module.css';
import {getBillNumbers, getCustomerNames, getReceiverNames} from "../../redux/action/MasterDataAction";
import {connect} from "react-redux";
import Button from "../../component/UI/Button/Button";
import DatePicker from "react-datepicker";

function mapDispatchToProps(dispatch) {
    return {
        getCustomerNames: ()=> dispatch(getCustomerNames()),
        getReceiverNames: ()=> dispatch(getReceiverNames()),
        getBillNumbers: ()=> dispatch(getBillNumbers()),
    };
}

class ConnectedReceivedPaymentFilter extends  Component {
    state = {
        billNo: '',
        showBillNoSuggestion: false,
        billNoFilteredSuggestions: [],
        billNoSuggestions: [],
        customerName: '',
        showCustomerNameSuggestion: false,
        customerNameFilteredSuggestions: [],
        customerNameSuggestions: [],
        assigneeName: '',
        showAssigneeNameSuggestion: false,
        assigneeNameFilteredSuggestions: [],
        assigneeNameSuggestions: [],
        receivedPaymentDate: '',
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
        else if(keyIdentifier === 'receivedPaymentDate'){
            const userInput = event;
            this.setState({receivedPaymentDate: userInput})
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
                <div className={classes.ReceivedPaymentFilter}>
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
                    <div ref={this.state.inputRef}>
                        <Input elementType='autocompleteInput'
                               value={this.state.assigneeName}
                               label={'Receiver Name'}
                               placeholder={'Search Receiver Name'}
                               changed={(event)=>this.inputChangeHandler( event, 'assigneeName' )}/>
                        {this.state.showAssigneeNameSuggestion  && <InputSuggestionList
                            filteredSuggestions={this.state.assigneeNameFilteredSuggestions}
                            onClick={(event)=>this.onClick(event, 'assigneeName' )
                            }/>}
                    </div>
                    <div className={classes.DateSearch}>
                        <label className={classes.Label}>Received Payment Date</label>
                        <DatePicker className={classes.DatePicker} selected={this.state.receivedPaymentDate} popperPlacement={'left-start'}
                                    onChange={(event)=>this.inputChangeHandler(event, 'receivedPaymentDate')} name={'StartDate'} placeholderText={'Search Received Payment Date'}
                                    dateFormat={'yyyy-MM-dd'}/>
                    </div>
                </div>
                <div className={classes.ButtonWrapper}>
                    <Button btnType='Success' clicked={()=>this.props.clicked({billNo: this.state.billNo,
                        customerName: this.state.customerName,
                        receivedPaymentDate: this.state.receivedPaymentDate && this.state.receivedPaymentDate.toISOString().slice(0, 10),
                        assigneeName: this.state.assigneeName,
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

const ReceivedPaymentFilter = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedReceivedPaymentFilter)

export default ReceivedPaymentFilter;