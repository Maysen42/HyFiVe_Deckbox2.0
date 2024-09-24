import {
  CalibrationCoefficient,
  Contact,
  DeckUnit,
  Logger,
  Platform,
  Sensor,
  SensorType,
  Unit,
  Vessel,
} from "./entities";
import { CombinedDeckboxData } from "./services/database/DeckboxService";
import { CombinedLoggerData } from "./services/database/LoggerService";
import { SensorByLogger } from "./services/database/SensorService";

export type Position = {
  lng: number;
  lat: number;
  date: number;
};

export type LoggerConfigData = Status & CombinedLoggerData;
export type LoggerConfigDataKey = keyof LoggerConfigData;

export type TableData = LoggerConfigData | SensorByLogger;
export type CombinedDeckboxDataKey = keyof CombinedDeckboxData;
export type TableKey = SensorByLoggerKey | LoggerConfigDataKey;
export type SensorByLoggerKey = keyof SensorByLogger;
export type ChangedData = LoggerTableData | SensorTableData;

export type Status = {
  battery_remaining: number;
  memory_capacity_total: number;
  memory_capacity_used: number;
  memory_capacity_used_percent?: number;
  memory_capacity_remaining?: number;
  deckbox_position_last: Position;
  logger_id?: number | undefined;
  lng?: number;
  lat?: number;
  date?: string;
};

export type HoverInfo = {
  name: string;
  deck_unit_id: number;
};

export type ServiceError = {
  success: boolean;
  error: string;
};

export type ServiceWarning = {
  warning?: boolean;
  message?: string;
};

export const isLogger = (obj: any) => {
  const keys = Object.keys(obj);
  return keys.includes("fw_version");
};

export const isSensor = (obj: any) => {
  const keys = Object.keys(obj);
  return keys.includes("sensor_type_id");
};

export const isStatus = (obj: any) => {
  const keys = Object.keys(obj);
  return keys.includes("battery_remaining");
};

export type DropdownData = Logger[] | Sensor[] | Status[] | Platform[] | Contact[];
export type DropdownDataKey = keyof DropdownData;
export type LoggerConfigTableData = {
  logger_id?: number;
  config_update_periode?: number;
  status_upload_periode?: number;
  sample_periode?: number;
  sample_cast_enable?: number;
  sample_cast_periode?: number;
  cast_det_sensor?: number;
  wet_det_sensor?: number;
  wet_det_periode?: number;
  wet_det_threshold?: number;
  cast_det_sensor_threshold?: number;
  dry_det_sensor?: number;
  dry_det_threshold?: number;
  dry_det_verify_delay?: number;
  data_upload_retry_periode?: number;
  contact_name?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  deployment_contact_id?: number;
  wifi: Wifi[];
};
export type LoggerDBTableData = {
  date_manufactoring?: Date;
  Comment?: string;
  device_id?: number;
  deck_unit_id?: number;
  fw_version?: string;
  logger_id: number;
  manufacturer?: string;
  operation_mode?: string;
  contact_id?: number;
  contact_name?: ContactName;
  name?: string;
  num_sensors?: number;
  platform_id?: number;
};
export type Wifi = { ssid: string; pw: string };

type ContactName = {
  first_name: string;
  last_name: string;
};

export type SensorConfigTableData = {
  logger_id: number;
  sensor_id: number;
  sensor_type_id: number;
  sensor_type?: SensorType;
  sample_periode_multiplier: number;
  sample_cast_periode_multiplier: number;
  calib_coeff?: CalibrationCoefficient[];
};

export type SensorDBTableData = {
  date_manufactoring: Date;
  sensor_id: number;
  sample_periode_multiplier: number;
  sample_cast_periode_multiplier: number;
  bus_address: number;
  sensor_type_id: number;
  parameter: string;
  long_name: string;
  unit: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  parameter_no: number;
  accuracy: number;
  resolution: number;
  logger_id: number;
  sensor_type?: SensorType;
  unit_id: number;
};

export type SuggestionData = Contact | Vessel | Unit | SensorType;
export type CompareData = Sensor | DeckUnit | Platform | Logger | Vessel | SensorType | Unit | Contact;
export type LoggerTableData = LoggerConfigTableData | LoggerDBTableData | Status;
export type SensorTableData = SensorConfigTableData | SensorDBTableData;

export type SuggestionObj = { [key: string]: boolean };

export type LoggerConfigFileData = LoggerDBTableData &
  LoggerConfigTableData & {
    sensors: (SensorDBTableData & SensorConfigTableData)[];
  };

export type DatabaseError = {
  success: boolean;
  error: any;
};
