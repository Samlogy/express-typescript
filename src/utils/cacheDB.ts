import { createClient } from 'redis';

import config from "config";
import log from "../logger";

const host = config.get("redis_host") as string;
const port = config.get("redis_port") as number;
const username = config.get("redis_username") as string;
const password = config.get("redis_password") as string;

const cache = createClient({
    url: `redis://${username}:${password}@${host}:${port}`
})

cache.on('connect', () => {
  log.info('Client connected to redis...')
})

cache.on('ready', () => {
  log.info('Client connected to redis and ready to use...')
})

cache.on('error', (err: any) => {
  log.info(err.message)
})

cache.on('end', () => {
  log.info('Client disconnected from redis')
})

process.on('SIGINT', () => {
  cache.quit()
})

export default cache;