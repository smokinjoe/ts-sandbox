export const logLevels = ["debug", "info", "warn", "error"] as const;
export type LogLevel = (typeof logLevels)[number];

export const logLevelMap: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export type LoggerAttributes = {
  action?: string;
  errorMessage?: string;
  errorCode?: string | number;
  logLevel?: LogLevel;
};

export type Action = (
  message: any,
  customAttributes?: LoggerAttributes
) => void;

export type LoggerBase = {
  debug: Action;
  error: Action;
};

export type LogEvent = {
  level: LogLevel;
  message: string;
  error?: Error;
  data?: object;
};

export type LogEmitter = {
  emit: (event: LogEvent) => void;
};

// export type NewRelicClient = Pick<
//   typeof newrelic,
//   "addPageAction" | "noticeError" | "addRelease" | "setCustomAttribute"
// >;

type SimpleType = string | number;

export type NewRelicClient = {
  noticeError: (
    error: Error | string,
    customAttributes?: Record<string, SimpleType>
  ) => void;
};
