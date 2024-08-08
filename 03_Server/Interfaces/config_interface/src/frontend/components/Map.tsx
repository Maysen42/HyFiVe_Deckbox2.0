import { useEffect, useRef, useState } from "react";
import { Map, Marker, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { HoverInfo, Status } from "../../../src/backend/types";
import Dropdown from "./Dropdown/Dropdown";
import Button from "./Button";
interface ThuenenMapProps {
  data?: (Status & HoverInfo)[];
}
/**
 * ThuenenMap component for rendering a map with markers and popups based on provided data.
 * @param {ThuenenMapProps} props - The properties for the ThuenenMap component.
 * @param {Status & HoverInfo} props.data - The array of status and hover information for map markers.
 * @returns {JSX.Element} - The JSX element representing the ThuenenMap component.
 */
const ThuenenMap = ({ data }: ThuenenMapProps) => {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const [mapStyle, setMapStyle] = useState("basic-v2");
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);

  const initialState = {
    lat: 54.1767,
    lng: 12.08402,
    zoom: 11,
  };

  /**
   * Function to handle adding the map source.
   * @function
   */
  const handleSource = () => {
    if (!map.current?.getSource("openseamap-source")) {
      map.current?.addSource("openseamap-source", {
        type: "raster",
        tiles: ["https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"],
        tileSize: 256,
      });
    }
  };
  /**
   * Function to handle adding the map layer.
   * @function
   */
  const handleLayer = () => {
    if (!map.current?.getLayer("openseamap"))
      map.current?.addLayer({
        id: "openseamap",
        type: "raster",
        source: "openseamap-source",
        minzoom: 0,
        maxzoom: 22,
        paint: {
          "raster-opacity": 0.8,
        },
      });
  };

  /**
   * Function to create a marker and popup for a status object.
   * @function
   * @param {Map} map - The map instance.
   * @param {number} lng - The longitude coordinate.
   * @param {number} lat - The latitude coordinate.
   * @param {Status & HoverInfo} status - The status object.
   */
  const createMarker = (map: Map, lng: number, lat: number, status: Status & HoverInfo) => {
    const mapMarker: Marker = new Marker({ color: "#375c96" });

    const html = `
      <div>Logger ${status.logger_id}</div>
      <div>${status.date ? status.date : ""}</div>
      <div>Deckbox ID: ${status.deck_unit_id ? status.deck_unit_id : ""}</div>
      <div>Vessel: ${status.name ? "„" + status.name + "“" : ""}</div>`;

    const popup = new Popup({ closeButton: false, offset: 10 }).setHTML(html);

    mapMarker.setLngLat([lng, lat]).setPopup(popup).addTo(map);

    setMarkers((prevMarkers: Marker[]) => [...prevMarkers, mapMarker]);
    setPopups((prevPopups: Popup[]) => [...prevPopups, popup]);

    mapMarker.getElement().addEventListener("mouseenter", () => {
      popup.addTo(map);
    });

    mapMarker.getElement().addEventListener("mouseleave", () => {
      popup.remove();
    });
  };

  /**
   * Function to remove all markers and popups from the map.
   * @function
   */
  const removeMarkers = () => {
    markers?.forEach((marker) => {
      marker?.remove();
    });
    setMarkers([]);
    popups?.forEach((popup) => {
      popup?.remove();
    });
    setPopups([]);
  };
  // Effect to initialize the map
  useEffect(() => {
    if (!mapContainer?.current || map.current) return;
    map.current = new Map({
      container: mapContainer.current,
      style: `${
        "https://api.maptiler.com/maps/" + mapStyle + "/style.json?key=" + process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN
      }`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });
    map.current.on("load", function () {
      handleSource();
      handleLayer();
    });
    map.current.addControl(new NavigationControl());
  }, []);

  // Effect to update markers when data changes
  useEffect(() => {
    removeMarkers();
    if (!data || data?.length < 1) return;
    fitAll(data);
    data?.map((statusObject) => {
      if (map.current && statusObject.deckbox_position_last?.lng && statusObject.deckbox_position_last?.lat) {
        createMarker(
          map.current,
          statusObject.deckbox_position_last.lng,
          statusObject.deckbox_position_last.lat,
          statusObject
        );
      }
    });
  }, [data]);

  const onMapChange = (style: string) => {
    const mapUrl =
      "https://api.maptiler.com/maps/" + style + "/style.json?key=" + process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN;
    map.current?.setStyle(`${mapUrl}`);
    map.current?.on("styledata", function () {
      handleSource();
      handleLayer();
    });
    setMapStyle(style);
  };

  /**
   * Function to fly to a specific status object's location.
   * @function
   * @param {Status} status - The status object.
   */
  const flyTo = (status: Status) => {
    if (map.current && status !== undefined) {
      map.current.flyTo({
        center: status.deckbox_position_last,
        zoom: 9,
        bearing: 0,
        speed: 0.8,
        curve: 1,
        easing(t) {
          return t;
        },
        essential: true,
      });
    } else {
      fitAll(data);
    }
  };

  /**
   * Function to fit the map to display all data points.
   * @function
   * @param {Status[]} data - The array of status objects.
   */
  const fitAll = (data: Status[] | undefined) => {
    const filteredData = data?.filter(
      (status) =>
        !isNaN(Number(status?.lat)) &&
        status.lat !== undefined &&
        !isNaN(Number(status?.lng)) &&
        status.lng !== undefined
    );
    const lngSorted = filteredData?.map((e: Status) => e.deckbox_position_last?.lng)?.sort((a, b) => a - b) ?? [];
    const latSorted = filteredData?.map((e: Status) => e.deckbox_position_last?.lat)?.sort((a, b) => a - b) ?? [];
    if (
      map.current &&
      lngSorted.length > 0 &&
      latSorted.length > 0 &&
      lngSorted[0] !== undefined &&
      latSorted[0] !== undefined &&
      lngSorted[lngSorted.length - 1] !== undefined &&
      latSorted[latSorted.length - 1] !== undefined
    ) {
      map.current.fitBounds(
        [
          [lngSorted[0], latSorted[0]],
          [lngSorted[lngSorted.length - 1], latSorted[latSorted.length - 1]],
        ],
        { padding: 40 }
      );
    }
  };
  return (
    <>
      <div className="flex flex-row mb-2 mt-2">
        <Dropdown data={data} hasFly={flyTo} style="w-64" text={"Status position"} />
        <div className="flex flex-1 justify-end">
          <Button
            onClick={() => onMapChange(mapStyle === "basic-v2" ? "satellite" : "basic-v2")}
            text={"Map style: " + mapStyle}
            button_type={mapStyle === "basic-v2" ? "default" : ""}
          />
        </div>
      </div>
      <div className="h-[450px] rounded-lg" ref={mapContainer}></div>
    </>
  );
};
export default ThuenenMap;
