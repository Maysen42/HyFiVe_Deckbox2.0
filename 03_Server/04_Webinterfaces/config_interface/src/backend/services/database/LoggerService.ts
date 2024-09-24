import { Insertable } from "kysely";
import { db } from "../../db";
import { LoggerDBTableData } from "../../types";
import { Logger } from "../../entities";

/**
 * Service class for handling Logger-related operations.
 */

export class LoggerService {
  /**
   * Retrieves all logger records.
   * @returns {Promise<any[]>} - Array of logger records.
   */
  async getAll() {
    const result = await db.selectFrom("Logger").selectAll().execute();
    return result;
  }

  /**
   * Finds a logger by its ID and retrieves associated data.
   * @param {number} logger_id - The ID of the logger to retrieve.
   * @returns {Promise<any>} - Object containing logger details and associated data.
   */
  async findByID(logger_id: number) {
    const result = await db
      .selectFrom("Logger")
      .where("Logger.logger_id", "=", logger_id)
      .leftJoin("PlatformContainsLogger", (join) =>
        join
          .onRef("PlatformContainsLogger.logger_id", "=", "Logger.logger_id")
          .on("PlatformContainsLogger.time_end", "is", null)
      )
      .leftJoin("Vessel", "Vessel.platform_id", "PlatformContainsLogger.platform_id")
      .leftJoin("Platform", "Platform.platform_id", "Platform.platform_id")
      .leftJoin("Contact", "Contact.contact_id", "Platform.contact_id")
      .leftJoin("LoggerContainsSensor", "LoggerContainsSensor.logger_id", "Logger.logger_id")
      .leftJoin("LoggerAllocatesDeckUnit", (join) =>
        join
          .onRef("LoggerAllocatesDeckUnit.logger_id", "=", "Logger.logger_id")
          .on("LoggerAllocatesDeckUnit.time_end", "is", null)
      )
      .leftJoin("Logger as logger", "logger.logger_id", "Logger.logger_id")
      .select([
        "Logger.logger_id",
        "Logger.operation_mode",
        "Logger.fw_version",
        "Logger.manufacturer",
        "Logger.Comment",
        "Platform.platform_id",
        "Vessel.name",
        "LoggerAllocatesDeckUnit.deck_unit_id",
      ])
      .orderBy("LoggerAllocatesDeckUnit.time_start", "desc")
      .executeTakeFirst();
    const num_sensors = await db
      .selectFrom("LoggerContainsSensor")
      .where("LoggerContainsSensor.logger_id", "=", logger_id)
      .where("LoggerContainsSensor.time_end", "is", null)
      .selectAll()
      .execute();
    const res = { ...result, num_sensors: num_sensors.length };

    return res;
  }

  /**
   * Retrieves combined logger data by performing a left join on multiple tables.
   * @returns {Promise<CombinedLoggerData[]>} - Array of combined logger data records.
   */
  async getCombindedLoggerData() {
    const result = await db
      .selectFrom("Logger as logger")
      .leftJoin("PlatformContainsLogger", (join) =>
        join
          .onRef("PlatformContainsLogger.logger_id", "=", "logger.logger_id")
          .on("PlatformContainsLogger.time_end", "is", null)
      )
      .leftJoin("Platform", "PlatformContainsLogger.platform_id", "Platform.platform_id")
      .leftJoin("Vessel", "Vessel.platform_id", "Platform.platform_id")
      .leftJoin("LoggerAllocatesDeckUnit", (join) =>
        join
          .onRef("LoggerAllocatesDeckUnit.logger_id", "=", "logger.logger_id")
          .on("LoggerAllocatesDeckUnit.time_end", "is", null)
      )
      .leftJoin("DeckUnit", "LoggerAllocatesDeckUnit.deck_unit_id", "DeckUnit.deck_unit_id")
      .leftJoin("Logger", "logger.logger_id", "Logger.logger_id")
      .select([
        "Logger.logger_id",
        "Logger.operation_mode",
        "Logger.fw_version",
        "LoggerAllocatesDeckUnit.deck_unit_id",
        "PlatformContainsLogger.platform_id",
        "Vessel.name",
      ])
      .orderBy("PlatformContainsLogger.time_start", "desc")
      .execute();
    return result;
  }

