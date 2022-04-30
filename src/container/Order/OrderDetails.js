import React, {Component} from 'react';
import { connect } from 'react-redux';
import classes from './TableSummary.module.css';
import {getOrderAssigneeHistory, getReceivedPayment} from "../../redux/action/OrderAction";
import {ToastsStore} from "react-toasts";

function mapDispatchToProps(dispatch) {
    return {
        getReceivedPayment: orderId => dispatch(getReceivedPayment(orderId)),
        getOrderAssigneeHistory: orderId => dispatch(getOrderAssigneeHistory(orderId))
    };
}

class ConnectedOrderDetails extends Component {
    state = {
        orders : [],
        notes: ''
    }
   async componentDidMount(){
        await this.props.getReceivedPayment(this.props.rowData.orderId)
            .catch(error=> ToastsStore.error(error, 2000));
        await this.props.getOrderAssigneeHistory(this.props.rowData.orderId)
            .then()
            .catch(error=> ToastsStore.error(error, 2000));
       if(!this.props.viewPaymentAndAssigneeDetails){
           let updatedOrderDetails = [];
           let notes = '';
           this.props.orderList.map(order=>{
               if(order.orderId === this.props.rowData.orderId){
                   notes = order.notes;
                   updatedOrderDetails = order.orders
               }
           })
           this.setState({orders: updatedOrderDetails, notes: notes})
       }
    }

    render(){
        const orderDetails = this.state.orders
            .map(item => {
                return (
                    <tr>
                        <td style={{textTransform: 'capitalize' }}>{item.productType}</td>
                        <td> {item.quantity} </td>
                        <td> {item.freeQuantity} </td>
                        <td> {item.rate} </td>
                        <td> {item.amount} </td>
                    </tr>
                )
            })

        const receivedPayments = this.props.receivedPayments.length > 0 && this.props.receivedPayments.map(item => {
                return (
                    <tr>
                        <td style={{textTransform: 'capitalize' }}>{item.receivedAmount}</td>
                        <td> {item.paymentMode} </td>
                        <td> {item.receiverName} </td>
                        <td> {item.receivedPaymentDate} </td>
                    </tr>
                )
            })

        const assigneeHistory = this.props.assigneeHistory.length > 0 && this.props.assigneeHistory.map(item => {
            return (
                <tr>
                    <td style={{textTransform: 'capitalize' }}>{item.billNo}</td>
                    <td> {item.assigneeName} </td>
                    <td> {item.assignedStatus ? 'Assigned' : 'Unassigned'} </td>
                    <td> {item.assignedUpdatedDate} </td>
                </tr>
            )
        })
        return(
            <>
                {
                    !this.props.viewPaymentAndAssigneeDetails &&
                    <>
                       <h3 style={{color:'#5e1d8a'}}><strong> Order Details:</strong></h3>
                        <table>
                            <tr>
                                <th> Product Type</th>
                                <th> Quantity</th>
                                <th> Free Quantity</th>
                                <th> Rate</th>
                                <th> Amount </th>
                            </tr>
                            {orderDetails}
                        </table>
                    </>
                }
                <h3 style={{color:'#5e1d8a', marginTop:'10px'}}><strong> Payment Details:</strong></h3>
                {
                    this.props.receivedPayments.length > 0 ?
                        <table>
                            <tr>
                                <th> Received Amount</th>
                                <th> Payment Mode</th>
                                <th> Receiver Name</th>
                                <th> Received Date</th>
                            </tr>
                            {receivedPayments}
                        </table> : <p style={{fontWeight:600}}>Payment Not Received!</p>
                }
                <h3 style={{color:'#5e1d8a'}}><strong> Assignee Details:</strong></h3>
                { this.props.assigneeHistory.length > 0 ?
                    <table>
                        <tr>
                            <th>Bill No</th>
                            <th> Assignee Name</th>
                            <th> Assigned Status</th>
                            <th> Updated Date </th>
                        </tr>
                        {assigneeHistory}
                    </table> : <p style={{fontWeight:600}}>Pending Assignment!</p>
                }
                <h3 style={{color:'#5e1d8a', marginTop:'10px'}}><strong> Notes:</strong></h3>
                <span> {this.state.notes} </span>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        orderList: state.localSales.orderList,
        receivedPayments: state.localSales.receivedPayments,
        assigneeHistory: state.localSales.assigneeHistory
    };
}

const OrderDetails = connect(mapStateToProps, mapDispatchToProps)(ConnectedOrderDetails)

export default OrderDetails;
