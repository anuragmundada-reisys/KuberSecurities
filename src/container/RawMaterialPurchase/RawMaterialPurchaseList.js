import React, {Component } from 'react';
import { connect } from 'react-redux';
import { getRawMaterialPurchase } from '../../redux/action/RawMaterialAction';
import Table from '../../component/UI/Table/Table';
import Button from '../../component/UI/Button/Button';
import classes from './RawMaterialPurchaseList.module.css';
import { RAW_MATERIAL_COLUMNS } from '../../component/UI/Table/Utils';

function mapDispatchToProps(dispatch) {
    return {
        getRawMaterialPurchase: ()=> dispatch(getRawMaterialPurchase())
    };
}

class ConnectedRawMaterialPurchaseList extends Component {
    componentDidMount() {
      this.props.getRawMaterialPurchase()
    }

    addRawMaterialHandler =()=> {
      console.log("adding")
      this.props.navigate('/raw-material/add', {replace:true});
    }
   
    render(){
        const data = this.props.rawMaterialPurchaseList;
        
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className={classes.AddRawMaterial}>
               <span className={classes.Text}>Purchased new Raw Material?</span>
               <Button btnType='Success' clicked={this.addRawMaterialHandler}> ADD </Button>
            </div>
              <div className="mt-4">
                <Table columns={RAW_MATERIAL_COLUMNS} data={data} />
              </div>
            </main>
            </div>
          )
    }
}
function mapStateToProps(state) {
    return {
        rawMaterialPurchaseList: state.rawMaterialPurchaseList
    };
}

const RawMaterialPurchaseList = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedRawMaterialPurchaseList)



export default RawMaterialPurchaseList;
