import React, {Component } from 'react';
import { connect } from 'react-redux';
import { getAllOrders, updateOrder} from '../../redux/action/OrderAction';
import Table from '../../component/UI/Table/Table';
import classes from './Collection.module.css';
import {COLLECTION_ORDERS_COLUMNS} from '../../component/UI/Table/Utils';
import { GoDiffAdded } from 'react-icons/go'
import Modal from "../../component/UI/Modal/Modal";
import Order from "../Order/Order";
import {BsBoxArrowUpRight} from "react-icons/bs";
import OrderDetails from "../Order/OrderDetails";
import OrderAndCollectionFilter from "../../component/UI/Table/OrderAndCollectionFilter";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {DATA_NOT_FOUND, ORDER_UNASSIGNED_SUCCESSFULLY} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
    return {
        getAllOrders: (params)=> dispatch(getAllOrders(params)),
        updateOrder: order => dispatch(updateOrder(order)),
    };
}

class ConnectedCollection extends Component {
    state = {
        rowData: {},
        receivedPayment: false,
        assign: false,
        pendingOrders: [],
        viewOrderDetails: false,
        dataFound: true,
    }
    async componentDidMount() {
        await this.props.getAllOrders().then(()=>{
            const filteredOrders = this.props.orderList.filter(order => order.balanceDue !== 0);
            let updatedOrders = [...this.state.pendingOrders];
            updatedOrders = filteredOrders;
            this.setState({pendingOrders: updatedOrders, dataFound: true})
        }).catch(error=> ToastsStore.error(error, 2000));
    }

    assignOrderHandler = (rowData) => {
        this.setState({assign: true, rowData: rowData })
    }

    unassignOrderHandler = async (rowData) => {
        let assignOrderFormData = {
            assignUpdate: true,
            orderId: rowData.orderId,
            assigneeName: null,
            updatedDate: new Date(),
            assignedStatus: false,
        };

       await this.props.updateOrder(assignOrderFormData).then(()=>{
           ToastsStore.success(ORDER_UNASSIGNED_SUCCESSFULLY, 500);
           setTimeout(() => {
               window.location.reload();
           }, 500)
       }).catch(error=> ToastsStore.error(error, 2000));
    }

    receivedPaymentHandler = (orderId, rowData) => {
        this.setState({receivedPayment: true, rowData: rowData})
    }

     modalClosedHandler =()=> {
         this.setState({
             assign: false, receivedPayment: false, viewOrderDetails: false
         })
     }

    viewPaymentAndAssigneeDetailsHandler = (orderId, rowData) => {
        this.setState({viewOrderDetails: true, rowData: rowData})
    }

    searchOrderHandler = async (params) => {
        await this.props.getAllOrders(params).then(()=>{
            const filteredOrders = this.props.orderList.filter(order => order.balanceDue !== 0);
            if(filteredOrders.length === 0){
                this.setState({dataFound: false})
                ToastsStore.error(DATA_NOT_FOUND, 2000);
            }else{
                this.setState({ pendingOrders: filteredOrders, dataFound:true});
            }
        }).catch(error=> ToastsStore.error(error, 2000));

    }

    clearSearchHandler = async () =>{
        window.location.reload()
    }

    render(){
        return(
            <div className="min-h-screen bg-gray-100 text-gray-900">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    {this.state.assign ?
                        <Modal show={this.state.assign} modalClosed={this.modalClosedHandler}>
                            <Order isAssigning={this.state.assign} rowData={this.state.rowData} />
                        </Modal> :
                         this.state.receivedPayment ?
                                <Modal show={this.state.receivedPayment} modalClosed={this.modalClosedHandler}>
                                    <Order receivedPayment={this.state.receivedPayment} rowData={this.state.rowData} navigate={this.props.navigate}/>
                                </Modal>:
                             this.state.viewOrderDetails ?
                                 <Modal show={this.state.viewOrderDetails} modalClosed={this.modalClosedHandler}>
                                     <OrderDetails viewPaymentAndAssigneeDetails={this.state.viewOrderDetails} rowData={this.state.rowData}/>
                                 </Modal>:
                             null}
                        <div className="mt-4">
                            <ToastsContainer position='top_center' store={ToastsStore} />
                            <OrderAndCollectionFilter clicked={(params)=>this.searchOrderHandler(params)} clearClicked={this.clearSearchHandler}/>
                            <Table columns={[...COLLECTION_ORDERS_COLUMNS,
                                {
                                    Header: "Actions",
                                    accessor: "actions",
                                    Cell: (props) => {
                                        const rowData = props.row.original;
                                        const orderId = rowData.orderId;
                                        return (
                                            <div className={classes.ActionItems}>
                                                {!rowData.assignedStatus ?
                                                    <button className={[classes.Button, classes.Success].join(' ')}  onClick={()=>this.assignOrderHandler(rowData)}> Assign </button>
                                                :  <button className={[classes.Button, classes.Danger].join(' ')} onClick={()=>this.unassignOrderHandler(rowData)}> Unassign </button>}

                                                {rowData.balanceDue !== 0 ?  <p className={classes.ReceivedPayment} onClick={()=>this.receivedPaymentHandler( orderId, rowData)}> Received Payment
                                                    <GoDiffAdded className={classes.addMoreIcon}/></p> : null}
                                                <p className={classes.ViewDetails} onClick={()=>this.viewPaymentAndAssigneeDetailsHandler( orderId, rowData)}> View Details
                                                    <BsBoxArrowUpRight className={classes.ViewDetailsIcon}/></p>
                                            </div>
                                        );
                                    },
                                }]} data={this.state.pendingOrders} dataFound={this.state.dataFound} />
                        </div>
                </main>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        orderList: state.orderList,
    };
}

const Collection = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedCollection)

export default Collection;
