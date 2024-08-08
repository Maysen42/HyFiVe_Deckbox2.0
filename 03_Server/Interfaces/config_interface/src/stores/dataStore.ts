import { makeAutoObservable, reaction } from "mobx";
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
} from "../backend/entities";
import { SensorService } from "../frontend/services/database/SensorService";
import { SensorTypeService } from "../frontend/services/database/SensorTypeService";
import { DeckboxService } from "../frontend/services/database/DeckboxService";
import { PlatformService } from "../frontend/services/database/PlatformService";
import { LoggerService } from "../frontend/services/database/LoggerService";
import { LoggerByID } from "../backend/services/database/LoggerService";
import { ContactService } from "../frontend/services/database/ContactService";
import { VesselService } from "../frontend/services/database/VesselService";
import { UnitService } from "../frontend/services/database/UnitService";
import { CalibrationCoefficientService } from "../frontend/services/database/CalibrationCoefficientService";
import { LoggerConfigFileData, LoggerDBTableData, SensorDBTableData, Status, Wifi } from "../backend/types";
import { StatusFileService } from "../frontend/services/file/StatusFileService";

class DataStore {
  public logoutVisible: boolean = false;
  public resetTrigger: boolean = false;
  public isEditing: boolean = false;
  public selectedLoggerID: number = 0;
  public selectedSensorID: number = 0;
  public selectedID: number = 0;

  public access: string | null = null;
  public activeTab: number = 0;
  public firstLoggerID: number = 0;

  public sensorData: Sensor[] = [];
  public deckBoxData: DeckUnit[] = [];
  public platformData: Platform[] = [];
  public loggerDetail: LoggerByID[] = [];
  public contactData: Contact[] = [];
  public vesselData: Vessel[] = [];
  public mapVisiblePosition: number[] = [];
  public loggerData: Logger[] = [];
  public unitData: Unit[] = [];
  public sensorTypeData: SensorType[] = [];
  public calibrationData: CalibrationCoefficient[] = [];
  public changedData: any[] = [];
  public changesOverviewData: any[] = [];
  public dataForDatabase: LoggerDBTableData | SensorDBTableData | undefined;
  public overlayVisible: { visible: boolean; trigger?: string } = { visible: false };
  public validationErrors: { [key: string]: string } = {};
  public dataForConfigFile: LoggerConfigFileData | undefined;
  public statusPositionData: Status[] = [];
  public wifisForConfig: Wifi[] = [];
  public existingWifis: Wifi[] = [];
  public newCalibrationCoefficient: CalibrationCoefficient[] = [];

  private sensorService: SensorService = new SensorService();
  private deckboxService: DeckboxService = new DeckboxService();
  private platformService: PlatformService = new PlatformService();
  private loggerService: LoggerService = new LoggerService();
  private contactService: ContactService = new ContactService();
  private vesselService: VesselService = new VesselService();
  private unitService: UnitService = new UnitService();
  private sensorTypeService: SensorTypeService = new SensorTypeService();
  private calibrationCoefficientService: CalibrationCoefficientService = new CalibrationCoefficientService();
  private statusFileService: StatusFileService = new StatusFileService();

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => !!this.access,
      async () => {
        try {
          this.fetchData();
        } catch (error) {
          console.error("Fehler beim Abrufen der Daten aus der Datenbank:", error);
        }
      }
    );
  }

  fetchData() {
    this.fetchSensorData();
    this.fetchDeckboxData();
    this.fetchPlatformData();
    this.fetchContactData();
    this.fetchVesselData();
    this.fetchStatusPositionData();
    this.fetchLoggerData();
    this.fetchUnitData();
    this.fetchSensorTypeData();
    this.fetchCalibrationData();
  }

  async fetchStatusPositionData() {
    const newData = await this.statusFileService.getPositionsFromStatusFiles();
    this.statusPositionData = newData;
  }

  async fetchCalibrationData() {
    const newData = await this.calibrationCoefficientService.selectAll();
    this.calibrationData = newData;
  }
  async fetchSensorTypeData() {
    const newData = await this.sensorTypeService.selectAll();
    this.sensorTypeData = newData;
  }
  async fetchUnitData() {
    const newData = await this.unitService.selectAll();
    this.unitData = newData;
  }
  async fetchLoggerData() {
    const newData = await this.loggerService.selectAll();
    this.loggerData = newData;
    this.setMapVisiblePosition(this.loggerData.map((logger) => logger.logger_id));
  }

  async fetchVesselData() {
    const newData = await this.vesselService.selectAll();
    this.vesselData = newData;
  }

  async fetchSensorData() {
    const newData = await this.sensorService.selectAll();
    this.sensorData = newData;
  }

  async fetchDeckboxData() {
    const newData = await this.deckboxService.getCombindedDeckboxData();
    this.deckBoxData = newData;
  }

  async fetchPlatformData() {
    const newData = await this.platformService.selectAll();
    this.platformData = newData;
  }

  async fetchContactData() {
    const newData = await this.contactService.selectAll();
    this.contactData = newData;
  }

  async getLoggerConfigData(logger_id: number) {
    const newData = await this.loggerService.findByID(logger_id);
    this.loggerDetail = newData;
  }

  setlogoutVisible(value: boolean) {
    this.logoutVisible = value;
  }

  setActiveTab(activeTab: number) {
    this.activeTab = activeTab;
  }
  setSelectedSensorID(selectedSensorID: number) {
    this.selectedSensorID = selectedSensorID;
  }

  setSelectedLoggerID(selectedLoggerID: number) {
    this.selectedLoggerID = selectedLoggerID;
  }

  setAccess(access: string | null) {
    this.access = access;
  }

  setFirstLoggerID(firstLoggerID: number) {
    this.firstLoggerID = firstLoggerID;
  }

  setOverlayVisible(overlayVisible: { visible: boolean; trigger?: string }) {
    this.overlayVisible = overlayVisible;
  }

  setDataForDatabase(dataForDatabase: LoggerDBTableData | SensorDBTableData) {
    this.dataForDatabase = dataForDatabase;
  }

  setChangesOverviewData(changesOverviewData: any[]) {
    this.changesOverviewData = changesOverviewData;
  }

  setChangedData(changedData: any[]) {
    this.changedData = changedData;
  }

  setValidationErros(errors: { [key: string]: string }) {
    this.validationErrors = errors;
  }

  setDataForConfigFile(dataForConfigFile: LoggerConfigFileData) {
    this.dataForConfigFile = dataForConfigFile;
  }

  setMapVisiblePosition(mapVisiblePosition: number[]) {
    this.mapVisiblePosition = mapVisiblePosition;
  }

  setResetTrigger(resetTrigger: boolean) {
    this.resetTrigger = resetTrigger;
  }

  setExistingWifis(existingWifis: Wifi[]) {
    this.existingWifis = existingWifis;
  }

  setWifisForConfig(wifisForConfig: Wifi[]) {
    this.wifisForConfig = wifisForConfig;
  }

  setNewCalibrationCoefficient(newCalibrationCoefficient: CalibrationCoefficient[]) {
    this.newCalibrationCoefficient = newCalibrationCoefficient;
  }

  setEditing(isEditing: boolean) {
    this.isEditing = isEditing;
  }
  setSelectedID(selectedID: number) {
    this.selectedID = selectedID;
  }
}

export default DataStore;
