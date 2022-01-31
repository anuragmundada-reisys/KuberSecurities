import React, {Component } from 'react';
import { connect } from 'react-redux';
import { getInventoryData } from '../../redux/action/InventoryAction';
import Table from '../../component/UI/Table/Table';
import Button from '../../component/UI/Button/Button';
import classes from './InventoryList.module.css';
import { INVENTORY_LIST_COLUMNS } from '../../component/UI/Table/Utils';

function mapDispatchToProps(dispatch) {
    return {
        getInventoryData: ()=> dispatch(getInventoryData())
    };
}

class ConnectedInventoryList extends Component {
    componentDidMount() {
      this.props.getInventoryData()
    }

    addInventoryHandler =()=> {
      console.log("adding")
      this.props.navigate('/inventory/add', {replace:true});
    }
   
    render(){
        const data = this.props.inventoryData;
        
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className={classes.AddInventory}>
               <span className={classes.Text}>New Production?</span>
               <Button btnType='Success' clicked={this.addInventoryHandler}> ADD </Button>
            </div>
              <div className="mt-4">
                <Table columns={INVENTORY_LIST_COLUMNS} data={data} />
              </div>
            </main>
            </div>
          )
    }
}
function mapStateToProps(state) {
    return {
        inventoryData: state.inventoryData
    };
}

const InventoryList = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedInventoryList)

export default InventoryList;
