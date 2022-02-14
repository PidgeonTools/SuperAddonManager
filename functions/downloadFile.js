export const downloadJSONFile = (document, downloadData, filename) => {
  let indent = 2;
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("minify_endpoint_data") === "true"
  ) {
    indent = 0;
  }
  // Create a new file with the contents of the current data.
  const file = new Blob([JSON.stringify(downloadData, null, indent)], {
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
