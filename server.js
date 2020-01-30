const WebSocket = require('ws');
const ws = new WebSocket('wss://www.bitmex.com/realtime');

const redisCrtl = require('./model/redisIndex');

ws.on('open', async (data) =>{
    await ws.send(JSON.stringify({
        "op": "subscribe",
        "args": ['trade:XBTUSD','trade:ETHUSD','instrument:XBTUSD','instrument:ETHUSD']
    }));
});

ws.on('message', async (data)=>{
    try {
        const bitMexData = JSON.parse(data);
        switch (bitMexData.table) {
            case 'trade' :
                await redisCrtl.calcPrice(bitMexData.data[0].symbol,bitMexData.data[0].price);
                break;
            case 'instrument' :
                let marketData = bitMexData.data[0];
                const keyValueArray = [];
                for (let key in marketData){
                    let value = marketData[key];
                    if(!value) {
                        value = 'null';
                    }
                    keyValueArray.push(key);
                    keyValueArray.push(value);
                }
                await redisCrtl.calcMarketData(bitMexData.data[0].symbol,keyValueArray);
                break;
        }
    }catch (e) {
        console.error(e)
    }
});

