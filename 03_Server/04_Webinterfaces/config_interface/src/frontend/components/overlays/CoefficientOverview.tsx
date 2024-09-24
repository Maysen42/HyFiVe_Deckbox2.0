import { useState } from "react";
import { useStore } from "../../../stores";
import Button from "../Button";
import { CalibrationCoefficient } from "../../../backend/entities";
import { FieldValues, useForm } from "react-hook-form";
import InputComponent from "../Table/InputComponent";
import ErrorImage from "../Table/ErrorImage";
import { formatCalibrationValue, validateCalibrationData } from "../../utils";
import OverlayWrapper from "./OverlayWrapper";

interface CoefficientOverviewProps {
  onClick: (event?: React.MouseEvent<Element, MouseEvent>) => void;
  selectedSensorID: number;
  newEntry: boolean;
  sensorType: number;
}

/**
 * CoefficientOverview component for displaying and managing calibration coefficients.
 * @param {CoefficientOverviewProps} props - The properties for the CoefficientOverview component.
 * @param {Function} props.onClick - The click event handler.
 * @param {number} props.selectedSensorID - The ID of the selected sensor.
 * @param {boolean} props.newEntry - Flag indicating if it's a new entry.
 * @param {number} props.sensorType - The type of the sensor.
 * @returns {JSX.Element} - The JSX element representing the CoefficientOverview component.
 */
const CoefficientOverview = ({ onClick, selectedSensorID, newEntry, sensorType }: CoefficientOverviewProps) => {
  const { data: dataStore } = useStore();
  const { handleSubmit, register, reset } = useForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const previousCurrentStyle = "h-10 bg-danube-800 text-center text-white mx-1 p-2 font-bold my-2 pt-1 ";
  const comparisionStyle = "flex flex-wrap  p-2 my-1 mx-1 justify-center bg-white shadow";
  const sensorTypeObj = dataStore.sensorTypeData.find((type) => type.sensor_type_id === sensorType);

  // Filtered calibration coefficients based on sensor ID and sorted by time_calibration
  const filtered =
    dataStore.newCalibrationCoefficient?.length > 0
      ? dataStore.newCalibrationCoefficient
      : dataStore.calibrationData
          .filter((data) => Number(data.sensor_id) === Number(selectedSensorID))
          .sort((a, b) => new Date(b.time_calibration).getTime() - new Date(a.time_calibration).getTime())
          .slice(0, Number(sensorTypeObj?.no_of_calibration_coefficients))
          .sort((c, d) => c.coefficient_id_per_sensor_id - d.coefficient_id_per_sensor_id);

  // Create an array of new calibration coefficients
  const createCalibrationCoefficientArray = (length: number) => {
    const res: CalibrationCoefficient[] = [];
    for (let i = 0; i < length; i++) {
      const calibEntry: CalibrationCoefficient = {
        coefficient_id_per_sensor_id: i + 1,
        value: "",
        sensor_id: selectedSensorID,
        time_calibration: new Date(),
      };
      res.push(calibEntry);
    }
    return res;
  };

  const newEntryData = createCalibrationCoefficientArray(Number(sensorTypeObj?.no_of_calibration_coefficients));
  const shouldShowEmotyText = newEntryData?.length === 0 ? true : false;

  // Handle form submission
  const onSubmit = (formData: FieldValues) => {
    const errorObj = validateCalibrationData(formData, Number(sensorTypeObj?.digits_calibration_coefficients));
    setErrors(errorObj);

    if (Object.keys(errorObj)?.length > 0) return false;

    if (Object.keys(errorObj).length === 0) {
      const calCoeff: any[] = Object.keys(formData).map((key) => {
        return {
          ["sensor_id"]: Number(selectedSensorID),
          ["coefficient_id_per_sensor_id"]: Number(key),
          ["value"]: formatCalibrationValue(Number(formData[key])),
          ["time_calibration"]: new Date(),
        };
      });
      dataStore.setNewCalibrationCoefficient(calCoeff);
    }

    onClick();
    reset();
    return true;
  };

  return (
    <OverlayWrapper onClick={onClick} title={"Coefficient Overview"}>
      {!shouldShowEmotyText && (
        <div className="flex flex-row bg-danube-800 shadow w-auto mt-4 my-1 h-12 rounded-t-lg z-30">
          <div className={`${previousCurrentStyle} w-2/5`}>Coefficient per ID</div>
          <div className={`${previousCurrentStyle} w-full text-center`}>Value</div>
        </div>
      )}
      <div
        className={`relative flex flex-col overflow-y-auto bg-danube-50 shadow w-auto h-auto rounded-b-lg z-30 mt-4`}
      >
        {shouldShowEmotyText && (
          <div className="p-2">Number of calibration coefficients for sensor tyoe is 0 in db</div>
        )}
        {!newEntry &&
          filtered.map((item, index) => {
            return (
              <div key={index}>
                <div className="flex flex-row">
                  <div
                    className={`${comparisionStyle} w-2/5 rounded-l-lg`}
                    style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                  >
                    {item.coefficient_id_per_sensor_id}
                  </div>
                  <div
                    style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                    className={`${comparisionStyle} w-full rounded-r-lg`}
                  >
                    {formatCalibrationValue(Number(item.value))}
                  </div>
                </div>
              </div>
            );
          })}
        {newEntry && !shouldShowEmotyText && (
          <form onSubmit={handleSubmit(onSubmit)} id="calib_coeff">
            {newEntryData.length > 0 &&
              newEntryData.map((entry, index) => {
                const id = entry.coefficient_id_per_sensor_id;

                return (
                  <div className="flex flex-row" key={id}>
                    <div
                      className={`${comparisionStyle} w-2/5 rounded-l-lg`}
                      style={{ wordBreak: "break-all", wordWrap: "break-word" }}
                    >
                      {id}
                    </div>

                    <InputComponent
                      style={`${comparisionStyle} w-full rounded-r-lg text-center focus:outline-danube-800 outline-1`}
                      key_string={String(id)}
                      register={register}
                      val={filtered[index]?.value}
                      isNew={false}
                      maxLength={Number(sensorTypeObj?.digits_calibration_coefficients)}
                    />
                    {Object.keys(errors).length > 0 && errors?.[id] && (
                      <div className="relative ">
                        <ErrorImage error_id={errors[id]} style="absolute right-4 top-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
          </form>
        )}
      </div>
      <div className="flex w-auto justify-end my-4">
        {newEntry && (
          <Button
            button_type="default"
            text="OK"
            style={"mr-2"}
            type="submit"
            form="calib_coeff"
            disabled={shouldShowEmotyText}
          />
        )}
        <Button button_type="" text="Cancel" style={"mr-2"} onClick={onClick} />
      </div>
    </OverlayWrapper>
  );
};

export default CoefficientOverview;
