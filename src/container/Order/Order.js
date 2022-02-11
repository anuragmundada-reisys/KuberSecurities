import React, {Component} from 'react';
import Button from '../../component/UI/Button/Button';
import Input from '../../component/UI/FormElement/FormElement';
import classes from './Order.module.css';
import { addOrder, updateOrder } from '../../redux/action/OrderAction';
import { getMasterData } from '../../redux/action/MasterDataAction';
import { connect } from 'react-redux';
import { GoDiffAdded } from 'react-icons/go';
import { v4 as uuidv } from 'uuid';

function mapDispatchToProps(dispatch) {
    return {
        addOrder: order => dispatch(addOrder(order)),
        updateOrder: order => dispatch(updateOrder(order)),
        getMasterData: ()=> dispatch(getMasterData()),
    };
}

class ConnectedOrder extends Component {

    state ={
        orderForm : {
            customerName: {
                elementType: 'input',
                elementConfig: {
                  type: 'text',
                  placeholder: 'Enter Customer Name',
                },
                value: '',
                label: 'Customer Name'
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
            status: {
                elementType: 'select',
                elementConfig: {
                  options: [
                      {id: true, displayValue: 'Success'},
                      {id: false, displayValue: 'Pending'}
                  ],
                  placeholder: 'Select Status'
                },
                value: '',
                label: 'Status',
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
        orders: [],
        editOrders:[],
        totalAmount: 0,
    }

  async componentDidMount(){
      
       await this.props.getMasterData();
        const productTypeOptions =[];

        this.props.masterData.productType.map(product => {
            return productTypeOptions.push({
                 id: product.key,
                 displayValue: product.value
          })
        })
        
        let updatedOrderForm = {...this.state.orderForm}

        let updatedProductTypeElement = { ...updatedOrderForm.productId}
         updatedProductTypeElement.elementConfig.options = productTypeOptions;

        let updatedQuantityElement = { ...updatedOrderForm.quantity}
        let updatedStatusElement = { ...updatedOrderForm.status}
         updatedProductTypeElement.elementConfig.options = productTypeOptions;

         let updatedOrders = [...this.state.editOrders];
        let updatedTotalAmount = this.state.totalAmount;
        if(this.props.isEditing){
            updatedStatusElement.elementConfig.placeholder = '';
            updatedStatusElement.value = this.props.rowData.status
            updatedOrders = [...this.props.rowData.orders];
            updatedTotalAmount = this.props.rowData.totalAmount;
        }
          updatedOrderForm.productId = updatedProductTypeElement;
          updatedOrderForm.quantity = updatedQuantityElement;
          updatedOrderForm.status = updatedStatusElement;

          this.setState({orderForm: updatedOrderForm, editOrders: updatedOrders, totalAmount: updatedTotalAmount })
    }

    addOrderHandler = (event) => {
        event.preventDefault();
        const formData = { }
        for(let key in this.state.orderForm){
            if(key === 'status'){
                formData[key] = JSON.parse(this.state.orderForm[key].value)
            }else{
                formData[key] = this.state.orderForm[key].value
            }
        }
        formData['orders'] = this.state.orders;
        formData['totalAmount'] = this.state.totalAmount;
        delete formData.productId;
        delete formData.quantity;
        console.log(formData)
        this.props.addOrder(formData);
        alert('form submitted!')
        this.props.navigate('/order', {replace:true});
    }

    updateOrderHandler = (event) => {
        event.preventDefault();
        let editFormData = {
            orderId: this.props.rowData.orderId,
            status: JSON.parse(this.state.orderForm['status'].value),
            orders: [...this.state.editOrders],
            totalAmount: this.state.totalAmount,
        };

        this.props.updateOrder(editFormData);
        alert('form submitted!');
        window.location.reload();
    }

    inputChangeHandler = (event, keyIdentifier) => {
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

    multiOrderInputChangeHandler = (id, key ,event) => {
        let updatedTotalAmount = this.state.totalAmount;

        if(this.props.isEditing) {
            const newEditedOrders = this.state.editOrders.map(i => {
                if(id === i.orderDetailsId) {
                    i[key] = parseInt(event.target.value);
                    i['amount'] = i.rate * i.quantity;
                    //updatedTotalAmount = updatedTotalAmount + i.amount;
                }
                return i;
            })
            updatedTotalAmount =  newEditedOrders.map(order=>order.amount).reduce((prevAmount, currAmount) => prevAmount + currAmount,0)
            this.setState({editOrders: newEditedOrders, totalAmount: updatedTotalAmount })
        }else{
            const newOrders = this.state.orders.map(i => {
                if(id === i.id) {
                    i[key] = parseInt(event.target.value);
                    i['amount'] = i.rate * i.quantity;
                }
                return i;
            })

            updatedTotalAmount =  newOrders.map(order=>order.amount).reduce((prevAmount, currAmount) => prevAmount + currAmount,0)
            this.setState({orders: newOrders, totalAmount: updatedTotalAmount })
        }
    }

    cancelHandler = () => {
        this.props.navigate('/order', {replace:true});
        alert('Cancel!!')
    }

    moreOrderHandler = () => {
        let newOrders = [...this.state.orders, {
            id: uuidv(),
            productId:'',
            quantity:'',
            rate:'',
            amount:'',
        }]
        this.setState({moreOrder: true, orders: newOrders})
    }
    render() {
        const formElementArray = [];
        const editFormElement = ['status'];
        const orderElement = ['productId', 'quantity', 'rate', 'amount'];
        const statusAndDate = ['status', 'orderDate']
        const orderElementArray = [];
        for(let key in this.state.orderForm){
            if(this.props.isEditing && editFormElement.includes(key)){
                formElementArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                })
            }else if(!this.props.isEditing && statusAndDate.includes(key)) {
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

        }
        return(
            <div className={ this.props.isEditing? classes.EditOrder : classes.Order}>
                <h4 className={classes.Title}>{ this.props.isEditing? 'Update Order Details' : 'Enter Order Details'}</h4>
                <form>
                    {
                        !this.props.isEditing &&
                        <>
                            <Input elementType={this.state.orderForm['customerName'].elementType}
                                   elementConfig={this.state.orderForm['customerName'].elementConfig}
                                   value={this.state.orderForm['customerName'].value}
                                   label={this.state.orderForm['customerName'].label}
                                   changed={(event)=>this.inputChangeHandler(event, 'customerName' )}/>
                            <div className={classes.addMoreOrder}>
                                <p >Add Product Type and Quantity</p>
                                <GoDiffAdded className={classes.addMoreOrderButton} onClick={this.moreOrderHandler}/>
                            </div>
                        </>
                    }

                      { this.props.isEditing ?
                          this.state.editOrders.map((order)=>(
                              <div className={classes.moreOrderElement} key={order.orderDetailsId}>
                                  {orderElementArray.map(ele => (
                                      <Input elementType={ele.config.elementType}
                                             elementConfig={ele.config.elementConfig}
                                             value={order[ele.id]}
                                             label={ele.config.label}
                                             changed={(event)=>this.multiOrderInputChangeHandler( order.orderDetailsId, ele.id, event )}
                                            />
                                  ) )}
                              </div>
                          )) :
                          this.state.orders.map((order)=>(
                          <div className={classes.moreOrderElement} key={order.id}>
                              {orderElementArray.map(ele => (
                                  <Input elementType={ele.config.elementType}
                                         elementConfig={ele.config.elementConfig}
                                         value={order[ele.id]}
                                         label={ele.config.label}
                                         changed={(event)=>this.multiOrderInputChangeHandler( order.id, ele.id, event )}/>
                              ) )}
                          </div>
                      ))}
                    {formElementArray.map(formElement => (
                            <Input elementType={formElement.config.elementType}
                                   elementConfig={formElement.config.elementConfig}
                                   value={formElement.config.value}
                                   label={formElement.config.label}
                                   changed={(event)=>this.inputChangeHandler(event,formElement.id )}/>
                    ) )}
                    {this.props.isEditing || this.state.moreOrder ? <p className={classes.TotalAmount}> TOTAL AMOUNT : {this.state.totalAmount}</p>: null}

                    { this.props.isEditing?  <Button btnType='Success' clicked={this.updateOrderHandler}> UPDATE </Button> :
                        <Button btnType='Success' clicked={this.addOrderHandler}> ADD </Button>}
                    <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
      masterData: state.masterData
    };
  }

const Order = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedOrder)

export default Order;
