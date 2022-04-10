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
    ALL_FIELDS_ARE_REQUIRED,
    ASSIGN_ORDER,
    ENTER_ORDER_DETAILS,
    ENTER_PAYMENT_DETAILS,
    isValidInput, ORDER_ADDED_SUCCESSFULLY,
    ORDER_ASSIGNED_SUCCESSFULLY, ORDER_UPDATED_SUCCESSFULLY, PLEASE_ADD_ASSIGNEE_NAME,
    RECEIVED_AMOUNT_ADDED_SUCCESSFULLY,
    RECEIVED_AMOUNT_GREATER_THAN_BALANCE_DUE, UPDATE_ORDER_DETAILS
} from "../../common/Utils";
import { formatInTimeZone } from 'date-fns-tz'

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
                    min: 0,
                    placeHolder: 'Enter Ordered Quantity'
                },
                value: '',
                label: 'Quantity'
            },
            freeQuantity: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    min: 0,
                    placeHolder: 'Enter Free Quantity'
                },
                value: '',
                label: 'Free Quantity'
            },
            rate: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    min: 0,
                    placeHolder: 'Enter Rate'
                },
                value: '',
                label: 'Rate'
            },
            amount: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    min: 0,
                    required: true
                },
                value: '',
                label: 'Amount'
            },
            receivedAmount: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    min: 0
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
        assigneeNameError: false,
        receivedPaymentAddDisabled: true,
        receivedPaymentError: false,
        orderError: false,
        updateOrderError: false,
    }

  async componentDidMount(){
      const productTypeOptions =[];
      let updatedSuggestions = [];

      //Get master and assign Product_Type options
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

       let updatedOrderForm = {...this.state.orderForm}

       let updatedProductTypeElement = { ...updatedOrderForm.productId}
       updatedProductTypeElement.elementConfig.options = productTypeOptions;
       updatedOrderForm.productId = updatedProductTypeElement;

        //Get existing customer names for suggestions
        await this.props.getCustomerNames().then(()=>{
            updatedSuggestions =  this.props.customerNames;
        }).catch(error=> ToastsStore.error(error, 2000));

      // let updatedQuantityElement = { ...updatedOrderForm.quantity}
       //  updatedProductTypeElement.elementConfig.options = productTypeOptions;

        let updatedOrders = [...this.state.orderDetails];
        let updatedTotalAmount = this.state.totalAmount;
        let updatedBalanceDue = this.state.balanceDue;

        //If editing order, assign initial state of order details and total amount to row data
        if(this.props.isEditing){
            updatedOrders = [...this.props.rowData.orders];
            updatedTotalAmount = this.props.rowData.totalAmount;
        }

        //Received Payment or bill is getting assigned to someone, get balance due and receiver names suggestions
        if(this.props.receivedPayment || this.props.isAssigning) {
            updatedBalanceDue = this.props.rowData.balanceDue;
            await this.props.getReceiverNames()
                .then(()=>{
                    updatedSuggestions = this.props.receiverNames;
                })
                .catch(error=> ToastsStore.error(error, 2000));;;
         }
       // updatedOrderForm.quantity = updatedQuantityElement;

        this.setState({orderForm: updatedOrderForm, orderDetails: updatedOrders,
              totalAmount: updatedTotalAmount, suggestions: updatedSuggestions , balanceDue: updatedBalanceDue})
    }

    addOrderHandler =  (event) => {
        event.preventDefault();
        let valid = true;

        //adding keys from order form in state to form data
        const orderFormKeys = ['billNo', 'orderDate']
        const formData = { }
        for(let key in this.state.orderForm){
            if(orderFormKeys.includes(key)) {
                if (key === 'orderDate') {
                    formData[key] = formatInTimeZone(this.state.orderForm[key].value, 'IST', 'yyy-MM-dd')
                } else {
                    formData[key] = this.state.orderForm[key].value
                }
            }
        }
        formData['orders'] = this.state.orderDetails;
        formData['totalAmount'] = this.state.totalAmount;
        formData['customerName'] = this.state.customerName;

        //validating order form keys
        for(let key in formData){
            if(key!=='orders'){
                valid = isValidInput(formData[key])
                if(!valid){
                    this.setState({orderError: true})
                    return;
                }
            }
        }

        //validating orders in order form
        formData.orders.length !== 0 && formData.orders.forEach(order => {
          for(let key in order){
              valid = isValidInput(order[key])
              if(!valid){
                  this.setState({orderError: true})
                  return;
              }
          }
        })
        valid &&
        this.props.addOrder(formData).then(()=>{
            ToastsStore.success(ORDER_ADDED_SUCCESSFULLY, 1000);
            setTimeout(() => {
                this.props.navigate('/order', {replace:true});
                }, 500)
         }).catch(error=> ToastsStore.error(error, 2000));
    }

    updateOrderHandler = (event) => {
        let valid = true;
        event.preventDefault();
        let editFormData = {
            orderId: this.props.rowData && this.props.rowData.orderId,
            orders: [...this.state.orderDetails],
            totalAmount: this.state.totalAmount,
        };

        //validating order
        editFormData.orders.length !== 0 && editFormData.orders.forEach(order => {
            for(let key in order){
                valid = isValidInput(order[key])
                if(!valid){
                    this.setState({updateOrderError: true})
                    return;
                }
            }
        })
        valid &&
        this.props.updateOrder(editFormData).then(()=>{
            ToastsStore.success(ORDER_UPDATED_SUCCESSFULLY, 1000);
            setTimeout(() => {
                window.location.reload();
            }, 500)
        }).catch(error=> ToastsStore.error(error, 2000));
      }

    inputChangeHandler = (event, keyIdentifier) => {
        //set customer name and suggestions
        if(keyIdentifier === 'customerName') {
            const userInput = event.target.value;
            const filtered = this.state.suggestions.filter(
                (suggestion) =>
                    suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
            );
            this.setState({customerName: userInput, filteredSuggestions: filtered, showSuggestion: true, orderError: false})
        }else{
            const updatedOrderForm = {...this.state.orderForm}
            const updatedElement = { ...updatedOrderForm[keyIdentifier]}
            if(keyIdentifier === 'orderDate'){
                updatedElement.value = event;
            }else{
                updatedElement.value = event.target.value;
            }
            updatedOrderForm[keyIdentifier] = updatedElement;
            this.setState({orderForm: updatedOrderForm, orderError: false})
        }
    }

    //customer names and receiver names suggestion list on click
    onClick = (event, id) => {
        //assigning clicked value from suggestions
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

    //adding multiple orders
    multiOrderInputChangeHandler = (id, key ,event) => {
            const newOrders = this.state.orderDetails.map(order => {
                if(id === order.orderDetailsId) {
                    order[key] = parseInt(event.target.value);
                    order['amount'] = order.rate * order.quantity;
                }
                return order;
            })

            //calculating total amount of all product types in order
            let updatedTotalAmount =  newOrders.map(order=>order.amount).reduce((prevAmount, currAmount) => prevAmount + currAmount,0)
            this.setState({orderDetails: newOrders, totalAmount: updatedTotalAmount, orderError: false, updateOrderError: false })
    }

    assigneeNameInputChangeHandler = (event) => {
        const userInput = event.target.value;

        const filtered = this.state.suggestions.filter(
            (suggestion) =>
                suggestion && suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
        this.setState({receiverName: userInput, filteredSuggestions: filtered, showSuggestion: true, assigneeNameError: false})
    }

    assignOrderHandler = async (event) => {
        event.preventDefault();
        let assignOrderFormData = {
            assignUpdate: true,
            orderId: this.props.rowData && this.props.rowData.orderId,
            assigneeName: this.state.receiverName,
            assignedUpdatedDate: new Date(),
            assignedStatus: this.props.isAssigning,
        };
        let valid = isValidInput(assignOrderFormData.assigneeName);
        if(valid){
            await this.props.updateOrder(assignOrderFormData).then(()=>{
                ToastsStore.success(ORDER_ASSIGNED_SUCCESSFULLY, 500);
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            }).catch(error=> ToastsStore.error(error, 2000));
        }else{
            this.setState({assigneeNameError: true})
        }
    }

    receivedPaymentInputChangeHandler = (id, key, event) => {
        let filtered=[];
        let receiverNameInput=''
        let updatedShowSuggestion = this.state.showSuggestion;
        const newReceivedPayment = this.state.receivedPaymentDetails.map(receivedPayment=>{
            if(id === receivedPayment.orderPaymentId) {
              if(key === 'receiverName') {
                  receiverNameInput = event.target.value;

                 filtered = this.state.suggestions.filter(
                    (suggestion) =>
                        suggestion && suggestion.toLowerCase().indexOf(receiverNameInput.toLowerCase()) > -1
                );
                  updatedShowSuggestion = true;
                  receivedPayment[key] = receiverNameInput;
            }else{
                    if(key === 'paymentMode'){
                        receivedPayment[key] = event.target.value;
                    }else if(key === 'receivedPaymentDate'){
                        receivedPayment[key] = event
                    }
                    else {
                        receivedPayment[key] = parseInt(event.target.value);
                    }
                }
            }
            return receivedPayment;
        })

        this.setState({receivedPaymentDetails: newReceivedPayment, receiverName: receiverNameInput,
            filteredSuggestions: filtered,
            showSuggestion: updatedShowSuggestion,
            receivedPaymentError: false
        })
    }

    addReceivedPaymentHandler = (event) => {
        event.preventDefault();
        let valid = true;
        let receivedPaymentFormData = {
            orderId: this.props.rowData && this.props.rowData.orderId,
            receivedPayments: [...this.state.receivedPaymentDetails],
        };
        receivedPaymentFormData.receivedPayments.forEach(receivedPayment => {
            for (let key in receivedPayment) {
                valid = isValidInput(receivedPayment[key])
                if(!valid){
                    return;
                }
            }
        });
        const totalReceivedPayment = receivedPaymentFormData.receivedPayments.map(receivedPaymentItem => receivedPaymentItem.receivedAmount)
            .reduce((previousPayment, currentPayment) => previousPayment + currentPayment, 0)
        if(totalReceivedPayment > this.state.balanceDue){
           ToastsStore.error(RECEIVED_AMOUNT_GREATER_THAN_BALANCE_DUE, 2000)
            event.preventDefault()
        }else if(!valid){
            this.setState({receivedPaymentError: true})
        }else{
            !this.state.receivedPaymentError && this.props.addReceivedPayment(receivedPaymentFormData).then(()=>{
                ToastsStore.success(RECEIVED_AMOUNT_ADDED_SUCCESSFULLY, 1000);
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            }).catch(error=> ToastsStore.error(error, 2000));
        }
    }

    cancelHandler = () => {
        if(this.props.receivedPayment){
           window.location.reload(); // Instead of reloading page, right thing to be done
        }else{
            this.props.navigate('/order', {replace:true});
        }
    }

    //on clicking add more button on order, it adds object of order details which can then be rendered and manipulated
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

    //on clicking add more button on received payment, it adds object of received payment which can then be rendered and manipulated
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

    //on clicking remove button removing specified order details which was rendered on clicking add more
    removeOrderDetailHandler = (orderDetailId) => {
        let updatedOrderDetails =  [...this.state.orderDetails];
        let updatedTotalAmount = this.state.totalAmount;
        let index = updatedOrderDetails.findIndex(order  => order.orderDetailsId === orderDetailId)
        let amount = updatedOrderDetails[index].amount;
        updatedTotalAmount = updatedTotalAmount - amount;
        updatedOrderDetails.splice(index, 1);
        this.setState({orderDetails: updatedOrderDetails, totalAmount: updatedTotalAmount })
    }

    //on clicking remove button removing specified payment details which was rendered on clicking add more
    removeReceivedPaymentHandler = (orderPaymentId) => {
        let updatedReceivedPaymentDetails =  [...this.state.receivedPaymentDetails]
        let index = updatedReceivedPaymentDetails.findIndex(receivedPayment  => receivedPayment.orderPaymentId === orderPaymentId)
        updatedReceivedPaymentDetails.splice(index, 1);
        this.setState({receivedPaymentDetails: updatedReceivedPaymentDetails, receivedPaymentError: false})
    }

    render() {
        //forming array to render elements as per conditions (adding or updating order, received payment )
        const formElementArray = [];

        //to display add more order element
        const orderElement = ['productId', 'quantity', 'freeQuantity', 'rate', 'amount' ];
        const orderElementArray = [];

        //only to display order date at end of form
        const elements = [ 'orderDate']

        //to display received payment
        const receivedPaymentElement = ['receivedAmount', 'paymentMode', 'receivedPaymentDate' ];
        const receivedPaymentElementArray = []

        for(let key in this.state.orderForm){
            //render order date on add order form only
           if(!this.props.isEditing && !this.props.receivedPayment && !this.props.isAssigning && elements.includes(key)) {
                formElementArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                })
            }

           //render product details in order(productId, quantity, rate, amount) when clicked on add more order or edit order
            if((this.state.moreOrder || this.props.isEditing) && orderElement.includes(key)){
                orderElementArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                })
            }

            //render received payment
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
                <h4 className={classes.Title}>{
                    this.props.isEditing? UPDATE_ORDER_DETAILS :
                    this.props.receivedPayment ?ENTER_PAYMENT_DETAILS :
                    this.props.isAssigning ?  ASSIGN_ORDER :
                     ENTER_ORDER_DETAILS}
                </h4>
                <form>
                      { /*Add and Update Order Form render */}
                      {
                         !this.props.receivedPayment && !this.props.isEditing && !this.props.isAssigning &&
                           <>
                             <Input elementType='input'
                               elementConfig={this.state.orderForm['billNo'].elementConfig}
                               value={this.state.orderForm['billNo'].value}
                               label={this.state.orderForm['billNo'].label}
                               changed={(event)=>this.inputChangeHandler( event, 'billNo' )}
                               />
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
                               <div className={classes.AddMoreOrderTitle}>
                                   <p >Add Product Type and Quantity</p>
                                   <GoDiffAdded className={classes.AddMoreOrderButton} onClick={this.moreOrderHandler}/>
                               </div>
                             </>
                          }
                         {/* render this on add order form and edit order - look for orderElementArray in render*/}
                         {
                           this.state.orderDetails.map((order)=>(
                            <div className={classes.MoreOrderElement} key={order.orderDetailsId}>
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
                       {/* Displaying order date on add Order Form only -- look for formElement array in render*/}
                       {  formElementArray.map(formElement => (
                        <Input elementType={formElement.config.elementType}
                               elementConfig={formElement.config.elementConfig}
                               value={formElement.config.value}
                               label={formElement.config.label}
                               changed={(event)=>this.inputChangeHandler(event,formElement.id )}/>
                       ) )}

                      { /* Received payment render */}
                      {  this.props.receivedPayment &&
                        <>
                        <div className={classes.ReceivedPaymentTitle}>
                            <p> Received Payment?</p>
                            <GoDiffAdded className={classes.AddMoreOrderButton} onClick={this.receivedPaymentHandler}/>
                        </div>
                        {this.state.receivedPaymentDetails.map((receivedPayment)=>(
                            <div className={classes.MorePaymentElement} key={receivedPayment.orderPaymentId}>
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
                                <CgCloseO onClick={()=>this.removeReceivedPaymentHandler(receivedPayment.orderPaymentId)} className={classes.CloseIcon}/>
                            </div>
                            ))}
                        {this.state.receivedPaymentError && <span className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED} </span>}
                        </>
                     }
                    { /*Assign order render*/}
                    {
                        this.props.isAssigning &&
                        <>
                            <Input elementType='autocompleteInput'
                                   value={this.state.receiverName}
                                   label={'Assignee Name'}
                                   placeholder={'Enter or Select Receiver Name'}
                                   changed={(event) => this.assigneeNameInputChangeHandler(event)}/>
                             {this.state.showSuggestion && this.state.receiverName && <InputSuggestionList
                                filteredSuggestions={this.state.filteredSuggestions}
                                onClick={(event) => this.onClick(event)
                                }
                            />}
                            {this.state.assigneeNameError && <p className={classes.ErrorMessage}> {PLEASE_ADD_ASSIGNEE_NAME}</p>}
                        </>
                    }


                    {this.state.orderError && <p className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED}</p>}
                    {this.props.isEditing && this.state.updateOrderError && <p className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED}</p>}
                    {this.props.isEditing || this.state.moreOrder ? <p className={classes.TotalAmount}> TOTAL AMOUNT : {this.state.totalAmount}</p>: this.state.receivedPayment ?
                    <p className={classes.TotalAmount}>  BALANCE DUE : {this.state.balanceDue}</p> : null}

                    { this.props.isEditing?  <Button btnType='Success' clicked={this.updateOrderHandler}> UPDATE </Button> :
                        this.props.receivedPayment ?  <Button btnType='Success' disabled={this.state.receivedPaymentAddDisabled} clicked={this.addReceivedPaymentHandler}> ADD </Button> :
                            this.props.isAssigning ?  <Button btnType='Success' clicked={this.assignOrderHandler}> ASSIGN </Button> :
                        <Button btnType='Success' clicked={this.addOrderHandler}> ADD </Button>}
                    <Button btnType='Danger' clicked={this.cancelHandler} > CANCEL </Button>
                </form>
            </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
      masterData: state.localSales.masterData,
      customerNames: state.localSales.customerNames,
      receiverNames: state.localSales.receiverNames,
    };
  }

const Order = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedOrder)

export default Order;
