/**
 * Returns object's property at path provided 'path.to.property'
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectProperty = (obj: Record<string, any>, path: string): any => {
  let current = { ...obj };
  path.split('.').forEach((p) => {
    current = current[p];
  });
  return current;
};
