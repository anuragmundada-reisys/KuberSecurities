import React, {Component } from 'react';
import { connect } from 'react-redux';
import { getAllOrdersReceivedPayment} from '../../redux/action/ReceivedPaymentAction';
import Table from '../../component/UI/Table/Table';
import { RECEIVED_PAYMENTS_COLUMNS} from '../../component/UI/Table/Utils';
import {ToastsContainer, ToastsStore} from "react-toasts";
import ReceivedPaymentFilter from "./ReceivedPaymentFilter";
import {DATA_NOT_FOUND} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
    return {
        getAllOrdersReceivedPayment: (params)=> dispatch(getAllOrdersReceivedPayment(params)),
    };
}

class ConnectedReceivedPayment extends Component {
    state = {
        receivedPayments:[],
        dataFound: true
    }
    async componentDidMount() {
        await this.props.getAllOrdersReceivedPayment().then(()=>{
            let updatedReceivedPayments = [...this.state.receivedPayments];
            updatedReceivedPayments = this.props.totalReceivedPayments;
            this.setState({receivedPayments: updatedReceivedPayments, dataFound: true })
        }).catch(error=> ToastsStore.error(error, 2000));
    }

    searchReceivedPaymentHandler = async (params) => {
        await this.props.getAllOrdersReceivedPayment(params).then(()=>{
                if(this.props.totalReceivedPayments.length !== 0){
                    this.setState({ receivedPayments: this.props.totalReceivedPayments, dataFound:true});
                }else {
                    this.setState({dataFound: false})
                    ToastsStore.error(DATA_NOT_FOUND, 2000)
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
                    <div className="mt-4">
                        <ToastsContainer position='top_center' store={ToastsStore} />
                        <ReceivedPaymentFilter clicked={(params)=>this.searchReceivedPaymentHandler(params)} clearClicked={this.clearSearchHandler}/>
                         <Table columns={[...RECEIVED_PAYMENTS_COLUMNS
                           ]} data={this.state.receivedPayments} dataFound={this.state.dataFound} />
                    </div>
                </main>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        totalReceivedPayments: state.localSales.totalReceivedPayments,
    };
}

const ReceivedPayment = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedReceivedPayment)

export default ReceivedPayment;
