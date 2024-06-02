<template>
    <div>
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>
  
  <script>
    import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
    } from 'chart.js'
    import { Line } from 'vue-chartjs'

    ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
    )
  
  export default{
    name: 'BarChart',
    components: { Line },
    props: {
      chartData: {
          type: Object,
          required: true
        },
      chartOptions: {
        type: Object,
        default: () => {}
      }
    }
  }
  </script>
  
<style scoped>
</style>