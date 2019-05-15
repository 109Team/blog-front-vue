
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}


import Vue from "vue";
import API from "@/api/index.d";
declare module "vue/types/vue" {
  interface Vue {
    $API: API;
  }
}