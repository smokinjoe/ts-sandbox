import { LogEvent, LogLevel } from "./logger.types";

export type LogParser<T> = (
  level: LogLevel,
  log: Error | string,
  data?: T
) => LogEvent;

/**
 * In the case of our existing client logger, we just want to log exactly the data payload as we
 * This allows us to customize our log parsers based on the type of data payload we want to log
 * create it. However, there may be a case where we want to extract specific properties from a
 * payload before we log it.
 */
export function createLogParser<T>(dataHandler: (data: T) => any) {
  return (level: LogLevel, log: Error | string, data?: T): LogEvent => {
    const event: LogEvent = {
      level,
    } as LogEvent;
    if (log instanceof Error) {
      event.error = log;
      event.message = log.message;
      if (data) {
        event.data = dataHandler(data);
      }
      return event;
    }

    if (typeof log === "string") {
      event.message = log || "(Missing log message)";
      if (data) {
        event.data = dataHandler(data);
      }
      return event;
    }

    console.error("Unexpected data logged", log);

    return event;
  };
}
