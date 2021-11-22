export const OS = {
  WINDOWS: { value: "windows", display: "Windows" },
  LINUX: { value: "linux", display: "Linux" },
  MACOS: { value: "macos", display: "macOS" },
  OTHER: { value: "other", display: "Other" },
};

export const getOS = () => {
  if (navigator.appVersion.indexOf("Win") != -1) return OS.WINDOWS;
  if (navigator.appVersion.indexOf("Mac") != -1) return OS.MACOS;
  if (navigator.appVersion.indexOf("Linux") != -1) return OS.LINUX;
  return OS.OTHER;
};
