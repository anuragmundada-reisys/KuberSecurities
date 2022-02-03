import React, { Component} from 'react';
import classes from './Home.module.css';
import Pie from '../../component/UI/PieChart/PieChart';
import { DATA, OPTIONS} from '../../component/UI/PieChart/utils';
import { cloneDeep} from 'lodash';
import { getOrderRawMaterialCount } from '../../redux/action/CountAction';
import { connect} from 'react-redux';
import Button from '../../component/UI/Button/Button';
import Modal from '../../component/UI/Modal/Modal';
import RawMaterialSummary from '../RawMaterialSummary/RawMaterialSummary';

function mapDispatchToProps(dispatch) {
  return {
    getOrderRawMaterialCount: ()=> dispatch(getOrderRawMaterialCount())
  };
}

class ConnectedHome extends Component{
    state = {
      showModal: false,
      title: ''
    }

   componentDidMount(){
      this.props.getOrderRawMaterialCount()
    }

    updateShowModal = (title) => {
      this.setState({
          showModal: true,
          title: title
      })
  }

  modalClosedHandler =()=>{
    this.setState({
        showModal: false
    })
  }
 
    render(){
     
    let updatedData = [];
    for(let key in this.props.count){
      let modifiedData = cloneDeep(DATA);
      let modifiedOptions = cloneDeep(OPTIONS)
      modifiedData.datasets[0].data.length = []; // Clear array before inserting new counts
      modifiedData.datasets[0].data.push(this.props.count[key].pendingOrders, this.props.count[key].availableStock)
      modifiedOptions.plugins.title.text = this.props.count[key].title;
      updatedData.push({
        data: modifiedData,
        options: modifiedOptions,
        rawMaterials: this.props.count[key].availableRawMaterial,
        title: this.props.count[key].title
      })
      }
    
      return(
        <div className={classes.Home}>
        {updatedData.map(el=> (
           <>
          <div className={classes.PieChart}>
             <Pie data={el.data} options={el.options}/>
             <Button btnType='Success' clicked={()=>this.updateShowModal(el.title)}> View Raw Material Details.. </Button>
          </div>
           { this.state.showModal ?
            <Modal show={this.state.showModal} modalClosed={this.modalClosedHandler}> 
               <RawMaterialSummary type={this.state.title}/>
            </Modal> : null
          }
           </>
        ))}
        </div>
      )
    }
}

function mapStateToProps(state) {
  return {
    count: state.count
  };
}

const Home = connect(
  mapStateToProps,
mapDispatchToProps
)(ConnectedHome)

export default Home;
