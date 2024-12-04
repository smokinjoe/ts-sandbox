import {
  LogEmitter,
  LogEvent,
  LoggerAttributes,
  NewRelicClient,
} from "./logger.types";
import { createLogParser } from "./logParser";

function loggerFailsafe(fn: () => void) {
  try {
    fn();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("An error occurred while attempting to emit logs", e);
  }
}

// Our own internal logger that helps clean up our messages/errors before
// logging it to the console
const getDevEmitter = () => {
  const devLogEmitter: LogEmitter = {
    emit: (event: LogEvent) => {
      let levelPrefix = `[${event.level}]`.padEnd(7);

      if (event.message) {
        console.log(`${levelPrefix} ${event.message}`);
      }
      if (event.error) {
        console.log(levelPrefix, event.error);
      }
      if (event.data) {
        console.log(levelPrefix, event.data);
      }
    },
  };
  return devLogEmitter;
};

// This will serve as the API adapter layer between our development emitter and
// another service like new relic
const getNewRelicClient = (emitter: LogEmitter) => {
  const client = {
    noticeError: (error: Error | string, data?: LoggerAttributes): void => {
      emitter.emit({
        level: "error",
        message: error instanceof Error ? error.message : error,
        error: error instanceof Error ? error : undefined,
        data,
      });
    },
  };

  return client;
};

const logParser = createLogParser<LoggerAttributes>((data) => data);

// This will serve as an adapter between our own client-side logging and new relic
const getNewRelicLogger = (client: NewRelicClient) => {
  return {
    error: (
      message: string | Error,
      customAttributes?: Record<string, string | number>
    ) => {
      const event = logParser("error", message);
      client.noticeError(event.error ?? event.message, customAttributes);
    },
    errorWithMessage: (error: Error, extraMessage: string) => {
      const event = logParser("error", error);
      client.noticeError(event.error ?? event.message, {
        errorMessage: extraMessage,
      });
    },
    debug: (_: string | Error) => {
      // Not supported by new relic logger
    },
  };
};

export const getNRClient = () => {
  // Check whether we are working locally or on prod
  // In this case we'll only be doing dev/local work
  return getNewRelicClient(getDevEmitter());
};

export const getLogger = () => {
  return getNewRelicLogger(getNRClient());
};
