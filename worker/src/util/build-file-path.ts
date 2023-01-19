export function buildFilePath(
  user: string,
  fileUUID: string,
  fileFriendlyName: string
) {
  return `${user}/v1/${fileUUID}/${fileFriendlyName}`;
}
