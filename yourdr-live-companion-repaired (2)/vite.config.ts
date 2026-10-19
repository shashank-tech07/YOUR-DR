import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function vercelPortalPlugin(): Plugin {
  const handler = async (req: any, res: any, next: any) => {
    const url = req.url || '';
    if (url === '/home-portal' || url.startsWith('/home-portal?')) {
      try {
        const response = await fetch('https://your-doctor-nine.vercel.app/');
        let html = await response.text();
        html = html
          .replace(/src="\/assets\//g, 'src="https://your-doctor-nine.vercel.app/assets/')
          .replace(/href="\/assets\//g, 'href="https://your-doctor-nine.vercel.app/assets/');

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

        html = html.replace('</head>', `${cleanScript}</head>`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
        return;
      } catch (err) {
        res.statusCode = 500;
        res.end('Failed to load portal');
        return;
      }
    }
    next();
  };

  return {
    name: 'vercel-portal-cleaner',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), vercelPortalPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
