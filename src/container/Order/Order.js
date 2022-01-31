import React, {Component} from 'react';
import Button from '../../component/UI/Button/Button';
import Input from '../../component/UI/FormElement/FormElement';
import classes from './Order.module.css';
import { addOrder } from '../../redux/action/OrderAction';
import { getMasterData } from '../../redux/action/MasterDataAction';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
    return {
        addOrder: order => dispatch(addOrder(order)),
        getMasterData: ()=> dispatch(getMasterData())
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
         updatedOrderForm.productId = updatedProductTypeElement; 

        this.setState({orderForm: updatedOrderForm })
    }


    addOrderHandler = (event) => {
        event.preventDefault();

        const integerConvertibleKeys = ['productId', 'quantity'];

         const formData = {};
        for(let key in this.state.orderForm){
            if(integerConvertibleKeys.includes(key)){
                formData[key] = parseInt(this.state.orderForm[key].value)
            }else if(key === 'status'){
                formData[key] = JSON.parse(this.state.orderForm[key].value)
            }else{
                formData[key] = this.state.orderForm[key].value
            }
           
        }
        this.props.addOrder(formData);
        alert('form submitted!')
        this.props.navigate('/order', {replace:true});
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

    cancelHandler = () => {
        this.props.navigate('/order', {replace:true});
        alert('Cancel!!')
    }

    render() {
        const formElementArray = [];
        for(let key in this.state.orderForm){
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        return(
            <div className={classes.Order}>
                <h4 className={classes.Title}>Enter Order Details</h4>
                <form>
                    {formElementArray.map(formElement => (
                        <Input elementType={formElement.config.elementType}
                         elementConfig={formElement.config.elementConfig} 
                         value={formElement.config.value}
                         label={formElement.config.label}
                         changed={(event)=>this.inputChangeHandler(event,formElement.id )}/>
                    ) )}
                    <Button btnType='Success' clicked={this.addOrderHandler}> ADD </Button>
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
