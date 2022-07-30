import redis from "redis";

const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

await client.connect();

client.on('error', err => {
  console.log('Error ' + err);
});

export default client;
