import React, {Component} from 'react';
import Button from '../../component/UI/Button/Button';
import Input from '../../component/UI/FormElement/FormElement';
import classes from './Order.module.css';
import { addOrder, updateOrder, addReceivedPayment } from '../../redux/action/OrderAction';
import {getCustomerNames, getMasterData, getReceiverNames} from '../../redux/action/MasterDataAction';
import { connect } from 'react-redux';
import { GoDiffAdded } from 'react-icons/go';
import { CgCloseO } from 'react-icons/cg';
import InputSuggestionList from "../../component/UI/FormElement/InputSuggestionList";


import { ToastsContainer, ToastsStore } from 'react-toasts';
import {
    ORDER_ASSIGNED_SUCCESSFULLY,
    RECEIVED_AMOUNT_ADDED_SUCCESSFULLY,
    RECEIVED_AMOUNT_GREATER_THAN_BALANCE_DUE
} from "../../common/Utils";


function mapDispatchToProps(dispatch) {
    return {
        addOrder: order => dispatch(addOrder(order)),
        updateOrder: order => dispatch(updateOrder(order)),
        getMasterData: ()=> dispatch(getMasterData()),
        getCustomerNames: ()=> dispatch(getCustomerNames()),
        addReceivedPayment: receivedPayment => dispatch(addReceivedPayment(receivedPayment)),
        getReceiverNames: ()=> dispatch(getReceiverNames()),
    };
}

class ConnectedOrder extends Component {

