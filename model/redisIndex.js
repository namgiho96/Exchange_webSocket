const asyncRedis = require('async-redis');
const config = require('../config/env');

const client = asyncRedis.createClient(config.development.redis.test_socket);

client.on('error', function (err) {
    console.log(`Error ${err}`)
});
