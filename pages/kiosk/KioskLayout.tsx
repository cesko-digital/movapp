import React from 'react';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-gradient-to-r from-[#FDF6D2] to-[#99BDE4] h-screen py-[57px] overflow-hidden">{children}</div>;
};

export default KioskLayout;
