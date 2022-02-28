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
import OrderAndCollectionFilter from "../../component/UI/Table/OrderAndCollectionFilter";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {DATA_NOT_FOUND} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
    return {
        getAllOrders: (params)=> dispatch(getAllOrders(params)),
    };
}

class ConnectedOrderList extends Component {
    state = {
      isEditing: false,
      rowData: {},
      viewOrderDetails: false,
      receivedPayment: false,
      dataFound: true,
      orders:[]
    }
    componentDidMount() {
      this.props.getAllOrders()
       .then(()=>{this.setState({orders: this.props.orderList})})
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
        let updatedSearchedOrders = [...this.state.orders]
        await this.props.getAllOrders(params).then(()=>{
            if(this.props.orderList.length === 0){
                ToastsStore.error(DATA_NOT_FOUND, 2000);
                this.setState({orders: this.props.orderList, dataFound: false})
            }
            else if(params.orderStatus !== ''){
                JSON.parse(params.orderStatus) ?
                    updatedSearchedOrders = this.props.orderList.filter(order => order.balanceDue === 0 ):
                    updatedSearchedOrders = this.props.orderList.filter(order => order.balanceDue !== 0 )
               if(updatedSearchedOrders.length !== 0 ) {
                   this.setState({orders: updatedSearchedOrders, dataFound:true})
               }else{
                   ToastsStore.error(DATA_NOT_FOUND, 2000);
                   this.setState({orders: updatedSearchedOrders, dataFound:false})
               }
             }
            else{
                this.setState({ orders: this.props.orderList, dataFound:true });
            }
        }).catch(error=> ToastsStore.error(error, 2000));

    }

    clearSearchHandler = () => {
        window.location.reload()
    }
   
    render(){
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
                <OrderAndCollectionFilter clicked={(params)=>this.searchOrderHandler(params)} clearClicked={this.clearSearchHandler} isOrderSearch={true}/>
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
                }]} data={this.state.orders}  dataFound={this.state.dataFound}/>
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
