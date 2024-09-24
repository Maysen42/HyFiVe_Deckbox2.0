interface ColumnWrapperProps {
  children: any;
  column_key: string;
}

/**
 * ColumnWrapper component wraps a set of child components within a flex container for column display.
 * @param {ColumnWrapperProps} props - The properties for the ColumnWrapper component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the column wrapper.
 * @param {string} props.column_key - The key to uniquely identify the column.
 * @returns {JSX.Element} - The JSX element representing the ColumnWrapper component.
 */
const ColumnWrapper = ({ children, column_key }: ColumnWrapperProps) => {
  return (
    <div className="flex flex-row odd:bg-danube-200 even:bg-danube-100 last:rounded-b-lg " key={column_key}>
      {children}
    </div>
  );
};

export default ColumnWrapper;
