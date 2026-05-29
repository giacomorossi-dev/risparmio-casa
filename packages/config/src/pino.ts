import pino, { type LoggerOptions } from 'pino';

type CreateLoggerArgs = {
  service: string;
  stage?: string | undefined;
  level?: pino.LevelWithSilent | undefined;
};

export const createLogger = ({ service, stage, level }: CreateLoggerArgs) => {
  const isLambda = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
  const isDev = process.env.NODE_ENV !== 'production';

  const options: LoggerOptions = {
    level: level ?? (isDev ? 'debug' : 'info'),
    base: {
      service,
      stage: stage ?? process.env.SST_STAGE ?? 'local',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        '*.password',
        '*.token',
        '*.secret',
      ],
      censor: '[REDACTED]',
    },
  };

  if (!isLambda && isDev) {
    options.transport = {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss.l' },
    };
  }

  return pino(options);
};

export type Logger = ReturnType<typeof createLogger>;
