



<script>

import { Line } from 'vue-chartjs'


export default {
    name: 'Statistics',
    props: ['team1Timeline', 'team2Timeline'],
    extends: Line,
    computed: {
        // teamTimelineData: function() {
        //     console.log('hello', this.$props.teamTimeline)
        //     return this.$props.teamTimeline.map( t => t.Tickets)
        // },
        // datasetsData : function () {
        //     return [
        //         {
        //             label: 'Data One',
        //             backgroundColor: '#f87979',
        //             pointRadius: 10,
        //             data: this.teamTimelineData,
        //         }
        //     ]
        // }
        chartdata: function () {
            return { 
                labels: ['January', 'February', 'Mars', 1,2,3,14,5,6,7,8,9,10,11,12,13,14,15,20,1,55,55,112,11,11,11,11,11,11,11,11], 
                datasets: [
                    {
                        label: 'Team 1',
                        backgroundColor: '#f87979',
                        borderColor: 'red',
                        fill : false,
                        pointRadius: 10,
                        data: this.$props.team1Timeline.map(t => t.Tickets)
                    },
                    {
                        label: 'Team 2',
                        backgroundColor: 'blue',
                        borderColor: 'blue',
                        fill : false,
                        pointRadius: 10,
                        data: this.$props.team2Timeline.map(t => t.Tickets)
                    }
            ]}
        },
    },
    data: () => ({
       
        options: {
            // responsive: true,
            maintainAspectRatio: false,
            scales: {
					xAxes: [{
                        // type: 'time',
						// time: {
                        //     unit: 'second',
                        //     displayFormats: {
                        //         hour: 'HH:mm:ss a'
                        //     }
						// },
						// scaleLabel: {
						// 	display: true,
						// 	labelString: 'Timer'
                        // },
                        // ticks: {
                        //     min: 0,//this.$props.minYAxis,
                        //     max: 20//his.$props.maxYAxis
                        // }
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Points'
						}
					}]
				},
        }
    }),
    components: {
    },
    methods: {
    },
    mounted () {
        console.log('teamTimeline', this.$props.teamTimeline, this.chartdata)
        this.renderChart(this.chartdata, this.options)
    },
    watch: {
    }
}
</script>

<style>
</style>