  /**
   * Edits a logger record by its ID and updates associated data.
   * @param {number} logger_id - The ID of the logger to edit.
   * @param {LoggerDBTableData} data - New data for the logger.
   * @returns {Promise<any>} - Object containing updated logger details and associated data.
   */
  async editLoggerByID(logger_id: number, data: LoggerDBTableData) {
    const logger = await db
      .updateTable("Logger")
      .set({ device_id: data.device_id })
      .set({ manufacturer: data.manufacturer })
      .set({ operation_mode: data.operation_mode })
      .set({ fw_version: data.fw_version })
      .set({ Comment: data.Comment })
      .where("Logger.logger_id", "=", logger_id)
      .executeTakeFirst();

    //set time end of logger to identify deactivated logger
    const loggerAllocatesDeckUnit = await db
      .updateTable("LoggerAllocatesDeckUnit")
      .set({ time_end: new Date() })
      .where("LoggerAllocatesDeckUnit.logger_id", "=", logger_id)
      .where("LoggerAllocatesDeckUnit.time_end", "is", null)
      .executeTakeFirst();

    if (data.deck_unit_id) {
      const insertLoggerAllocatesDeckUnit = await db
        .insertInto("LoggerAllocatesDeckUnit")
        .values({
          deck_unit_id: data.deck_unit_id ? Number(data.deck_unit_id) : 0,
          logger_id: logger_id,
          time_start: new Date(),
          time_end: null,
        })
        .executeTakeFirst();
    }

    //set time end of logger to identify deactivated logger
    const platformContainsLogger = await db
      .updateTable("PlatformContainsLogger")
      .set({ time_end: new Date() })
      .where("PlatformContainsLogger.logger_id", "=", logger_id)
      .where("PlatformContainsLogger.time_end", "is", null)
      .executeTakeFirst();

    //insert if not existed
    if (data.platform_id) {
      const insertPlatformContainsLogger = await db
        .insertInto("PlatformContainsLogger")
        .values({
          platform_id: data.platform_id ? Number(data.platform_id) : 0,
          logger_id: logger_id,
          time_start: new Date(),
          time_end: null,
        })
        .executeTakeFirst();
    }

    const res = await this.findByID(Number(logger_id));
    return res;
  }

  /**
   * Inserts a new logger record and associated data.
   * @param {LoggerDBTableData} data - Data for the new logger.
   * @returns {Promise<InsertNewLogger>} - Object containing details of the newly inserted logger.
   */
  async insertNewLogger(data: LoggerDBTableData) {
    const device = await db.insertInto("Device").values({ type: "Logger" }).executeTakeFirst();

    if (device.insertId) {
      const input: Insertable<Logger> = {
        logger_id: 0,
        device_id: Number(device.insertId),
        date_manufactoring: new Date(),
        operation_mode: data.operation_mode || "",
        fw_version: data.fw_version,
        Comment: data.Comment,
        manufacturer: data.manufacturer || "",
      };
      const logger = await db.insertInto("Logger").values(input).executeTakeFirst();
      const logger_id = Number(logger.insertId);

      if (!logger_id) return { success: false, error: "Could not insert Logger" };
      if (data.platform_id) {
        await db
          .insertInto("PlatformContainsLogger")
          .values({
            platform_id: data.platform_id,
            logger_id: logger_id,
            time_end: null,
            time_start: new Date(),
          })
          .executeTakeFirst();
      }
      if (data.deck_unit_id) {
        await db
          .insertInto("LoggerAllocatesDeckUnit")
          .values({
            deck_unit_id: data.deck_unit_id,
            logger_id: logger_id,
            time_start: new Date(),
            time_end: null,
          })
          .executeTakeFirst();
      }

      const res = await this.findByID(Number(logger_id));
      return res;
    } else {
      return { success: false, error: "Could not insert logger to devices" };
    }
  }
}

// Additional types for type checking and auto-completion
export type CombinedLoggerData = Awaited<ReturnType<LoggerService["getCombindedLoggerData"]>>[number];
export type LoggerByID = Awaited<ReturnType<LoggerService["findByID"]>>;
export type EditLoggerByID = Awaited<ReturnType<LoggerService["editLoggerByID"]>>;
export type InsertNewLogger = Awaited<ReturnType<LoggerService["insertNewLogger"]>>;
export type LoggerByIDKey = keyof LoggerByID;
