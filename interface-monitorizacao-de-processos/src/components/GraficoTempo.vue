<template>
    <div>
          <GChart
            type="LineChart"
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
        curveType: 'function',
        chart: {
          title: 'Numero de processos em execução ao longo do Tempo'
        }
      }
    }),
  }
</script>