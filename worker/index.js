const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort, // inside folder of keys.js
  retry_strategy: () => 1000, // to retry every 1 sec if lose connection
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
} // solution using recursion

sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");
