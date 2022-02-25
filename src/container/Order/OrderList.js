import React, {Component } from 'react';
import { connect } from 'react-redux';
import { getAllOrders } from '../../redux/action/OrderAction';
import Table from '../../component/UI/Table/Table';
import Button from '../../component/UI/Button/Button';
import classes from './OrderList.module.css';
import { ORDER_LIST_COLUMNS } from '../../component/UI/Table/Utils';
import { FiEdit } from 'react-icons/fi';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import Modal from '../../component/UI/Modal/Modal';
import Order from './Order';
import OrderDetails from './OrderDetails';
import CollectionFilter from "../Collection/CollectionFilter";
import {getCollectionSearchedOrders} from "../../redux/action/CollectionAction";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {DATA_NOT_FOUND} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
    return {
        getAllOrders: ()=> dispatch(getAllOrders()),
        getCollectionSearchedOrders: (params) => dispatch(getCollectionSearchedOrders(params))
    };
}

class ConnectedOrderList extends Component {
    state = {
      isEditing: false,
      rowData: {},
      viewOrderDetails: false,
      receivedPayment: false,
      searchOrder: false,
      dataFound: true,
      searchedOrders: []
    }
    componentDidMount() {
      this.props.getAllOrders()
       .then()
       .catch(error=> ToastsStore.error(error, 2000));
    }

    addOrderHandler =()=> {
      this.props.navigate('/order/add', {replace:true});
    }

    editOrderHandler = (orderId, rowData) => {
      this.setState({isEditing: true, rowData: rowData})
    }

    viewOrderDetailsHandler = (orderId, rowData) => {
        this.setState({viewOrderDetails: true, rowData: rowData})
    }

    modalClosedHandler =()=>{
      this.setState({
          isEditing: false, viewOrderDetails: false, receivedPayment: false
      })
    }

    searchOrderHandler = async (params) => {
        let updatedSearchedOrders = [...this.state.searchedOrders]
        await this.props.getCollectionSearchedOrders(params).then(()=>{
            if(this.props.collectionSearchedOrders.length === 0){
                ToastsStore.error(DATA_NOT_FOUND, 2000);
                this.setState({dataFound: false})
            }
            else if(params.orderStatus !== ''){
                JSON.parse(params.orderStatus) ?
                    updatedSearchedOrders = this.props.collectionSearchedOrders.filter(order => order.balanceDue === 0 ):
                    updatedSearchedOrders = this.props.collectionSearchedOrders.filter(order => order.balanceDue !== 0 )
                this.setState({searchedOrders: updatedSearchedOrders, searchOrder: true, dataFound:true});
             }
            else{
                this.setState({searchOrder: true, dataFound:true, searchedOrders: this.props.collectionSearchedOrders });
            }
        }).catch(error=> ToastsStore.error(error, 2000));;

    }

    clearSearchHandler = () => {
        window.location.reload()
    }
   
    render(){
        const data = this.state.searchOrder ? this.state.searchedOrders :this.props.orderList;
        return(
       <>
        <ToastsContainer position='top_center' store={ToastsStore} />
        <div className="min-h-screen bg-gray-100 text-gray-900">
           <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
             {this.state.isEditing ? 
              <Modal show={this.state.isEditing} modalClosed={this.modalClosedHandler}>
                <Order isEditing={this.state.isEditing} rowData={this.state.rowData} />
              </Modal> : this.state.viewOrderDetails ?
                     <Modal show={this.state.viewOrderDetails} modalClosed={this.modalClosedHandler}>
                        <OrderDetails rowData={this.state.rowData}/>
                     </Modal> :null}
              <>
              <div className={classes.AddOrder}>
               <span className={classes.Text}>Did you get any new Order?</span>
               <Button btnType='Success' clicked={this.addOrderHandler}> ADD </Button>
              </div>
              <div className="mt-4">
                <CollectionFilter clicked={(params)=>this.searchOrderHandler(params)} clearClicked={this.clearSearchHandler} isOrderSearch={true}/>
                <Table columns={[...ORDER_LIST_COLUMNS, 
                 {
                  Header: "Actions",
                  accessor: "actions",
                  Cell: (props) => {
                    const rowData = props.row.original;
                    const orderId = rowData.orderId;
                          return (
                              <div className={classes.ActionItems}>
                                  {rowData.balanceDue !== 0 ?   <span>
                                     <FiEdit onClick={()=>this.editOrderHandler( orderId,  rowData)}/>
                                    </span> : null}
                                  <p className={classes.ViewDetails} onClick={()=>this.viewOrderDetailsHandler( orderId, rowData)}> View Details
                                      <BsBoxArrowUpRight className={classes.ViewDetailsIcon}/></p>
                              </div>
                          );
                  },
                }]} data={data}  dataFound={this.state.dataFound}/>
              </div>
              </>
           </main>
           </div>
       </>
         )
        }
}

function mapStateToProps(state) {
    return {
        orderList: state.orderList,
        collectionSearchedOrders: state.collectionSearchedOrders
    };
}

const OrderList = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedOrderList)



export default OrderList;
