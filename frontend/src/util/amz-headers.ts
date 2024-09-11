function amzDate(url: string) {
  return new URL(url).searchParams.get("X-Amz-Date");
}

export function amzHeaders(uploadUrl: string, metaData: object) {
  console.log(metaData);
  return {
    // "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
    // "x-amz-date": amzDate(uploadUrl),
    // "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "x-amz-meta-upload": JSON.stringify(metaData),
  };
}
