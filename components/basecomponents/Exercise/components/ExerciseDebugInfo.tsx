import { useDebug } from '../utils/useDebug';

export const ExerciseDebugInfo = (data: Record<string, unknown>) => {
  const debug = useDebug();

  if (!debug) return null;

  return (
    <div className="flex flex-col p-2 items-end absolute text-fuchsia-500 text-xs right-0 -top-10 opacity-50">
      {Object.entries(data).map(([key, value]) => `<span className="font-mono">${key}: ${value}</span>`)}
    </div>
  );
};
