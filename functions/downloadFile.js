export const downloadJSONFile = (document, downloadData, filename) => {
  // Create a new file with the contents of the current data.
  const file = new Blob([JSON.stringify(downloadData)], {
    type: "application/json",
  });

  // Create and click a temporary link to download the file.
  const el = document.createElement("a");
  el.href = URL.createObjectURL(file);
  el.download = filename;
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};
