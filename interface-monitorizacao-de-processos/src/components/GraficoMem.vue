<template>
    <div>
          <GChart
            type="PieChart"
            :data="dados"
            :options="chartOptions"
          />
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
  export default {
    props: ['dados'],
    components: {
        GChart
    },
    data: () => ({
      chartOptions: {
        chart: {
          title: 'Percentagem de memória efetivamente usada',
          is3D: true,
        }
      }
    }),
  }
</script>