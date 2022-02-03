import {  Pie} from 'react-chartjs-2';
import 'chart.js/auto';

const PieChart = (props) => {
    return (
        <div>
           <Pie data={props.data} options={props.options} />
        </div>
    )
}

export default PieChart