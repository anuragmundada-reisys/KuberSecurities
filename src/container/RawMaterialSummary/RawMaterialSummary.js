import React, {Component} from 'react';
import { connect } from 'react-redux';
import classes from './RawMaterialSummary.module.css';
class ConnectedRawMaterialSummary extends Component {

    state = {
        rawMaterialSummary : {}
    }
    componentDidMount(){
        console.log(this.props.count)
        let updatedRawMaterialSummary = {};

        this.props.count.map(el=>{
            if(el.title === this.props.type){
                updatedRawMaterialSummary = el.availableRawMaterial
            }
        })
        this.setState({rawMaterialSummary: updatedRawMaterialSummary})
    }

    render(){
      
        const rawMaterials = Object.keys(this.state.rawMaterialSummary)
        .map(igkey => {

            return (
                <tr>
                    <td style={{textTransform: 'capitalize' }}>{igkey}</td>
                    <td> {this.state.rawMaterialSummary[igkey]} </td>
                </tr>
            ) 
        })

        return(
            <>
            <h3 style={{color:'#5e1d8a'}}><strong> {this.props.type} Raw Material Summary:</strong></h3>
            <table>
              <tr>
                <th> Raw Material</th>
                <th> Quantity</th>
              </tr>
              {rawMaterials}
            </table>
           </>
        )
    }
}

function mapStateToProps(state) {
    return {
      count: state.count
    };
}

const RawMaterialSummary = connect(mapStateToProps)(ConnectedRawMaterialSummary)
  
export default RawMaterialSummary;