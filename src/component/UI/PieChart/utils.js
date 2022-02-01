export const DATA = {
    labels: ['Orders','Inventory'],
    datasets: [
        {
            label: 'Orders for 1L cases and available Raw Material',
            data: [],
            borderColor: ['rgba(255,206,86,0.2)'],
            backgroundColor: ['rgba(232,99,132,1)',
            'rgba(232,211,6,1)',
            ],
            pointBackgroundColor: 'rgba(255,206,86,0.2)',
            backgroundImage: 'lightblue url("https://www.chartjs.org/img/chartjs-logo.svgf") no-repeat fixed center'
        },
    ]
}

export const OPTIONS = {
    plugins: {
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
