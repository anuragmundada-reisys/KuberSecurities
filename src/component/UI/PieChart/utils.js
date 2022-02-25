export const DATA = {
    labels: [],
    datasets: [
        {
            label: 'Total Payment Received',
            data: [],
            borderColor: ['#6800b8'],
            backgroundColor: ['#ad8ee8',
            '#7553b8', '#c3afed', '#8c69d6'
            ],
            pointBackgroundColor: 'rgba(255,206,86,0.2)',
            backgroundImage: 'lightblue url("https://www.chartjs.org/img/chartjs-logo.svgf") no-repeat fixed center'
        },
    ]
}

export const OPTIONS = {

    plugins: {
        legend: { display: true, position: "right" , font: 20 },
        labels: {
            fontSize: 30,
        },
        tooltip: {
            enabled: false
        },
        title: {
            display: true,
            text: '',
            color: '#5e1d8a',
            font: {
                size:28
            },
            padding:{
                top:10,
                bottom:10
            },
            responsive:true,
            animation:{
                animateScale: true,
             }
        }

    }
}
