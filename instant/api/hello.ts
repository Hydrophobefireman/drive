export const config = {
    runtime: 'edge',
  };
   
export default function handler(request: Request) {
  console.log(request.headers);
  return new Response("hi");
}
