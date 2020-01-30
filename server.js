const WebSocket = require('ws');
const asyncRedis = require('async-redis');

const ws = new WebSocket('wss://www.bitmex.com/realtime');
const config = require('./config/env');

const client = asyncRedis.createClient(config.development.redis.test_socket);

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
                await client.hset(`marketData:${bitMexData.data[0].symbol}`, 'currentPrice', bitMexData.data[0].price);
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
                await client.hset(`marketData:${bitMexData.data[0].symbol}`, keyValueArray);
                break;
        }
    }catch (e) {
        console.error(e)
    }
});

