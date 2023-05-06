export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return Response.json({
    xid: req.headers.get('x-vercel-id') || 'xid',
    ip: req.headers.get('x-forwarded-for') || 'ip',
    lat: req.headers.get('x-vercel-ip-latitude') || 'lat',
    long: req.headers.get('x-vercel-ip-longitude') || 'long',
    city: req.headers.get('x-vercel-ip-city') || '',
    region: req.headers.get('x-vercel-ip-country-region') || '',
    country: req.headers.get('x-vercel-ip-country') || 'country',
  });
}
