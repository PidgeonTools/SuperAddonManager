export const OS = {
  WINDOWS: {
    value: "windows",
    displayID: "os.windows",
    englishName: "Windows",
  },
  LINUX: { value: "linux", displayID: "os.linux", englishName: "Linux" },
  MACOS: { value: "macos", displayID: "os.macos", englishName: "macOS" },
  OTHER: { value: "other", displayID: "os.other", englishName: "Other" },
};

export const getOS = () => {
  if (navigator.userAgent.indexOf("Win") != -1) return OS.WINDOWS;
  if (navigator.userAgent.indexOf("Mac") != -1) return OS.MACOS;
  if (navigator.userAgent.indexOf("Linux") != -1) return OS.LINUX;
  return OS.OTHER;
};

export const getOSByID = (id) => {
  if (id == OS.WINDOWS.displayID) return OS.WINDOWS;
  if (id == OS.MACOS.displayID) return OS.MACOS;
  if (id == OS.LINUX.displayID) return OS.LINUX;
  return OS.OTHER;
};
