export const config = {
  runtime: 'edge',
};

const cleanScript = `
  <style>
    a[download], a[href*="download"], a[title*="Download"] { display: none !important; }
  </style>
  <script>
    (function() {
      function cleanup() {
        // 1. Remove Download ZIP option
        document.querySelectorAll('a[download], a[href*="download"], a[title*="Download"]').forEach(function(el) {
          el.style.display = 'none';
          if (el.parentNode) el.parentNode.removeChild(el);
        });
        // 2. Remove Live Room and Virtual Care Room options
        document.querySelectorAll('button, a').forEach(function(btn) {
          var text = (btn.textContent || '').trim().toLowerCase();
          if (
            text === 'live room' ||
            text === 'virtual care room' ||
            text.indexOf('virtual care room') !== -1 ||
            text.indexOf('enter virtual care room') !== -1 ||
            text.indexOf('call dr. campbell in care room') !== -1
          ) {
            btn.style.display = 'none';
            if (btn.parentNode) btn.parentNode.removeChild(btn);
          }
        });
      }
      window.addEventListener('DOMContentLoaded', cleanup);
      var observer = new MutationObserver(cleanup);
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        window.addEventListener('DOMContentLoaded', function() {
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }
      setInterval(cleanup, 200);
    })();
  </script>
`;

export default async function handler(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const targetUrl = 'https://your-doctor-nine.vercel.app' + url.search;
    const response = await fetch(targetUrl);
    let html = await response.text();

    html = html
      .replace(/src="\/assets\//g, 'src="https://your-doctor-nine.vercel.app/assets/')
      .replace(/href="\/assets\//g, 'href="https://your-doctor-nine.vercel.app/assets/');

    html = html.replace('</head>', `${cleanScript}</head>`);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=300'
      }
    });
  } catch {
    return new Response('Failed to load portal', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
