import React, {Component } from 'react';
import { connect } from 'react-redux';
import { getAllOrders } from '../../redux/action/OrderAction';
import Table from '../../component/UI/Table/Table';
import Button from '../../component/UI/Button/Button';
import classes from './OrderList.module.css';
import { ORDER_LIST_COLUMNS } from '../../component/UI/Table/Utils';
import { FiEdit } from 'react-icons/fi';
import Modal from '../../component/UI/Modal/Modal';
import Order from './Order';

function mapDispatchToProps(dispatch) {
    return {
        getAllOrders: ()=> dispatch(getAllOrders())
    };
}

class ConnectedOrderList extends Component {
    state = {
      isEditing: false,
      rowData: {}
    }
    componentDidMount() {
      this.props.getAllOrders()
    }

    addOrderHandler =()=> {
      this.props.navigate('/order/add', {replace:true});
    }

    editOrderHandler = (orderId, rowData) => {
      // this.props.navigate('/order/'+ {orderId} , {replace:true})
      this.setState({isEditing: true, rowData: rowData})
      console.log(rowData)
    }

    modalClosedHandler =()=>{
      this.setState({
          isEditing: false
      })
    }
   
    render(){
        const data = this.props.orderList;
        return(
        <div className="min-h-screen bg-gray-100 text-gray-900">
           <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
             {this.state.isEditing ? 
              <Modal show={this.state.isEditing} modalClosed={this.modalClosedHandler}>
                <Order isEditing={this.state.isEditing} rowData={this.state.rowData} />
              </Modal> :
              <>
              <div className={classes.AddOrder}>
               <span className={classes.Text}>Did you get any new Order?</span>
               <Button btnType='Success' clicked={this.addOrderHandler}> ADD </Button>
              </div>
              <div className="mt-4">
                <Table columns={[...ORDER_LIST_COLUMNS, 
                 {
                  Header: "Actions",
                  accessor: "actions",
                  Cell: (props) => {
                    const rowData = props.row.original;
                    const orderId = rowData.orderId
                    return (
                      <div>
                        <span>
                          <FiEdit onClick={()=>this.editOrderHandler( orderId, rowData)}/>
                        </span>
                      </div>
                    );
                  },
                }]} data={data} />
              </div>
              </>
              }
            
           </main>
           </div>
         )
        }
}
function mapStateToProps(state) {
    return {
        orderList: state.orderList
    };
}

const OrderList = connect(
    mapStateToProps,
  mapDispatchToProps
)(ConnectedOrderList)



export default OrderList;
