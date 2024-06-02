<template>
    <div class="exchange-date">
        <p>Дата торга: {{ dataOfExchange }}</p> 
    </div>
    <div v-on:click="showStock" v-for="(value, key) in lastPrices" :key="key" :id="key">
        <div class="stock-info">
            <p>{{ key }} - {{ value }}$</p>
            <p :id="key">Имеется акций: {{ calculateDiff(key) }}</p>
        </div>      
        <div class="stock-buy">
            <input type="text" :id="key+'-input'" value="0"/>
            <button @click="saleStocks" :id="key">Продать</button>
            <button @click="buyStocks" :id="key">Купить</button>
        </div>
        <div class="stock-chart">
            <BarChart :chartData="parseData(key)" :options="chartOptions" />
        </div>
    </div>
</template>
  
  <script>
  import socket from '../Socket'
  import { toRaw } from 'vue'

  import BarChart from './Chart.vue'

  export default {
    name: 'StockExchange',
    components: { BarChart },
    mounted(){
        socket.on("connect", () => {
            console.log("vue connected")
        })

        socket.on("Sale", (data) => {
            let stocksData = JSON.parse(data);
            this.stockData = stocksData;
            let stocksList = Object.keys(stocksData);
            this.dataOfExchange = stocksData[stocksList[0]][stocksData[stocksList[0]].length-1].date;
            
            let lastPrice = {};
            for(let stock of stocksList){
                lastPrice[stock] = stocksData[stock][stocksData[stock].length-1].price;
            }

            this.lastPrices = lastPrice;
        })
    },
    data(){return{
        dataOfExchange: "Загрузка...",
        lastPrices: {},
        stockData: {}
    }},
    methods:{
        calculateDiff(stockSymbol){
            let userStocks = toRaw(this.$store.getters.getStocks);
            let stockIDX = userStocks.findIndex(e => e.symbol == stockSymbol);

            if(stockIDX == -1 || userStocks[stockIDX].count == 0){
                return "0"; 
            }

            let diff = this.lastPrices[stockSymbol] * userStocks[stockIDX].count - userStocks[stockIDX].spent;

            return userStocks[stockIDX].count + '(' + diff +')';
        },
        saleStocks(e){
            let symbolStock = e.target.id
            let input = document.getElementById(symbolStock + '-input')
            let cnt = Number(input.value); 
            let price = this.lastPrices[symbolStock];

            let userStocks = toRaw(this.$store.getters.getStocks);
            let stockIDX = userStocks.findIndex(e => e.symbol == symbolStock);

            if(Number.isNaN(cnt) || cnt <= 0){
                alert("Некорректные данные!");
                return;
            }
            
            if(stockIDX == -1 || cnt > userStocks[stockIDX].count){
                alert("Недостаточно акций!!!");
                return;
            }

            let sendData = {
                symbol: symbolStock,
                count: cnt,
                price: price,
                id: this.$store.getters.getId
            }

            console.log(sendData);

            fetch('http://localhost:3001/saleStocks',{
                method: 'POST',
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json'
            }})
            .then(response => response.json())
            .then(value => {
                this.$store.commit('SET_BALANCE', value.money.toFixed(2));
                this.$store.commit('SET_STOCKS', value.stocks);
            });
        },
        buyStocks(e){
            let symbolStock = e.target.id
            let input = document.getElementById(symbolStock + '-input')
            let cnt = Number(input.value); 
            let price = this.lastPrices[symbolStock]

            if(Number.isNaN(cnt) ||cnt <= 0){
                alert("Некорректные данные!");
                return;
            }

            if(price * cnt > this.$store.getters.getBalance){
                alert("Недостаточно денег!!!");
                return;
            }

            let sendData = {
                symbol: symbolStock,
                count: cnt,
                price: price,
                id: this.$store.getters.getId
            }

            console.log(sendData);

            fetch('http://localhost:3001/buyStocks',{
                method: 'POST',
                body: JSON.stringify(sendData),
                headers: {
                    'Content-Type': 'application/json'
            }})
            .then(response => response.json())
            .then(value => {
                this.$store.commit('SET_BALANCE', value.money);
                this.$store.commit('SET_STOCKS', value.stocks);
            });
        },
        parseData(stockSymbol) {
            let Rdata = toRaw(this.stockData); 

            let labels = []; 
            let values = []; 

            for(let i = 0; i < Rdata[stockSymbol].length; ++i){
                labels.push(Rdata[stockSymbol][i].date);
                values.push(Rdata[stockSymbol][i].price);
            }

            return {
                labels: labels,
                datasets: [ { data: values, label: stockSymbol, borderColor: 'rgb(235, 86, 0)' } ]
            }
        },
        getAdminRoot() {
            return this.$store.getters.getAdminRoot;
        }
    },
    computed:{
        getFullName() {return this.$store.getters.getFullName;},
    }
  }
  </script>
  
  <style scoped>
    .exchange-date{
        display: flex;
        flex-direction: column;
        width: 350px;
        align-items: flex-start;
        color: hsl(0, 0%, 100%);
        border-radius: 0px 0px 90px 0px;
        background: #06F;
        padding-left: 10PX;
        font-size: 21px;
    }

    .stock-info{
        display: block;
        width: 600px;
        color: white;
        border-radius: 292px 360px 0px 0px;
        background: #06F;
        font-size: 21px;
        margin-left: auto;
        margin-right: auto;
    }

    .stock-buy{

    }

    .stock-chart{
        width: 1000px;
        margin-left: auto;
        margin-right: auto;
    }

  </style>
  