    state ={
        orderForm : {
            billNo: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Bill Number',
                },
                value: '',
                label: 'Bill Number'
            },
            productId: {
                elementType: 'select',
                elementConfig: {
                  options: [],
                  placeholder: 'Select Product Type'
                },
                value: '',
                label: 'Product Type',
            },
            quantity: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeHolder: 'Enter Ordered Quantity'
                },
                value: '',
                label: 'Quantity'
            },
            rate: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeHolder: 'Enter Rate'
                },
                value: '',
                label: 'Rate'
            },
            amount: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                },
                value: '',
                label: 'Amount'
            },
            receivedAmount: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                },
                value: '',
                label: 'Received Amount'
            },
            paymentMode: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {id: 'Cash', displayValue: 'Cash'},
                        {id: 'Gpay', displayValue: 'Gpay'},
                        {id: 'PhonePe', displayValue: 'PhonePe'},
                    ],
                    placeholder: 'Select Payment Mode'
                },
                value: '',
                label: 'Payment Mode',
            },

            receivedPaymentDate: {
                elementType: 'datePicker',
                elementConfig: {
                    name: 'startDate',
                    placeholder: 'Select Received Payment Date',
                },
                value: '',
                label: 'Received Payment Date'
            },
            orderDate: {
                elementType: 'datePicker',
                elementConfig: {
                    name: 'startDate',
                    placeholder: 'Select Ordered Date',
                },
                value: '',
                label: 'Order Date'
            },
        },
        moreOrder: false,
        orderDetails: [],
        totalAmount: 0,
        balanceDue:0,
        filteredSuggestions: [],
        activeSuggestionIndex: 0,
        showSuggestion: false,
        customerName: '',
        suggestions: [],
        receivedPaymentDetails: [],
        receivedPayment: false,
        receiverName: '',
        paymentId: 0,
        receivedPaymentAddDisabled: true,
    }

  async componentDidMount(){
      const productTypeOptions =[];
      await this.props.getMasterData()
           .then(()=>{
               this.props.masterData.productType.map(product => {
                   return productTypeOptions.push({
                       id: product.key,
                       displayValue: product.value
                   })
               })
           })
           .catch(error=> ToastsStore.error(error, 2000));

        let updatedSuggestions =  this.props.customerNames;;

        let updatedOrderForm = {...this.state.orderForm}

        let updatedProductTypeElement = { ...updatedOrderForm.productId}
         updatedProductTypeElement.elementConfig.options = productTypeOptions;

        let updatedQuantityElement = { ...updatedOrderForm.quantity}
         updatedProductTypeElement.elementConfig.options = productTypeOptions;

        let updatedOrders = [...this.state.orderDetails];
        let updatedTotalAmount = this.state.totalAmount;
        let updatedBalanceDue = this.state.balanceDue;
        if(this.props.isEditing){
            updatedOrders = [...this.props.rowData.orders];
            updatedTotalAmount = this.props.rowData.totalAmount;
        }
        if(this.props.receivedPayment || this.props.isAssigning) {
            updatedBalanceDue = this.props.rowData.balanceDue;
            await this.props.getReceiverNames()
                .then(()=>{
                    updatedSuggestions = this.props.receiverNames;
                })
                .catch(error=> ToastsStore.error(error, 2000));;;
         }
        updatedOrderForm.productId = updatedProductTypeElement;
        updatedOrderForm.quantity = updatedQuantityElement;

        this.setState({orderForm: updatedOrderForm, orderDetails: updatedOrders,
              totalAmount: updatedTotalAmount, suggestions: updatedSuggestions , balanceDue: updatedBalanceDue})
    }

    addOrderHandler =  (event) => {
        event.preventDefault();
        const deleteKeys = ['productId', 'amount', 'rate', 'quantity', 'modeOfPayment']
        const formData = { }
        for(let key in this.state.orderForm){
            formData[key] = this.state.orderForm[key].value
        }
        formData['orders'] = this.state.orderDetails;
        formData['totalAmount'] = this.state.totalAmount;
        formData['customerName'] = this.state.customerName;
        for(let key of deleteKeys){
            delete formData[key];
        }
        this.props.addOrder(formData).then(()=>{
            ToastsStore.success('Order Added Successfully!', 1000);
            setTimeout(() => {
                this.props.navigate('/order', {replace:true});
            }, 500)
        }).catch(error=> ToastsStore.error(error, 2000));
    }

    updateOrderHandler = (event) => {
        event.preventDefault();
        let editFormData = {
            orderId: this.props.rowData.orderId,
            orders: [...this.state.orderDetails],
            totalAmount: this.state.totalAmount,
        };

        this.props.updateOrder(editFormData).then(()=>{
            ToastsStore.success('Order Updated Successfully!', 1000);
            setTimeout(() => {
                window.location.reload();
            }, 500)
        }).catch(error=> ToastsStore.error(error, 2000));

    }

    assignOrderHandler = async (event) => {
        event.preventDefault();
        let assignOrderFormData = {
            assignUpdate: true,
            orderId: this.props.rowData.orderId,
            assigneeName: this.state.receiverName,
            updatedDate: new Date(),
            assignedStatus: this.props.isAssigning,
        };

        await this.props.updateOrder(assignOrderFormData).then(()=>{
            ToastsStore.success(ORDER_ASSIGNED_SUCCESSFULLY, 500);
            setTimeout(() => {
                window.location.reload();
            }, 500)
        }).catch(error=> ToastsStore.error(error, 2000));
    }

    inputChangeHandler = (event, keyIdentifier) => {
        if(keyIdentifier === 'customerName') {
            const userInput = event.target.value;

            const filtered = this.state.suggestions.filter(
                (suggestion) =>
                    suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );
            this.setState({customerName: userInput, filteredSuggestions: filtered, showSuggestion: true})
        }else{
            const updatedOrderForm = {...this.state.orderForm}
            const updatedElement = { ...updatedOrderForm[keyIdentifier]}
            if(keyIdentifier === 'orderDate'){
                updatedElement.value = event;
            }else{
                updatedElement.value = event.target.value;
            }
            updatedOrderForm[keyIdentifier] = updatedElement;
            this.setState({orderForm: updatedOrderForm})
        }
    }

    assigneeNameInputChangeHandler = (event) => {
        const userInput = event.target.value;

        const filtered = this.state.suggestions.filter(
            (suggestion) =>
                suggestion && suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
        this.setState({receiverName: userInput, filteredSuggestions: filtered, showSuggestion: true})
    }

    onClick = (event, id) => {
        if(this.props.receivedPayment) {
            let updatedReceivedPaymentDetails = [...this.state.receivedPaymentDetails]
            updatedReceivedPaymentDetails.map(receivedPayment => {
                if(receivedPayment.orderPaymentId === id){
                    receivedPayment.receiverName = event.target.innerText
                }
            })
            this.setState({filteredSuggestions:[], receivedPaymentDetails:updatedReceivedPaymentDetails, showSuggestion: false})
        }else if(this.props.isAssigning){
            this.setState({filteredSuggestions:[], receiverName:event.target.innerText, showSuggestion: false})
        }else{
            this.setState({filteredSuggestions:[], customerName:event.target.innerText, showSuggestion: false})
        }
    }

    multiOrderInputChangeHandler = (id, key ,event) => {
        let updatedTotalAmount = this.state.totalAmount;
            const newOrders = this.state.orderDetails.map(i => {
                if(id === i.orderDetailsId) {
                    i[key] = parseInt(event.target.value);
                    i['amount'] = i.rate * i.quantity;
                }
                return i;
            })

            updatedTotalAmount =  newOrders.map(order=>order.amount).reduce((prevAmount, currAmount) => prevAmount + currAmount,0)
            this.setState({orderDetails: newOrders, totalAmount: updatedTotalAmount })
    }

    receivedPaymentInputChangeHandler = (id, key, event) => {
        let filtered=[];
        let receiverNameInput=''
        let updatedShowSuggestion = this.state.showSuggestion;
        const newReceivedPayment = this.state.receivedPaymentDetails.map(i=>{
            if(id === i.orderPaymentId) {
              if(key === 'receiverName') {
                  receiverNameInput = event.target.value;

                 filtered = this.state.suggestions.filter(
                    (suggestion) =>
                        suggestion && suggestion.toLowerCase().indexOf(receiverNameInput.toLowerCase()) > -1
                );
                  updatedShowSuggestion = true;
                i[key] = receiverNameInput;
            }else{
                    if(key === 'paymentMode'){
                        i[key] = event.target.value;
                    }else if(key === 'receivedPaymentDate'){
                        i[key] = event
                    }
                    else {
                        i[key] = parseInt(event.target.value);
                    }
                }
            }
            return i;
        })

        this.setState({receivedPaymentDetails: newReceivedPayment, receiverName: receiverNameInput, filteredSuggestions: filtered, showSuggestion: updatedShowSuggestion})
    }

    addReceivedPaymentHandler = (event) => {
        event.preventDefault();
        let receivedPaymentFormData = {
            orderId: this.props.rowData.orderId,
            receivedPayments: [...this.state.receivedPaymentDetails],
        };
        const totalReceivedPayment = receivedPaymentFormData.receivedPayments.map(receivedPaymentItem => receivedPaymentItem.receivedAmount)
            .reduce((previousPayment, currentPayment) => previousPayment + currentPayment, 0)
        if(totalReceivedPayment > this.state.balanceDue){
           ToastsStore.error(RECEIVED_AMOUNT_GREATER_THAN_BALANCE_DUE, 2000)
            event.preventDefault()
        }else{
            this.props.addReceivedPayment(receivedPaymentFormData).then(()=>{
                ToastsStore.success(RECEIVED_AMOUNT_ADDED_SUCCESSFULLY, 1000);
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            }).catch(error=> ToastsStore.error(error, 2000));
        }
    }

    cancelHandler = () => {
        if(this.props.receivedPayment){
            this.props.navigate('/collection');
        }else{
            this.props.navigate('/order', {replace:true});
        }
    }

    moreOrderHandler = () => {
        let newOrders = [...this.state.orderDetails, {
            orderDetailsId: Math.random(),
            productId:'',
            quantity:'',
            rate:'',
            amount:'',
        }]
        this.setState({moreOrder: true, orderDetails: newOrders})
    }

    receivedPaymentHandler = () => {
        let newReceivedPayment = [...this.state.receivedPaymentDetails, {
            orderPaymentId: Math.random(),
            receivedAmount: '',
            paymentMode: '',
            receivedPaymentDate: '',
            receiverName:''
        }]
        this.setState({receivedPaymentDetails: newReceivedPayment,
            receivedPayment: true,
            paymentId: newReceivedPayment[newReceivedPayment.length-1].orderPaymentId,
            receiverName: '',
            receivedPaymentAddDisabled: false}
           )
    }

    removeOrderDetailHandler = (orderDetailId) => {
        let updatedOrderDetails =  [...this.state.orderDetails]
        let index = updatedOrderDetails.findIndex(order  => order.orderDetailsId === orderDetailId)
        updatedOrderDetails.splice(index, 1);
        this.setState({orderDetails: updatedOrderDetails})
    }
    render() {
        const formElementArray = [];
        const orderElement = ['productId', 'quantity', 'rate', 'amount' ];
        const elements = [ 'orderDate']
        const orderElementArray = [];
        const receivedPaymentElement = ['receivedAmount', 'paymentMode', 'receivedPaymentDate' ];
        const receivedPaymentElementArray = []
        for(let key in this.state.orderForm){

           if(!this.props.isEditing && elements.includes(key)) {
                formElementArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                })
            }

            if((this.state.moreOrder || this.props.isEditing) && orderElement.includes(key)){
                orderElementArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                })
            }

            if(this.state.receivedPayment && receivedPaymentElement.includes(key)){
                receivedPaymentElementArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                })
            }

        }
        return(
            <>
            <ToastsContainer position='top_center' store={ToastsStore} />
            <div className={ this.props.isEditing? classes.EditOrder : this.props.receivedPayment ? classes.ReceivedPayment : classes.Order}>
                <h4 className={classes.Title}>{ this.props.isEditing? 'Update Order Details' : this.props.receivedPayment ?'Enter Payment Details' : this.props.isAssigning ?
                    'Assign Order' : 'Enter Order Details'} </h4>
                <form>
                    {
                        <>
                         {!this.props.receivedPayment && !this.props.isEditing && !this.props.isAssigning && <Input elementType='input'
                               elementConfig={this.state.orderForm['billNo'].elementConfig}
                               value={this.state.orderForm['billNo'].value}
                               label={this.state.orderForm['billNo'].label}
                               changed={(event)=>this.inputChangeHandler( event, 'billNo' )}
                        />}
                        {!this.props.isEditing && !this.props.receivedPayment && !this.props.isAssigning &&
                            <>
                                <Input elementType='autocompleteInput'
                                       value={this.state.customerName}
                                       label={'Customer Name'}
                                       placeholder={'Enter or Select Customer Name'}
                                       changed={(event)=>this.inputChangeHandler(event, 'customerName' )}/>
                                {this.state.showSuggestion && this.state.customerName && <InputSuggestionList
                                    filteredSuggestions={this.state.filteredSuggestions}
                                    onClick={(event)=>this.onClick(event)
                                    }
                                />}
                            </>
                           }
                             {
                                !this.props.isEditing && !this.props.receivedPayment && !this.props.isAssigning &&
                                <div className={classes.AddMoreOrderTitle}>
                                    <p >Add Product Type and Quantity</p>
                                    <GoDiffAdded className={classes.addMoreOrderButton} onClick={this.moreOrderHandler}/>
                                </div>
                            }
                        </>
                    }
                    {  !this.props.isAssigning &&
                        this.state.orderDetails.map((order)=>(
                            <div className={classes.moreOrderElement} key={order.orderDetailsId}>
                                {orderElementArray.map(ele => (
                                    <Input elementType={ele.config.elementType}
                                           elementConfig={ele.config.elementConfig}
                                           value={order[ele.id]}
                                           label={ele.config.label}
                                           changed={(event)=>this.multiOrderInputChangeHandler( order.orderDetailsId, ele.id, event )}
                                    />
                                ) )}
                                {!this.props.isEditing && <CgCloseO onClick={()=>this.removeOrderDetailHandler(order.orderDetailsId)} className={classes.CloseIcon}/>}
                            </div>
                        ))
                    }
                    {  this.props.receivedPayment &&
                        <>
                       <div className={classes.ReceivedPaymentTitle}>
                            <p> Received Payment?</p>
                            <GoDiffAdded className={classes.addMoreOrderButton} onClick={this.receivedPaymentHandler}/>
                        </div>
                        {this.state.receivedPaymentDetails.map((receivedPayment)=>(
                            <div className={classes.moreOrderElement} key={receivedPayment.orderPaymentId}>
                                {receivedPaymentElementArray.map(ele => (
                                        <Input elementType={ele.config.elementType}
                                               elementConfig={ele.config.elementConfig}
                                               value={receivedPayment[ele.id]}
                                               label={ele.config.label}
                                               changed={(event)=>this.receivedPaymentInputChangeHandler( receivedPayment.orderPaymentId, ele.id, event )}
                                        />
                                ) )}
                                <div>
                                    <Input elementType='autocompleteInput'
                                           value={receivedPayment['receiverName']}
                                           label={'Receiver Name'}
                                           placeholder={'Enter or Select Receiver Name'}
                                           changed={(event)=>this.receivedPaymentInputChangeHandler(receivedPayment.orderPaymentId, 'receiverName', event )}/>
                                    {this.state.showSuggestion && this.state.paymentId === receivedPayment.orderPaymentId && <InputSuggestionList
                                        filteredSuggestions={this.state.filteredSuggestions}
                                        onClick={(event)=>this.onClick(event, receivedPayment.orderPaymentId)}

                                    />}
                                </div>
                            </div>
                            ))}</>
                    }
                    {
                        this.props.isAssigning &&
                            <div>
                                <Input elementType='autocompleteInput'
                                       value={this.state.receiverName}
                                       label={'Receiver Name'}
                                       placeholder={'Enter or Select Receiver Name'}
                                       changed={(event)=>this.assigneeNameInputChangeHandler( event )}/>
                                {this.state.showSuggestion && this.state.receiverName && <InputSuggestionList
                                    filteredSuggestions={this.state.filteredSuggestions}
                                    onClick={(event)=>this.onClick(event )
                                    }
                                />}
                            </div>
                    }
                    {!this.props.receivedPayment && !this.props.isAssigning && formElementArray.map(formElement => (
                            <Input elementType={formElement.config.elementType}
                                   elementConfig={formElement.config.elementConfig}
                                   value={formElement.config.value}
                                   label={formElement.config.label}
                                   changed={(event)=>this.inputChangeHandler(event,formElement.id )}/>
                    ) )}
                    {this.props.isEditing || this.state.moreOrder ? <p className={classes.TotalAmount}> TOTAL AMOUNT : {this.state.totalAmount}</p>: this.state.receivedPayment ?
                    <p className={classes.TotalAmount}>  BALANCE DUE : {this.state.balanceDue}</p> : null}

                    { this.props.isEditing?  <Button btnType='Success' clicked={this.updateOrderHandler}> UPDATE </Button> :
                        this.props.receivedPayment ?  <Button btnType='Success' disabled={this.state.receivedPaymentAddDisabled} clicked={this.addReceivedPaymentHandler}> ADD </Button> :
                            this.props.isAssigning ?  <Button btnType='Success' clicked={this.assignOrderHandler}> ASSIGN </Button> :
                        <Button btnType='Success' clicked={this.addOrderHandler}> ADD </Button>}
                    <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>
                </form>
            </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
      masterData: state.masterData,
      customerNames: state.customerNames,
      receiverNames: state.receiverNames,
    };
  }

const Order = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedOrder)

export default Order;
