import React from 'react';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="kiosk-layout bg-gradient-kiosk">{children}</div>;
};

export default KioskLayout;
