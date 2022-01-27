import React, {Component} from 'react';
import Button from '../../component/UI/Button/Button';
import Input from '../../component/UI/FormElement/FormElement';
import classes from './RawMaterialPurchase.module.css';
import { addRawMaterialPurchase, getMasterData } from '../../redux/action/Action';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
    return {
        addRawMaterialPurchase: rawMaterial => dispatch(addRawMaterialPurchase(rawMaterial)),
        getMasterData: ()=> dispatch(getMasterData())
    };
}

class ConnectedRawMaterialPurchase extends Component {
    state ={
        rawMaterialPurchaseForm : {
            rawMaterial: {
                elementType: 'select',
                elementConfig: {
                  options: [],
                  placeholder: 'Select Raw Material',
                },
                value: '',
                label: 'Raw Material'
            },
            productType: {
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
                    placeHolder: 'Enter Purchased Quantity'
                },
                value: '',
                label: 'Quantity'
            },
            purchaseDate: {
                elementType: 'datePicker',
                elementConfig: {
                    name: 'startDate',
                    placeholder: 'Select Purchased Date',
                },
                value: '',
                label: 'Purchase Date'
            },
        },
    }

  async componentDidMount(){
       await this.props.getMasterData()
        const rawMaterialOptions = [];
        const productTypeOptions =[];
        this.props.masterData.rawMaterialType.map(rawMaterial => {
           return rawMaterialOptions.push({
                id: rawMaterial.Raw_Material_Id,
                displayValue: rawMaterial.Raw_Material_Name
            })
        })

        this.props.masterData.productType.map(product => {
            return productTypeOptions.push({
                 id: product.Product_Id,
                 displayValue: product.Product_Type
          })
        })
        
        let updatedRawMaterialPurchaseForm = {...this.state.rawMaterialPurchaseForm}
        console.log(rawMaterialOptions)
        let updatedRawMaterialElement = { ...updatedRawMaterialPurchaseForm.rawMaterial}
        updatedRawMaterialElement.elementConfig.options = rawMaterialOptions;
        updatedRawMaterialPurchaseForm.rawMaterial = updatedRawMaterialElement;

        let updatedProductTypeElement = { ...updatedRawMaterialPurchaseForm.productType}
         updatedProductTypeElement.elementConfig.options = productTypeOptions;
         updatedRawMaterialPurchaseForm.productType = updatedProductTypeElement; 

        this.setState({rawMaterialPurchaseForm: updatedRawMaterialPurchaseForm })
    }


    purchaseHandler = (event) => {
        event.preventDefault();
         const formData = {};
        for(let key in this.state.rawMaterialPurchaseForm){
            if(key === 'purchaseDate'){
                let date =  this.state.rawMaterialPurchaseForm[key].value;
                formData[key] = new Date(date).toLocaleDateString();
            }else{
                formData[key] = this.state.rawMaterialPurchaseForm[key].value
            }
        }
        console.log(formData);
        this.props.addRawMaterialPurchase(formData);
        //call middleware function to post data and update state in store        
        alert('form submitted!')
    }

    inputChangeHandler = (event, keyIdentifier) => {
        const updatedRawMaterialPurchaseForm = {...this.state.rawMaterialPurchaseForm}
        const updatedElement = { ...updatedRawMaterialPurchaseForm[keyIdentifier]}
        if(keyIdentifier === 'purchaseDate'){
             updatedElement.value = event;
        }else{
            updatedElement.value = event.target.value;
        }
        updatedRawMaterialPurchaseForm[keyIdentifier] = updatedElement;
        this.setState({rawMaterialPurchaseForm: updatedRawMaterialPurchaseForm})
    }


    cancelHandler = () => {
        alert('Cancel!!')
    }

    render() {
        const formElementArray = [];
        for(let key in this.state.rawMaterialPurchaseForm){
            formElementArray.push({
                id: key,
                config: this.state.rawMaterialPurchaseForm[key]
            })
        }
        return(
            <div className={classes.RawMaterialPurchase}>
                <h4 className={classes.Title}>Enter Purchase Details</h4>
                <form>
                    {formElementArray.map(formElement => (
                        <Input elementType={formElement.config.elementType}
                         elementConfig={formElement.config.elementConfig} 
                         value={formElement.config.value}
                         label={formElement.config.label}
                         changed={(event)=>this.inputChangeHandler(event,formElement.id )}/>
                    ) )}
                    <Button btnType='Success' clicked={this.purchaseHandler}> ADD </Button>
                    <Button btnType='Danger' clicked={this.purchaseHandler}> CANCEL </Button>
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

const RawMaterialPurchase = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedRawMaterialPurchase)

export default RawMaterialPurchase;