<template>
  <v-data-table
    :headers="headers"
    :items="processos"
    :sort-by="['id']"
    :sort-desc="[false]"
    multi-sort
    class="elevation-1"
  ></v-data-table>
</template>

<script>
/*eslint-disable no-console*/
import netSNMP from 'net-snmp'

  export default {
    props: ['processos'],
    data () {
      return {
        session: "",
        oid: "1.3.6.1.2.1.25.4.2",
        hostip: "127.0.0.1",
        options: {
            port: "161",
            version: netSNMP.Version2c,
        },
        headers: [
          { text: 'Identificador', value: 'id'},
          { text: 'Nome', value: 'nome' },
          { text: 'Caminho', value: 'caminho' }
        ]
      }
    }
  }
</script>