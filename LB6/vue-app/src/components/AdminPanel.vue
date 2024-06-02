<template>
    <div v-for="broker in brokersList" :key="broker.id">
        <div class="broker">
            <p> {{ broker.fullName }} - {{ broker.money }}$</p>
        </div>
        <div class="broker-stocks">
            <div v-for="stocks in broker.stocks" :key="stocks.symbol">
                <p>{{ stocks.symbol }}: {{ calculateDiff(stocks.symbol, broker.stocks) }}</p>
            </div>
        </div>
    </div>    
</template>
  
  <script>
  import socket from "../Socket.js";

  export default {
    name: 'AdminPanel',
    mounted(){
        this.getBrokers();

        socket.on("connect", () => {
            console.log("vue connected")
        })
        
        socket.on("Sale", (data) => {
            let stocksData = JSON.parse(data);
            let stocksList = Object.keys(stocksData);
            
            let lastPrice = {};
            for(let stock of stocksList){
                lastPrice[stock] = stocksData[stock][stocksData[stock].length-1].price;
            }

            this.lastPrices = lastPrice;
        })
    },
    data() {return{
        brokersList: [],
        lastPrices: {}
    }},
    methods:{
        calculateDiff(stockSymbol, userStocks){
            let stockIDX = userStocks.findIndex(e => e.symbol == stockSymbol);

            if(stockIDX == -1 || userStocks[stockIDX].count == 0){
                return "0"; 
            }

            let diff = this.lastPrices[stockSymbol] * userStocks[stockIDX].count - userStocks[stockIDX].spent;
            diff = diff.toFixed(2);


            if(diff>0)
                return userStocks[stockIDX].count + ' (+' + diff +')';
            else
                return userStocks[stockIDX].count + ' (' + diff +')';
        },
        getBrokers(){ 
            fetch('http://localhost:3001/brokers', { method: 'GET' })
            .then(response => response.json())
            .then(value => this.brokersList = value.Brokers);
        }
    }
  }
  </script>
  
  <style scoped>
    .broker{
        display: flex;
        height: 50px;
        width: 600px;
        align-items: center;
        justify-content: center;
        color: white;
        border-radius: 292px 360px 0px 0px;
        background: #06F;
        font-size: 21px;
        margin-left: auto;
        margin-right: auto;
    }

    .broker-stocks{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 600px;
        gap: 10px;
        color: white;
        background: #06F;
        font-size: 16px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 10px;
    }

  </style>
  