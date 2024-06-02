<template>
    <div class="header-info">
        <p v-if="getAdminRoot()">{{ getFullName }} [администратор]</p>
        <p v-else>{{ getFullName }} [пользователь]</p>
        <p>Баланс: {{getBalance}}$</p>
    </div>
</template>
  
  <script>
  export default {
    name: 'AppHeader',
    mounted(){
    },
    data() {return{
    }},
    methods:{
        getAdminRoot() {
            return this.$store.getters.getAdminRoot;
        }
    },
    computed:{
        getFullName() {return this.$store.getters.getFullName;},
        getBalance() {return this.$store.getters.getBalance;},
    }   
  }
  </script>
  
  <style scoped>
    .header-info{
        display: flex;
        flex-direction: column;
        width: 600px;
        align-items: flex-start;
        padding-left: 10px;
        color: hsl(0, 0%, 100%);
        border-radius: 0px 360px 360px 0px;
        background: #06F;
        font-size: 21px;
    }
  </style>
  