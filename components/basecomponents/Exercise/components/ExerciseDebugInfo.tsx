import { useDebug } from '../utils/useDebug';

export const ExerciseDebugInfo = ({ data }: { data: Record<string, unknown> }) => {
  const debug = useDebug();

  if (!debug) return null;

  return (
    <div className="flex flex-col p-2 items-start absolute text-fuchsia-500 text-xs left-0 -top-5 opacity-50">
      {Object.entries(data).map(([key, value]) => (
        <span key={key} className="font-mono">
          {key}: {value}
        </span>
      ))}
    </div>
  );
};
