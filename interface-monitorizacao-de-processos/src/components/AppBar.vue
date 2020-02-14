<template>
  <v-content>
    <v-app-bar>
      <v-toolbar-title >Monitor de processos</v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <gr-dropdown :label="'Host IP'" :items="datahosts"></gr-dropdown>
      <gr-dropdown :label="'UDP Port'" :items="dataudp"></gr-dropdown>
    
    </v-app-bar>
  </v-content>
</template>

<script>
import DropDown from '@/components/DropDown.vue';
  export default {
    props: ['datahosts','dataudp'],
    components: {
      'gr-dropdown': DropDown
    },
    data () {
      return {
      }
    }
  }
</script>