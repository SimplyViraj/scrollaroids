let lastCapturedError: unknown;

export const captureLastError = (error: unknown) => {
  lastCapturedError = error;
};

export const consumeLastCapturedError = () => {
  const error = lastCapturedError;
  lastCapturedError = undefined;
  return error;
};