export function blob2B64(blob: Blob) {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.readAsDataURL(blob);
  });
}
