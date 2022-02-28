import React, { Component } from 'react';
import Input from "../../component/UI/FormElement/FormElement";
import classes from './InventoryFilter.module.css';
import {getMasterData} from "../../redux/action/MasterDataAction";
import {connect} from "react-redux";
import Button from "../../component/UI/Button/Button";
import DatePicker from "react-datepicker";
import {ToastsContainer, ToastsStore} from "react-toasts";

function mapDispatchToProps(dispatch) {
    return {
        getMasterData: ()=> dispatch(getMasterData()),
    };
}

class ConnectedInventorySearch extends  Component {
    state = {
        productionDate: '',
        productType: '',
        productTypeOptions: []
    }

    async  componentDidMount() {
        await this.props.getMasterData()
            .catch(error=> ToastsStore.error(error, 2000));
        let updatedProductTypeOptions = [...this.state.productTypeOptions]
        this.props.masterData.productType.map(product => {
            return updatedProductTypeOptions.push({
                id: product.key,
                displayValue: product.value
            })
        })
        this.setState({productTypeOptions: updatedProductTypeOptions})
    }

    inputChangeHandler = (event, keyIdentifier) => {
         if(keyIdentifier === 'ProductionDate'){
            const userInput = event;
            this.setState({productionDate: userInput})
        }else if(keyIdentifier === 'ProductType'){
            const userInput = event.target.value;
            this.setState({productType: userInput})
        }
    }

    render(){
        return(
            <>
                <div className={classes.InventoryFilter}>
                    <ToastsContainer position='top_center' store={ToastsStore} />
                    <Input elementType={'select'}
                           elementConfig={{options: this.state.productTypeOptions , placeholder: 'Search Product type'}}
                           value={this.state.productType}
                           label={'Product Type'}
                           changed={(event)=>this.inputChangeHandler( event, 'ProductType' )}
                    />
                    <div className={classes.DateSearch}>
                        <label className={classes.Label}>Production Date</label>
                        <DatePicker className={classes.DatePicker} selected={this.state.productionDate} popperPlacement={'left-start'}
                                    onChange={(event)=>this.inputChangeHandler(event, 'ProductionDate')} name={'StartDate'} placeholderText={'Search Production Date'}
                                    dateFormat={'yyyy-MM-dd'}/>
                    </div>
                </div>
                <div className={classes.ButtonWrapper}>
                    <Button btnType='Success' clicked={()=>this.props.clicked({productType: this.state.productType,
                        productionDate: this.state.productionDate && this.state.productionDate.toISOString().slice(0, 10),
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
        masterData: state.masterData,
    };
}

const InventoryFilter = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedInventorySearch)

export default InventoryFilter;