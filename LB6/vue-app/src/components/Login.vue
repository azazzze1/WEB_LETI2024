<template>
    <div class="login">
        <p>Фамилия</p>
        <input type="text" v-model="surname">
        <p>Имя</p>
        <input class="name" type="text" v-model="name">
        <br>
        <span>Права администратора:</span>
        <input type="checkbox" v-model="adminRoot">
        <br>
        <button class="button" @click="checkBrokerInList">войти</button>
    </div>
    
</template>
  
  <script>
  export default {
    name: 'LoginComponent',
    mounted(){
        this.getBrokers();
    },
    data() {return{
        surname: "",
        name: "",
        adminRoot: false,
        balance: 0,
        brokersList: []
    }},
    methods:{
        getBrokers(){ 
            fetch('http://localhost:3001/brokers', { method: 'GET' })
            .then(response => response.json())
            .then(value => this.brokersList = value.Brokers);
        },

        checkBrokerInList(){
            let fullName = this.surname + ' ' + this.name; 
            let idx = this.brokersList.findIndex(e => e.fullName == fullName);
            if(idx !== -1){
                this.$store.commit('SET_NAME', fullName);
                this.$store.commit('SET_ROOT', this.adminRoot);
                this.$store.commit('SET_BALANCE', this.brokersList[idx].money);
                this.$store.commit('SET_STOCKS', this.brokersList[idx].stocks);
                this.$store.commit('SET_ID', this.brokersList[idx].id);
            }     
        }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
    .login{
        display: block;
        width: 350px;
        color: white;
        border-radius: 90px 90px 90px 90px;
        background: #06F;
        padding-top: 1px;
        padding-bottom: 10px;
        margin-top: 50px;
        margin-left: auto;
        margin-right: auto;

    }

    .name{
        margin-bottom: 5px;
    }
    .button{
        margin-top: 5px;
        width: 50%;
    }
  </style>
  