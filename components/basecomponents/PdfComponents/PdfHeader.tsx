import { FunctionComponent } from 'react';

export const PdfMovappLogo: FunctionComponent = () => {
  // NextImage does not work properly in PDFs, we use a regular <img> element instead
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={'https://www.movapp.cz/icons/movapp-logo.png'} width="120px" alt="Movapp logo" />;
};

type PdfHeaderProps = {
  title: string;
};

const PdfHeader: FunctionComponent<PdfHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-primary-blue mt-0 mb-3 flex justify-between">
      <div>{title}</div>
      <PdfMovappLogo />
    </h1>
  );
};

export default PdfHeader;
