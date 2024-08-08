import { useEffect, useState } from "react";
import MultipleColumnTable, { ColumnProps } from "./MultipleColumnTable";
import TableHeader, { TableHeaderProps } from "./TableHeader";
import { highlightParameter } from "../../../backend/constants";
import { TableData } from "../../../backend/types";

export type HighlightParameter = typeof highlightParameter;
export type HighlightParameterkey = keyof HighlightParameter;

/**
 * Table component for displaying data in a table format with sortable columns.
 * @param {TableHeaderProps & ColumnProps} props - The properties for the Table component.
 * @param {TableHeaderProps} props.headerData - Data for rendering table headers.
 * @param {TableData[]} props.data - Data to be displayed in the table.
 * @param {string[]} props.tableKeys - Keys used to identify columns in the table.
 * @param {boolean} props.hasSwitch - Flag indicating whether the table has a switch column.
 * @param {string[]} props.linkedKey - Keys used for linking data in the table.
 * @param {string} props.defaultSort - Default sorting direction for the table.
 * @returns {JSX.Element} - The JSX element representing the Table component.
 */
const Table = ({ headerData, data, tableKeys, hasSwitch, linkedKey, defaultSort }: TableHeaderProps & ColumnProps) => {
  const [tableData, setTableData] = useState<any>(data);
  const [sorted, setSorted] = useState<boolean>(false);
  useEffect(() => {
    setTableData(data);
  }, [data]);

  /**
   * Sorts the table data based on the specified direction and column key.
   * @param {string} direction - The sorting direction ('up' or 'down').
   * @param {string} column_key - The key of the column to be sorted.
   */
  const sort = (direction: string, column_key: string) => {
    const type = typeof data.find((item) => item[column_key as keyof TableData] !== null)?.[
      column_key as keyof TableData
    ];
    let sortedData: any[] = [];
    if (type === "number" && direction === "down") {
      sortedData = data.sort((a, b) => {
        const numA: number = Number(Object(a)[column_key]);
        const numB: number = Number(Object(b)[column_key]);

        if (numA === null || numA === undefined || isNaN(numA)) {
          return 1;
        }
        if (numB === null || numB === undefined || isNaN(numB)) {
          return -1;
        }

        return numB - numA;
      });
    }
    if (type === "number" && direction === "up")
      sortedData = data.sort((a, b) => {
        const numA: number = Number(Object(a)[column_key]);
        const numB: number = Number(Object(b)[column_key]);

        if (numA === null || numA === undefined || isNaN(numA)) {
          return 1;
        }
        if (numB === null || numB === undefined || isNaN(numB)) {
          return -1;
        }

        return numA - numB;
      });

    if (type !== "number" && direction === "up") {
      sortedData = data.sort((a, b) => {
        const strA: string = String(Object(a)[column_key]);
        const strB: string = String(Object(b)[column_key]);
        if (strA === null || strA === undefined) {
          return strB === null || strB === undefined ? 0 : -1;
        }
        if (strB === null || strB === undefined) {
          return 1;
        }
        return strB.localeCompare(strA);
      });
    }
    if (type !== "number" && direction === "down") {
      sortedData = data.sort((a, b) => {
        const strA: string = String(Object(a)[column_key]);
        const strB: string = String(Object(b)[column_key]);

        if (strA === null || strA === undefined) {
          return strB === null || strB === undefined ? 0 : -1;
        }

        if (strB === null || strB === undefined) {
          return 1;
        }
        return strA.localeCompare(strB);
      });
    }
    setTableData(sortedData);
    setSorted(!sorted);
  };
  return (
    <div className="flex flex-col w-full h-full my-2 shadow rounded-lg">
      <TableHeader headerData={headerData} showSwitch={hasSwitch} sort={sort} defaultSort={defaultSort} />
      <MultipleColumnTable
        data={tableData}
        tableKeys={tableKeys}
        hasSwitch={hasSwitch}
        linkedKey={linkedKey ? linkedKey : []}
        sorted={sorted}
      />
    </div>
  );
};

export default Table;
