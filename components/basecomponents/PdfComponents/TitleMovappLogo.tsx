import { FunctionComponent } from 'react';

const TitleMovappLogo: FunctionComponent = () => {
  // NextImage does not work properly in PDFs, we use a regular <img> element instead
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={'https://www.movapp.cz/icons/movapp-logo.png'} width="120px" className="mr-3 inline-block" alt="Movapp logo" />;
};

export default TitleMovappLogo;
