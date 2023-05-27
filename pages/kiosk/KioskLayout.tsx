import React from 'react';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-gradient-to-r from-[#FDF6D2] to-[#99BDE4] min-h-screen py-[57px]">{children}</div>;
};

export default KioskLayout;
