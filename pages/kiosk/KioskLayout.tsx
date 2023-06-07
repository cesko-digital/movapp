import React from 'react';
import Head from 'next/head';

const KioskLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div className="bg-gradient-to-r from-[#FDF6D2] to-[#99BDE4] h-screen py-[57px] overflow-hidden">{children}</div>;
    </>
  );
};

export default KioskLayout;
