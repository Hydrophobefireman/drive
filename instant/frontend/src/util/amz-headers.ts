function amzDate(url: string) {
  return new URL(url).searchParams.get("X-Amz-Date");
}

export function amzHeaders(uploadUrl: string) {
  return {};
}
