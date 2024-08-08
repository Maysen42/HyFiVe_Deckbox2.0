interface HeadlineProps {
  text: string;
  style?: string;
}
/**
 * Headline component for rendering a heading in the UI.
 * @param {HeadlineProps} props - The properties for the Headline component.
 * @param {string} props.text - The text content of the headline.
 * @param {string} props.style - Additional CSS style for styling purposes.
 * @returns {JSX.Element} - The JSX element representing the Headline component.
 */
const Headline = ({ text, style }: HeadlineProps) => {
  return <h1 className={"text-danube-800 mb font-semibold text-md " + style}>{text}</h1>;
};

export default Headline;
