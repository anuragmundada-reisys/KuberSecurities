import React, { Component} from 'react';
import classes from './Dashboard.module.css';
import Pie from '../../component/UI/PieChart/PieChart';
import { DATA, OPTIONS} from '../../component/UI/PieChart/utils';
import {getAvailableStock, getMetrics} from '../../redux/action/CountAction';
import { connect} from 'react-redux';
import {cloneDeep} from "lodash";
import 'chartjs-plugin-datalabels';
import DatePicker from "react-datepicker";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {isValidInput, SELECT_DATE_DASHBOARD} from "../../common/Utils";

function mapDispatchToProps(dispatch) {
  return {
    getMetrics: (receivedDate)=> dispatch(getMetrics(receivedDate)),
    getAvailableStock: ()=> dispatch(getAvailableStock())
  };
}

class ConnectedHome extends Component{
    state = {
      date: '',
    }

    componentDidMount() {
        this.props.getAvailableStock()
            .catch(error=> ToastsStore.error(error, 2000));
    }

    inputChangeHandler = (event) => {
         let date = event;
        this.setState({date: date})
    }

    getDataHandler =  () => {
        let valid = isValidInput(this.state.date)
        if(!valid){
            ToastsStore.error(SELECT_DATE_DASHBOARD, 2000)
        }else{
            this.props.getMetrics(this.state.date)
                .catch(error=> ToastsStore.error(error, 2000));
        }
    }
    render(){

        let paymentMetricsData = cloneDeep(DATA);
        let paymentMetricsOptions = cloneDeep(OPTIONS);
        paymentMetricsData.datasets[0].data = [];
        if(this.props.count.payment.length > 0){
            this.props.count.payment.map(collection => {
                paymentMetricsData.labels.push(`${collection.value}: ${collection.key}`)
                paymentMetricsData.datasets[0].data.push(collection.key)
            })
        }
        paymentMetricsOptions.plugins.title.text = `Payment Received`;


        let ordersData = cloneDeep(DATA);
        let ordersOptions = cloneDeep(OPTIONS);
        ordersData.datasets[0].data = [];
        if(this.props.count.orders.length > 0){
            this.props.count.orders.map(collection => {
                ordersData.labels.push(`${collection.value}: ${collection.key}`)
                ordersData.datasets[0].data.push(collection.key)
            })
        }
        ordersOptions.plugins.title.text = `Orders`;


        let availableStockData = cloneDeep(DATA);
        let availableStockOptions = cloneDeep(OPTIONS);
        availableStockData.datasets[0].data = [];
        this.props.availableStock.map(stock => {
            availableStockData.labels.push(`${stock.title}: ${stock.availableStock}`)
            availableStockData.datasets[0].data.push(stock.availableStock)
        })
        availableStockOptions.plugins.title.text = 'Available Stock';

      return(
        <div className={classes.Dashboard}>
            <ToastsContainer position='top_center' store={ToastsStore}/>
            <div className={classes.Wrapper}>
                <p className={classes.Title}>Payment and Order Metrics</p>
                <div className={classes.PaymentPieChart}>
                    { this.props.count.payment.length > 0 ? <Pie data={paymentMetricsData} options={paymentMetricsOptions}/>:
                        <p className={classes.NoDataFound}>No data to display!</p>}
                </div>
                <div className={classes.OrderPieChart}>
                    { this.props.count.orders.length > 0 ? <Pie data={ordersData} options={ordersOptions}/>:
                        <p className={classes.NoDataFound}>No data to display!</p>}
                </div>
                <div className={classes.GetDataButton}>
                    <DatePicker className={classes.DatePicker} selected={this.state.date} popperPlacement={'left-start'}
                                onChange={(event)=>this.inputChangeHandler(event)} name={'StartDate'} placeholderText={'Select Date'}/>
                    <button className={classes.Button}  onClick={this.getDataHandler}> GET DATA </button>
                </div>
            </div>
            <div className={classes.Wrapper}>
              <div className={classes.PieChart}>
                <Pie data={availableStockData} options={availableStockOptions}/>
              </div>
            </div>
        </div>
      )
    }
}

function mapStateToProps(state) {
  return {
    count: state.localSales.count,
    availableStock: state.localSales.availableStock

  };
}

const Dashboard = connect(
  mapStateToProps,
mapDispatchToProps
)(ConnectedHome)

export default Dashboard;
