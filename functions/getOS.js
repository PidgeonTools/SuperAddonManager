export const OS = {
  WINDOWS: { value: "windows", display: "Windows" },
  LINUX: { value: "linux", display: "Linux" },
  MACOS: { value: "macos", display: "macOS" },
  OTHER: { value: "other", display: "Other" },
};

export const getOS = () => {
  if (navigator.userAgent.indexOf("Win") != -1) return OS.WINDOWS;
  if (navigator.userAgent.indexOf("Mac") != -1) return OS.MACOS;
  if (navigator.userAgent.indexOf("Linux") != -1) return OS.LINUX;
  return OS.OTHER;
};
