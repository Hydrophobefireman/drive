export function receiveFileUploads({multiple = true} = {}) {
  const input = Object.assign(document.createElement("input"), {
    type: "file",
    multiple,
  });
  return new Promise<File[]>((resolve) => {
    input.addEventListener("change", () => {
      resolve([...input.files]);
    });
    input.click();
  });
}
