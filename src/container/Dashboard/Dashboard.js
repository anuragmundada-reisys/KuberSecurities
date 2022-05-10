import React, { Component} from 'react';
import classes from './Dashboard.module.css';
import Pie from '../../component/UI/PieChart/PieChart';
import { DATA, OPTIONS} from '../../component/UI/PieChart/utils';
import {getAvailableStock, getExpenseByDate, getMetrics, getTotalBalanceDue} from '../../redux/action/CountAction';
import { connect} from 'react-redux';
import {cloneDeep} from "lodash";
import 'chartjs-plugin-datalabels';
import DatePicker from "react-datepicker";
import {ToastsContainer, ToastsStore} from "react-toasts";
import {isValidInput, SELECT_DATE_DASHBOARD} from "../../common/Utils";
import {formatInTimeZone} from "date-fns-tz";

function mapDispatchToProps(dispatch) {
  return {
    getMetrics: (receivedDate)=> dispatch(getMetrics(receivedDate)),
    getAvailableStock: ()=> dispatch(getAvailableStock()),
     getTotalBalanceDue: ()=>dispatch(getTotalBalanceDue()),
      getExpenseByDate: (receivedDate)=> dispatch(getExpenseByDate(receivedDate))
  };
}

class ConnectedHome extends Component{
    state = {
      date: '',
    }

    componentDidMount() {
        this.props.getAvailableStock()
            .catch(error=> ToastsStore.error(error, 2000));
        this.props.getTotalBalanceDue()
            .catch(error=> ToastsStore.error(error, 2000));
    }

    inputChangeHandler = (event) => {
         let date = event;
        this.setState({date: date})
    }

    getDataHandler =  async () => {
        let valid = isValidInput(this.state.date)
        if(!valid){
            ToastsStore.error(SELECT_DATE_DASHBOARD, 2000)
        }else{
            let modifiedTimeZoneDate =  formatInTimeZone(this.state.date, 'IST', 'yyyy-MM-dd')
            await this.props.getMetrics(modifiedTimeZoneDate)
                .catch(error=> ToastsStore.error(error, 2000));
            await this.props.getExpenseByDate(modifiedTimeZoneDate)
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


        let totalBalanceDueData = cloneDeep(DATA);
        let totalBalanceDueOptions = cloneDeep(OPTIONS);
        totalBalanceDueData.datasets[0].data = [];
        this.props.totalBalanceDue.map(balanceDue => {
            totalBalanceDueData.labels.push(`Due : ${balanceDue.totalBalanceDue}`)
            totalBalanceDueData.datasets[0].data.push(balanceDue.totalBalanceDue)
        })
        totalBalanceDueOptions.plugins.title.text = 'Total Balance Due';

        let availableStockData = cloneDeep(DATA);
        let availableStockOptions = cloneDeep(OPTIONS);
        availableStockData.datasets[0].data = [];
        this.props.availableStock.map(stock => {
            availableStockData.labels.push(`${stock.title} - ${stock.availableCases} (${stock.availableBottles})`)
            availableStockData.datasets[0].data.push(stock.availableCases)
        })
        availableStockOptions.plugins.title.text = 'Available Stock';

        let totalExpenseByDateData = cloneDeep(DATA);
        let totalExpenseByDateOptions = cloneDeep(OPTIONS);
        totalExpenseByDateData.datasets[0].data = [];
        this.props.expenseByDate.map(expense => {
            totalExpenseByDateData.labels.push(`Expense : ${expense.totalExpenseByDate}`)
            totalExpenseByDateData.datasets[0].data.push(expense.totalExpenseByDate)
        })
        totalExpenseByDateOptions.plugins.title.text = 'Total Expense';

      return(
        <div className={classes.Dashboard}>
            <ToastsContainer position='top_center' store={ToastsStore}/>
            <div className={classes.Wrapper}>
                <p className={classes.Title}>Payment, Order and Expense Metrics</p>
                <div className={classes.DateMetrics}>
                    <div className={classes.PaymentPieChart}>
                        { this.props.count.payment.length > 0 ? <Pie data={paymentMetricsData} options={paymentMetricsOptions}/>:
                            <p className={classes.NoDataFound}>No data to display!</p>}
                    </div>
                    <div className={classes.OrderPieChart}>
                        { this.props.count.orders.length > 0 ? <Pie data={ordersData} options={ordersOptions}/>:
                            <p className={classes.NoDataFound}>No data to display!</p>}
                    </div>
                    <div className={classes.ExpensePieChart}>
                        { this.props.expenseByDate.length > 0 ? <Pie data={totalExpenseByDateData} options={totalExpenseByDateOptions}/>:
                            <p className={classes.NoDataFound}>No data to display!</p>}
                    </div>
                </div>

                <div className={classes.GetDataButton}>
                    <DatePicker className={classes.DatePicker} selected={this.state.date} popperPlacement={'left-start'}
                                onChange={(event)=>this.inputChangeHandler(event)} name={'StartDate'} placeholderText={'Select Date'}/>
                    <button className={classes.Button}  onClick={this.getDataHandler}> GET DATA </button>
                </div>
            </div>
            <div className={classes.Wrapper}>
                <div className={classes.PieChart}>
                    <Pie data={totalBalanceDueData} options={totalBalanceDueOptions}/>
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
    availableStock: state.localSales.availableStock,
    totalBalanceDue: state.localSales.totalBalanceDue,
    expenseByDate: state.localSales.expenseByDate,
  };
}

const Dashboard = connect(
  mapStateToProps,
mapDispatchToProps
)(ConnectedHome)

export default Dashboard;
