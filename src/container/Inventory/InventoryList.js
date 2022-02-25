import React, {Component } from 'react';
import { connect } from 'react-redux';
import {getInventoryData, searchInventory} from '../../redux/action/InventoryAction';
import Table from '../../component/UI/Table/Table';
import Button from '../../component/UI/Button/Button';
import classes from './InventoryList.module.css';
import { INVENTORY_LIST_COLUMNS } from '../../component/UI/Table/Utils';
import InventorySearch from "./InventorySearch";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {DATA_NOT_FOUND} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
    return {
        getInventoryData: ()=> dispatch(getInventoryData()),
        searchInventory: (params)=>dispatch(searchInventory(params))
    };
}

class ConnectedInventoryList extends Component {
    state={
        isSearchInventory: false,
        dataFound:true
    }
    componentDidMount() {
      this.props.getInventoryData().catch(error=> ToastsStore.error(error, 2000));
    }

    addInventoryHandler =()=> {
      this.props.navigate('/inventory/add', {replace:true});
    }

    searchInventoryHandler = async (params) => {
        await this.props.searchInventory(params).then(()=>{
            if(this.props.searchedInventory.length === 0){
                this.setState({dataFound: false})
                ToastsStore.error(DATA_NOT_FOUND, 2000);
            }else{
                this.setState({isSearchInventory: true, dataFound:true});
            }
        }).catch(error=> ToastsStore.error(error, 2000));

    }


    clearSearchHandler = () => {
        window.location.reload();
    }
   
    render(){
        const data = this.state.isSearchInventory ? this.props.searchedInventory : this.props.inventoryData;
        return (
            <>
                <ToastsContainer position='top_center' store={ToastsStore} />
                <div className="min-h-screen bg-gray-100 text-gray-900">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                  <div className={classes.AddInventory}>
                   <span className={classes.Text}>New Production?</span>
                   <Button btnType='Success' clicked={this.addInventoryHandler}> ADD </Button>
                </div>
                  <div className="mt-4">
                    <InventorySearch clicked={(params)=>this.searchInventoryHandler(params)} clearClicked={this.clearSearchHandler}/>
                    <Table columns={INVENTORY_LIST_COLUMNS} data={data} dataFound={this.state.dataFound}/>
                  </div>
                </main>
                </div>
            </>
          )
    }
}
function mapStateToProps(state) {
    return {
        inventoryData: state.inventoryData,
        searchedInventory: state.searchedInventory
    };
}

const InventoryList = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedInventoryList)

export default InventoryList;
