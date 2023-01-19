export function ImageRenderer({url}: {url: string}) {
  return <img src={url || null} alt="Preview" />;
}
