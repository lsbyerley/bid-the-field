module.exports = {
  async redirects() {
    // https://gist.github.com/naotone/014038835854374917a73701ef195e3b
    const redirects = [];
    if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
      redirects.push({
        source: '/((?!maintenance|_next).*)',
        destination: '/maintenance',
        permanent: false,
      });
      redirects.push({
        source: '/(maintenance/.*)',
        destination: '/maintenance',
        permanent: false,
      });
    }
    return redirects;
  },
};
