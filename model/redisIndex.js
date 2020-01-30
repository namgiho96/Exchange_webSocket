const config = require('../config/env');
const asyncRedis = require('async-redis');

const client = asyncRedis.createClient(config.development.redis.test_socket);

client.on('connect', (ready) => {
    console.log("Connected Redis - Socket Client");
});

client.on('error', (err) => {
    console.log(`err ${err}`)
});

const calcPrice = async (symbol, currentPrice) => {
    await client.hset(`marketData:${symbol}`, 'currentPrice', currentPrice);
};
exports.calcPrice = calcPrice;

const calcMarketData = async (symbol, allData) => {
    await client.hset(`marketData:${symbol}`, allData);
};
exports.calcMarketData = calcMarketData;








