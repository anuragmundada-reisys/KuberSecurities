import React, {Component} from 'react';
import { connect } from 'react-redux';

class ConnectedRawMaterialSummary extends Component {

    state = {
        rawMaterialSummary : {}
    }
    componentDidMount(){
        console.log(this.props.count)
        let updatedRawMaterialSummary = {};

        this.props.count.map(el=>{
            if(el.title === this.props.type){
                updatedRawMaterialSummary = el.rawMaterial
            }
        })
        this.setState({rawMaterialSummary: updatedRawMaterialSummary})
    }

    render(){
        /* const rawMaterialSummary = {
            cartoon: 100,
            cap: 200,
            tape: 60,
            preform: 400
        }; */
        const rawMaterials = Object.keys(this.state.rawMaterialSummary)
        .map(igkey => {
            return <li><span style={{textTransform: 'capitalize'}}>{igkey}: {this.state.rawMaterialSummary[igkey]}</span></li>
        })

        return(
            <>
            <h3><strong> {this.props.type} Raw Material Summary:</strong></h3>
            <ul>
                {rawMaterials}
            </ul>
            {/* <Button btnType='Danger' clicked={this.props.purchaseCancel}>cancel</Button> */}
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