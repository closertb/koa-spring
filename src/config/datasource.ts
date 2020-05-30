import * as redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});
 
client.on("error", function(error) {
  console.error(error);
});


export default client;

export function setAsyncValue(key: string, value: {} | string) {
  return promisify(client.set).call(client, key, value as string ? value : JSON.stringify(value))
}

export function getAsyncValue(key: string) {
  return promisify(client.get).call(client, key)
}