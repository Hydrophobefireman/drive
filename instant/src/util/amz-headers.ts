function amzDate(url: string) {
  return new URL(url).searchParams.get("X-Amz-Date");
}

export function amzHeaders(uploadUrl: string) {
  return {
    "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
    "x-amz-date": amzDate(uploadUrl),
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
  };
}
