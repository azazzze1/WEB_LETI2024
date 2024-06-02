import { Controller, Get, Post, Req, Res} from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { SocketService } from './socket.service';
import { IStock, IUser } from './interface';

@Controller()
export class AppController {
  index : number = 0;
  interval : any; 
  constructor(private socketService : SocketService) {}

  @Get('brokers')
  GetUsers(@Req() req : Request) : IUser[]{
    let users = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', 'utf8'));
    return users;
  }
  
  @Get('stocks')
  GetStocks(@Req() req : Request) : IStock[]{
    let stocks = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/stocks-list.json', 'utf8'));
    return stocks;
  }

  @Post('createBroker')
  PostCreateBroker(@Req() req : Request) : IUser[]{
    let users = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', 'utf8'));
    let newBroker = JSON.parse(JSON.stringify(req.body));
    users.Brokers.push(newBroker);
    writeFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', JSON.stringify(users));
    return users;
  }

  
  @Post('deleteBroker')
  PostDeleteBroker(@Req() req : Request) : IUser[]{
    let users = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', 'utf8'));
    let id = JSON.parse(JSON.stringify(req.body)).id;
    id = users.Brokers.findIndex(e => e.id == id);
    users.Brokers.splice(id, 1);
    writeFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', JSON.stringify(users));
    return users;
  }

  @Post('updateBrokersList')
  PostUpdateBrokersList(@Req() req : Request) : void{
    let users = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', 'utf8'));
    users.Brokers = req.body;
    writeFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', JSON.stringify(users));
  }


  @Post('showStock')
  PostShowStock(@Req() req : Request) : any {
    let symbol = JSON.parse(JSON.stringify(req.body)).symbol;
    let dataOfStockPrice = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/companies/' + symbol + '.json', 'utf8'));
    let labels = []; 
    let values = []; 
    for(let i = dataOfStockPrice.data.length - 1; i >= 0; --i){
      labels.push(dataOfStockPrice.data[i].date);
      values.push(dataOfStockPrice.data[i].price);
    }
    let data = {
      labels: labels,
      values: values
    };

    return JSON.stringify(data);
  }


  @Post('stopSale')
  PostStopSale(@Req() req : Request) : any {
    clearInterval(this.interval); 
    console.log("Конец");
  }

  @Post('startSale')
  PostStartSale(@Req() req : Request) : any {
    let data = JSON.parse(JSON.stringify(req.body));
    let dataOfStockPrice = {}; 
    let startDateSplit = data.startDate.split('-');
    let startDateCorrect = startDateSplit[1] + '/' + startDateSplit[2] + '/' + startDateSplit[0];

    let sendSaleInfo = {};

    for(let stockSymbol of data.stocks){
      sendSaleInfo[stockSymbol] = [];
      let stockData = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/companies/' + stockSymbol + '.json', 'utf8')).data;
      let id = stockData.findIndex(e => e.date == startDateCorrect);
      stockData.splice(id+1);
      stockData.reverse(); 
      dataOfStockPrice[stockSymbol] = stockData;
    }

    this.index = 0; 

    this.interval = setInterval(() => {
      for(let stockSymbol of data.stocks){
        sendSaleInfo[stockSymbol].push(dataOfStockPrice[stockSymbol][this.index])
      }
      this.index++;
      this.socketService.BroadCast("Sale", sendSaleInfo);
      console.log("Привет");
    }, data.speedChange * 1000);
  }
  
  @Post('buyStocks')
  PostBuyStocks(@Req() req : Request) : any {
    let data = JSON.parse(JSON.stringify(req.body));
    let users = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', 'utf8'));

    let idx = users.Brokers.findIndex(e => e.id == data.id);
    let stockIDX = users.Brokers[idx].stocks.findIndex(e => e.symbol == data.symbol);

    if(stockIDX == -1){
      let newStock = {
        symbol: data.symbol,
        count: data.count,
        spent: data.price * data.count
      }
      users.Brokers[idx].stocks.push(newStock);
    }else{
      users.Brokers[idx].stocks[stockIDX].count += data.count;
      users.Brokers[idx].stocks[stockIDX].spent = users.Brokers[idx].stocks[stockIDX].count * data.price;
    }

    users.Brokers[idx].money -= data.count * data.price;

    writeFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', JSON.stringify(users))
    
    return users.Brokers[idx]; 
  }

  @Post('saleStocks')
  PostSaleStocks(@Req() req : Request) : any {
    let data = JSON.parse(JSON.stringify(req.body));
    let users = JSON.parse(readFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', 'utf8'));

    let idx = users.Brokers.findIndex(e => e.id == data.id);
    let stockIDX = users.Brokers[idx].stocks.findIndex(e => e.symbol == data.symbol);

    if(stockIDX == -1){
      return users.Brokers[idx]; 
    }else{
      users.Brokers[idx].stocks[stockIDX].count -= data.count;
      users.Brokers[idx].stocks[stockIDX].spent = users.Brokers[idx].stocks[stockIDX].count * data.price;
    }

    users.Brokers[idx].money += data.count * data.price;

    writeFileSync('/home/azazzzel/WEB_LETI2024/LB5/my-nest/data/brokers-list.json', JSON.stringify(users))
    
    return users.Brokers[idx]; 
  }
}
