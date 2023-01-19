export function AudioRenderer({url}: {url: string}) {
  return <audio src={url || null} controls />;
}
