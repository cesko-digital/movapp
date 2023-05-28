import BetaIcon from 'public/icons/beta.svg';

interface AppContainerProps {
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

export const AppContainer: React.FunctionComponent<AppContainerProps> = ({ children, headerContent }) => {
  return (
    <div className="w-full sm:w-10/12 max-w-2xl bg-white">
      <div className="flex items-center justify-between mt-3 mb-5 pr-5">
        <BetaIcon />
        <div>{headerContent}</div>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
};
