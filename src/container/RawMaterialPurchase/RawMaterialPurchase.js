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
            rawMaterialId: {
                elementType: 'select',
                elementConfig: {
                  options: [],
                  placeholder: 'Select Raw Material',
                },
                value: '',
                label: 'Raw Material'
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
                    placeHolder: 'Enter Purchased Quantity'
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
                id: rawMaterial.key,
                displayValue: rawMaterial.value
            })
        })

        this.props.masterData.productType.map(product => {
            return productTypeOptions.push({
                 id: product.key,
                 displayValue: product.value
          })
        })
        
        let updatedRawMaterialPurchaseForm = {...this.state.rawMaterialPurchaseForm}
        let updatedRawMaterialElement = { ...updatedRawMaterialPurchaseForm.rawMaterialId}
        updatedRawMaterialElement.elementConfig.options = rawMaterialOptions;
        updatedRawMaterialPurchaseForm.rawMaterialId = updatedRawMaterialElement;

        let updatedProductTypeElement = { ...updatedRawMaterialPurchaseForm.productId}
         updatedProductTypeElement.elementConfig.options = productTypeOptions;
         updatedRawMaterialPurchaseForm.productId = updatedProductTypeElement; 

        this.setState({rawMaterialPurchaseForm: updatedRawMaterialPurchaseForm })
    }


    purchaseHandler = (event) => {
        event.preventDefault();

        const integerConvertibleKeys = ['rawMaterialId', 'productId', 'quantity'];

         const formData = {};
        for(let key in this.state.rawMaterialPurchaseForm){
            if(key === 'purchaseDate'){
                formData[key] = this.state.rawMaterialPurchaseForm[key].value;
            }else if(integerConvertibleKeys.includes(key)){
                formData[key] = parseInt(this.state.rawMaterialPurchaseForm[key].value)
            }else if(key === 'status'){
                formData[key] = JSON.parse(this.state.rawMaterialPurchaseForm[key].value)
            }else{
                formData[key] = this.state.rawMaterialPurchaseForm[key].value
            }
           
        }
        this.props.addRawMaterialPurchase(formData);
        alert('form submitted!')
        this.props.navigate('/raw-material/purchase', {replace:true});
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
        this.props.navigate('/raw-material/purchase', {replace:true});
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

const RawMaterialPurchase = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedRawMaterialPurchase)

export default RawMaterialPurchase;
