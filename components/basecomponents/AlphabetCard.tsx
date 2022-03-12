import React from 'react';
import PlayIcon from '../../public/icons/play.svg';

// <div className="h-full border-1"></div>

export const AlphabetCard = (): JSX.Element => {
  return (
    <div className=" grid grid-rows-[66%_34%] w-[286px] h-[416px] rounded-xl">
      <div className="bg-white ">
        <div className="grid grid-cols-[50%_50%] grid-flow-col py-4">
          <p className="font-sans font-light px-4">Cesky</p>
          <p className="font-sans font-light px-4">Укр</p>
        </div>
        <div className="grid grid-cols-[50%_1px_50%] grid-flow-col py-4">
          <div className="px-4">
            <span className="text-8xl font-light">B</span>
            <span className="text-7xl font-light">b</span>
            <div className="flex justify-between py-5 items-center">
              <PlayIcon className="w-14 stroke-red-500" />
              <span className="pr-4 text-[20px]  text-[#676767]  font-sans-pro">[b]</span>
            </div>
          </div>
          <div className="h-full border-1"></div>
          <div className="px-4">
            <span className="text-8xl font-light">Б</span>
            <span className="text-7xl font-light">б</span>
            <div className="flex justify-between py-5 items-center">
              <PlayIcon className="w-14 stroke-red-500" />
              <span className="pr-4 text-[20px] text-[#676767]  text-sans">[б]</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[50%_50] grid-flow-col bg-primary-yellow">
        <div className="p-3 px-5">
          <p className="font-sans">Priklady</p>
          <div className="py-3">
            <p className="font-light">brambora</p>
            <p className="font-light">Babicka</p>
            <p className="font-light">bila</p>
          </div>
        </div>
        <div className="p-3 px-4">
          <p className="font-sans">Приклади</p>
          <div className="py-3">
            <div className="flex items-center">
              <p className="font-light ">brambora</p>
              <PlayIcon className="w-5 stroke-red-500 ml-1" />
            </div>
            <div className="flex items-center">
              <p className="font-light">Babicka</p>
              <PlayIcon className="w-5 stroke-red-500 ml-1" />
            </div>
            <div className="flex items-center">
              <p className="font-light">bila</p>
              <PlayIcon className="w-5 stroke-red-500 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
