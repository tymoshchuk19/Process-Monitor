<template>
  <div class="home">
    <AppBar :datahosts="loadHosts" :dataudp="loadUDP"/>
    <v-row>
      <v-col cols="4">
      <v-text-field
        label="Intervalo de atualização em segundos"
        placeholder="ex: 15"
        v-model="interval"
      ></v-text-field>
      </v-col>
      <v-col cols="4">
      <v-text-field
        label="Endereço ip do agente SNMP"
        placeholder="padrão: 127.0.0.1"
        v-model="host"
        @keyup.enter="newHost()"
      ></v-text-field>
      </v-col>
      <v-col cols="4">
      <v-text-field
        label="Porta UDP"
        placeholder="padrão: 161"
        v-model="udp"
        @keyup.enter="newPort()"
      ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-row justify="center">
          <h3>Numero de processos em execução ao longo do Tempo</h3>
        </v-row>
          <GraficoTempo :dados="chartData"/>
        <v-row justify="center">
          <h3>Percentagem de processos a serem escalonados</h3>
        </v-row>
          <GraficoEsc :dados="chartDataEsc"/>
        <v-row justify="center">
          <h3>Percentagem de memória alocada para os processos carregados</h3>
        </v-row>
          <GraficoMem :dados="chartDataMem"/>
      </v-col>
      <v-col cols="6">
        <ProcessesTable :processos="processos"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
/*eslint-disable no-console*/
// @ is an alias to /src
import AppBar from '@/components/AppBar.vue';
import ProcessesTable from '@/components/ProcessesTable.vue';
import GraficoTempo from '@/components/GraficoTempo.vue';
import GraficoEsc from '@/components/GraficoEsc.vue';
import GraficoMem from '@/components/GraficoEsc.vue';
import axios from "axios";

export default {
  name: 'home',
  components: {
    AppBar,
    ProcessesTable,
    GraficoTempo,
    GraficoEsc,
    GraficoMem,
  },
  data () {
    return {
      loadHosts: "",
      loadUDP: "",
      host: "",
      udp: "",
      interval: "5",
      processos: [],
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [
        ['minuto', 'T'],
        ['00:00:00', 200],
      ],
      chartDataEsc: [
        ['usado', 'N'],
      ],
      chartDataMem: [
        ['Memoria', 'N'],
      ],
    }
  },
  methods: {
      getHosts() {
        axios
          .get("http://localhost:3000/hosts")
          .then(data => {
            this.loadHosts = data.data;
          });
      },
      getUDP() {
        axios
          .get("http://localhost:3000/udp")
          .then(data => {
            this.loadUDP = data.data;
          });
      },
      newHost() {
      axios
          .post("http://localhost:3000/hosts", { host: this.host })
          .then(() => this.getHosts());
      },
      newPort() {
      axios
          .post("http://localhost:3000/udp", { udp: this.udp })
          .then(() => this.getUDP());
      },
      getProcessos() {
      axios
          .get("http://localhost:3000/")
          .then(data => {
            this.processos = data.data;
            this.addElement();
          });
      },
      addElement() {
        if(this.chartData.length > 6) this.chartData.splice(1,1);
        var np = this.processos.length;
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var i = h + 'h:' + m + 'm:' + s + 's';
        this.chartData.push([i,np])
        this.getPercentagem();
      },
      getPercentagem() {
      axios
          .get("http://localhost:3000/percentagem")
          .then(data => {
            this.chartDataEsc = data.data.per;
            this.chartDataMem = data.data.mem;
            setTimeout(()=> {
              this.getProcessos();
            }, this.interval*1000);
          });
      },
  },
  mounted(){
    this.getProcessos();
    this.getHosts();
    this.getUDP();
  }

}
</script>
