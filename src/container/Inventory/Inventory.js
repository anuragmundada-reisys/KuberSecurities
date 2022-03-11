import React, {Component} from 'react';
import Button from '../../component/UI/Button/Button';
import Input from '../../component/UI/FormElement/FormElement';
import classes from './Inventory.module.css';
import { addInventory } from '../../redux/action/InventoryAction';
import { getMasterData } from '../../redux/action/MasterDataAction';
import { connect } from 'react-redux';
import {ToastsContainer, ToastsStore} from "react-toasts";
import authHeader, {
    ADDED_ITEMS_TO_INVENTORY,
    ALL_FIELDS_ARE_REQUIRED,
    isValidInput,
    PLEASE_ADD_RECEIVED_PRODUCTS
} from "../../common/Utils";
import {GoDiffAdded} from "react-icons/go";
import {CgCloseO} from "react-icons/cg";

function mapDispatchToProps(dispatch) {
    return {
        addInventory: (inventory, header) => dispatch(addInventory(inventory, header)),
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
                    placeholder: 'Select Date',
                },
                value: '',
                label: 'Production Date'
            },
        },
        inventoryError: false,
        productDetails: [],
        addProduct: false,
        inventoryAddDisabled: true,
        productReceivedDate: '',
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

        let valid = true;
         const formData = {
             productReceivedDate: this.state.productReceivedDate,
             products: this.state.productDetails
         };

         if(formData.products.length === 0){
             ToastsStore.error(PLEASE_ADD_RECEIVED_PRODUCTS, 2000)
         }else{
             for(let key in formData){
                 if(key === 'productReceivedDate')
                     valid = isValidInput(formData[key])
                 if(key==='products') {
                     formData[key].length !==0 && formData[key].forEach((product)=>{
                         for(let element in product){
                             valid = isValidInput(product[element])
                             if(!valid){
                                 return;
                             }
                         }
                     })
                 }
                 if(!valid){
                     this.setState({inventoryError: true})
                     return;
                 }
             }
             const header = authHeader(this.props.user);
             valid &&
             this.props.addInventory(formData, header).then(()=>{
                 ToastsStore.success(ADDED_ITEMS_TO_INVENTORY, 1500);
                 setTimeout(() => {
                     this.props.navigate('/inventory', {replace:true});
                 }, 500)
             }).catch(error=> ToastsStore.error(error, 2000));
         }
    }

    addProductHandler = () => {
        let newProductDetails= [...this.state.productDetails, {
            inventoryId: Math.random(),
            productId: '',
            quantity: ''
        }]
        this.setState({productDetails: newProductDetails,
            addProduct: true,
            inventoryAddDisabled: false}
        )
    }

    productInputChangeHandler = (id, key ,event) => {
        const updatedProduct = this.state.productDetails.map(product => {
            if(id === product.inventoryId) {
                product[key] = parseInt(event.target.value);
            }
            return product;
        })

        this.setState({productDetails: updatedProduct, inventoryError: false })
    }


    inputChangeHandler = (event) => {
        let receivedDate = event
        this.setState({productReceivedDate: receivedDate, inventoryError: false})
    }

    removeProductHandler = (inventoryId) => {
        let updatedProductDetails =  [...this.state.productDetails];
        let index = updatedProductDetails.findIndex(product  => product.inventoryId === inventoryId)
        updatedProductDetails.splice(index, 1);
        this.setState({productDetails: updatedProductDetails })
    }

    cancelHandler = () => {
        this.props.navigate('/inventory', {replace:true});
    }

    render() {
        const productElementArray=[];
        const productElement = ['productId', 'quantity'];
        for (let key in this.state.inventoryForm ) {
            if(productElement.includes(key)){
                productElementArray.push({
                    id: key,
                    config: this.state.inventoryForm[key]
                })
            }
        }
        return (
            <>
                <ToastsContainer position='top_center' store={ToastsStore}/>
                <div className={classes.Inventory}>
                    <h4 className={classes.Title}>Enter Production Details</h4>
                    <form>
                        <div className={classes.AddProductsTitle}>
                            <p> Add Products to Inventory?</p>
                            <GoDiffAdded className={classes.AddMoreProductButton} onClick={this.addProductHandler}/>
                        </div>
                        {this.state.productDetails.map((product) => (
                            <div className={classes.MoreProductElement} key={product.inventoryId}>
                                {productElementArray.map(ele => (
                                    <Input elementType={ele.config.elementType}
                                           elementConfig={ele.config.elementConfig}
                                           value={product[ele.id]}
                                           label={ele.config.label}
                                           changed={(event) => this.productInputChangeHandler(product.inventoryId, ele.id, event)}
                                    />
                                ))}
                                <CgCloseO onClick={()=>this.removeProductHandler(product.inventoryId)} className={classes.CloseIcon}/>
                            </div>))}
                        <Input elementType={'datePicker'}
                               elementConfig={{name: 'Product Received Date', placeholder: 'Select Product Received Date'}}
                               value={this.state.productReceivedDate}
                               label={'Product Received Date'}
                               changed={(event) => this.inputChangeHandler( event)}
                        />
                        {this.state.inventoryError &&
                          <p className={classes.ErrorMessage}> {ALL_FIELDS_ARE_REQUIRED}</p>}
                        <Button btnType='Success' disabled={this.state.inventoryAddDisabled} clicked={this.addInventoryHandler}> ADD </Button>
                        <Button btnType='Danger' clicked={this.cancelHandler}> CANCEL </Button>

                    </form>
                </div>
            </>)
    }
}

function mapStateToProps(state) {
    return {
      masterData: state.localSales.masterData,
        user: state.auth.user
    };
  }

const Inventory = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedInventory)

export default Inventory;
