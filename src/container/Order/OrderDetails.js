import React, {Component} from 'react';
import { connect } from 'react-redux';
import classes from '../RawMaterialSummary/TableSummary.module.css';
class ConnectedOrderDetails extends Component {
    state = {
        orders : []
    }
    componentDidMount(){
        let updatedOrderDetails = [];
        this.props.orderList.map(order=>{
            if(order.orderId === this.props.rowData.orderId){
                updatedOrderDetails = order.orders
            }
        })
        this.setState({orders: updatedOrderDetails})
    }

    render(){
        const orderDetails = this.state.orders
            .map(item => {
                return (
                    <tr>
                        <td style={{textTransform: 'capitalize' }}>{item.productType}</td>
                        <td> {item.quantity} </td>
                    </tr>
                )
            })

        return(
            <>
                <h3 style={{color:'#5e1d8a'}}><strong> Order Details:</strong></h3>
                <table>
                    <tr>
                        <th> Product Type</th>
                        <th> Quantity</th>
                    </tr>
                    {orderDetails}
                </table>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        orderList: state.orderList
    };
}

const OrderDetails = connect(mapStateToProps)(ConnectedOrderDetails)

export default OrderDetails;
