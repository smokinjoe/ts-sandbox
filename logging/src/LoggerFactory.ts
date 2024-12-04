import { getLogger } from "./logger";
import { LoggerBase, LoggerAttributes } from "./logger.types";

export class Logger {
  private logger: LoggerBase;
  customAttributes: LoggerAttributes;

  constructor(customAttributes: LoggerAttributes) {
    this.logger = getLogger();
    this.customAttributes = customAttributes;
  }
}
