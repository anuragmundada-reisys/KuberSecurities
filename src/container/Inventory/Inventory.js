import React, {Component} from 'react';
import Button from '../../component/UI/Button/Button';
import Input from '../../component/UI/FormElement/FormElement';
import classes from './Inventory.module.css';
import { addInventory } from '../../redux/action/InventoryAction';
import { getMasterData } from '../../redux/action/MasterDataAction';
import { connect } from 'react-redux';
import {ToastsContainer, ToastsStore} from "react-toasts";
import {ADDED_ITEMS_TO_INVENTORY, RECEIVED_AMOUNT_ADDED_SUCCESSFULLY} from "../../common/Utils";
import {ToastContainer} from "react-toastify";

function mapDispatchToProps(dispatch) {
    return {
        addInventory: inventory => dispatch(addInventory(inventory)),
        getMasterData: ()=> dispatch(getMasterData())
    };
}

class ConnectedInventory extends Component {
    state ={
        inventoryForm : {
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
                    placeHolder: 'Enter Number of Cases'
                },
                value: '',
                label: 'Quantity'
            },
            productionDate: {
                elementType: 'datePicker',
                elementConfig: {
                    name: 'startDate',
                    placeholder: 'Select Ordered Date',
                },
                value: '',
                label: 'Production Date'
            },
        },
    }

  async componentDidMount(){
      
       await this.props.getMasterData().catch(error=> ToastsStore.error(error, 2000));
        const productTypeOptions =[];

      this.props.masterData.productType && this.props.masterData.productType.map(product => {
            return productTypeOptions.push({
                 id: product.key,
                 displayValue: product.value
          })
        })
        
        let updatedInventoryForm = {...this.state.inventoryForm}
     
        let updatedProductTypeElement = { ...updatedInventoryForm.productId}
         updatedProductTypeElement.elementConfig.options = productTypeOptions;
         updatedInventoryForm.productId = updatedProductTypeElement; 

        this.setState({inventoryForm: updatedInventoryForm })
    }


    addInventoryHandler = (event) => {
        event.preventDefault();

        const integerConvertibleKeys = ['productId', 'quantity'];

         const formData = {};
        for(let key in this.state.inventoryForm){
            if(integerConvertibleKeys.includes(key)){
                formData[key] = parseInt(this.state.inventoryForm[key].value)
            }else{
                formData[key] = this.state.inventoryForm[key].value
            }
        }
        this.props.addInventory(formData).then(()=>{
            ToastsStore.success(ADDED_ITEMS_TO_INVENTORY, 1500);
            setTimeout(() => {
                this.props.navigate('/inventory', {replace:true});
            }, 500)
        }).catch(error=> ToastsStore.error(error, 2000));


    }

    inputChangeHandler = (event, keyIdentifier) => {
        const updatedInventoryForm = {...this.state.inventoryForm}
        const updatedElement = { ...updatedInventoryForm[keyIdentifier]}
        if(keyIdentifier === 'productionDate'){
             updatedElement.value = event;
        }else{
            updatedElement.value = event.target.value;
        }
        updatedInventoryForm[keyIdentifier] = updatedElement;
        this.setState({inventoryForm: updatedInventoryForm})
    }

    cancelHandler = () => {
        this.props.navigate('/inventory', {replace:true});
    }

    render() {
        const formElementArray = [];
        for(let key in this.state.inventoryForm){
            formElementArray.push({
                id: key,
                config: this.state.inventoryForm[key]
            })
        }
        return(
            <>
            <ToastsContainer position='top_center' store={ToastsStore} />
            <div className={classes.Inventory}>
                <h4 className={classes.Title}>Enter Production Details</h4>
                <form>
                    {formElementArray.map(formElement => (
                        <Input elementType={formElement.config.elementType}
                         elementConfig={formElement.config.elementConfig} 
                         value={formElement.config.value}
                         label={formElement.config.label}
                         changed={(event)=>this.inputChangeHandler(event,formElement.id )}/>
                    ) )}
                    <Button btnType='Success' clicked={this.addInventoryHandler}> ADD </Button>
                    <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>
                </form>
            </div>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
      masterData: state.masterData
    };
  }

const Inventory = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedInventory)

export default Inventory;
