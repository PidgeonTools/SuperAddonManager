export const padList = (list) => list.concat([0, 0]).slice(0, 3);

export const padBlenderVersion = (version) => {
  let versionList = version.split(".").map(Number);
  if (versionList[0] < 3 && versionList[1] < 10) versionList[1] *= 10;
  return padList(versionList);
};

export const padAddonVersion = (version) => {
  return padList(version.split(".").map(Number));
};
