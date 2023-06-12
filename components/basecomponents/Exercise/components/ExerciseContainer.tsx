import React, { forwardRef } from 'react';

export const ExerciseContainer = forwardRef<HTMLDivElement, React.ReactNode>(({ children }, ref) => {
  return (
    <div ref={ref} className="flex flex-col items-center opacity-0 relative">
      <div className="relative px-1.5 pt-6 pb-12 mb-6 border border-slate-300 shadow-lg shadow-slate-100 flex flex-col items-center w-full">
        {children}
      </div>
    </div>
  );
});
