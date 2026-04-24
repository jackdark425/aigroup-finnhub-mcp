import { pino } from 'pino';
import { getConfig } from '../config.js';

const config = getConfig();

export const logger = pino({
  level: config.log.level,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      destination: 2,
    },
  },
});

export function getLogger(name: string): pino.Logger {
  return logger.child({ component: name });
}
