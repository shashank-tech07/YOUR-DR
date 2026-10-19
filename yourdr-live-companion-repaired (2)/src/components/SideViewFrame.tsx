import React, { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  RotateCw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  Layout,
  ShieldCheck,
  Globe,
  Radio,
  ArrowRight,
  ChevronDown,
  X
} from 'lucide-react';
import { ViewportMode } from '../types.ts';

interface SideViewFrameProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onCloseSideView?: () => void;
}

export const SideViewFrame: React.FC<SideViewFrameProps> = ({
  currentUrl,
  onUrlChange,
  isExpanded = false,
  onToggleExpand,
  onCloseSideView,
}) => {
  const [viewport, setViewport] = useState<ViewportMode>('responsive');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [pingMs, setPingMs] = useState<number>(118);
  const [lastReloadKey, setLastReloadKey] = useState<number>(0);
  const [showQuickLinks, setShowQuickLinks] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (currentUrl === '/home-portal' || currentUrl.startsWith('/home-portal')) {
      setInputUrl(currentUrl.replace('/home-portal', 'https://your-doctor-nine.vercel.app'));
    } else {
      setInputUrl(currentUrl);
    }
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 7000);
    return () => clearTimeout(timeout);
  }, [currentUrl, lastReloadKey]);

  // Simulate subtle live ping monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setPingMs(Math.floor(95 + Math.random() * 45));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleReload = () => {
    setIsLoading(true);
    setLastReloadKey(prev => prev + 1);
  };

  const handleCopy = () => {
    const textToCopy = currentUrl === '/home-portal' || currentUrl.startsWith('/home-portal')
      ? currentUrl.replace('/home-portal', 'https://your-doctor-nine.vercel.app')
      : currentUrl;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    const externalUrl = currentUrl === '/home-portal' || currentUrl.startsWith('/home-portal')
      ? currentUrl.replace('/home-portal', 'https://your-doctor-nine.vercel.app')
      : currentUrl;
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target) return;
    if (target.includes('your-doctor-nine.vercel.app')) {
      const hash = target.split('your-doctor-nine.vercel.app')[1] || '';
      target = `/home-portal${hash}`;
    } else if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.startsWith('/')) {
        target = `/home-portal${target}`;
      } else {
        target = `https://${target}`;
      }
    }
    onUrlChange(target);
    setIsLoading(true);
  };

  const quickRoutes = [
    { label: 'Home Page', path: '/home-portal' },
    { label: 'Doctor Directory', path: '/home-portal#doctors' },
    { label: 'Care Intelligence', path: '/home-portal#features' },
    { label: 'Instant Booking', path: '/home-portal#booking' },
    { label: 'How It Works', path: '/home-portal#how-it-works' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 border-l border-slate-700/60 shadow-2xl overflow-hidden select-none">
      {/* Top Header / Browser Control Bar */}
      <div className="bg-slate-950/90 backdrop-blur border-b border-slate-800 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 z-20">
        {/* Project Branding & Live Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-2.5" />
            <span>Connected</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{pingMs}ms</span>
          </div>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/70 text-slate-300">
          <button
            onClick={() => setViewport('responsive')}
            title="Fit to side pane"
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${
              viewport === 'responsive'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'hover:bg-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Auto Fit</span>
          </button>

          <button
            onClick={() => setViewport('mobile')}
            title="Mobile (390px)"
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${
              viewport === 'mobile'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'hover:bg-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Mobile</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            title="Tablet (768px)"
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${
              viewport === 'tablet'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'hover:bg-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Tablet</span>
          </button>

          <button
            onClick={() => setViewport('desktop')}
            title="Desktop scale (1024px)"
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${
              viewport === 'desktop'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'hover:bg-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Desktop</span>
          </button>
        </div>

        {/* Action icons: reload, copy, external open, full view */}
        <div className="flex items-center gap-1 text-slate-300">
          {/* Zoom options */}
          <select
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            aria-label="Viewport zoom level"
            className="bg-slate-800 text-[11px] text-slate-300 border border-slate-700 rounded px-1.5 py-1 focus:outline-none focus:border-teal-500"
          >
            <option value={80}>80%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
            <option value={110}>110%</option>
          </select>

          <button
            onClick={handleReload}
            title="Reload side frame"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            title="Copy URL"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleOpenExternal}
            title="Open live site in new tab"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              title={isExpanded ? 'Restore side view' : 'Maximize side view'}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {onCloseSideView && (
            <button
              onClick={onCloseSideView}
              title="Close side view"
              className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* URL Address Bar with Quick Jump Popover */}
      <div className="bg-slate-900 border-b border-slate-800 px-3.5 py-2 flex items-center gap-2">
        <form onSubmit={handleSubmitUrl} className="flex-1 flex items-center relative">
          <div className="absolute left-2.5 flex items-center gap-1 text-slate-400 pointer-events-none">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[10px] text-teal-400/80 font-mono">SSL</span>
          </div>

          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://your-doctor-nine.vercel.app/"
            className="w-full bg-slate-950/80 text-slate-200 text-xs font-mono pl-14 pr-24 py-1.5 rounded-lg border border-slate-700/80 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/30 transition shadow-inner"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowQuickLinks(!showQuickLinks)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition"
            >
              <span>Pages</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              type="submit"
              className="text-[11px] px-2 py-0.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium flex items-center gap-0.5 transition shadow-sm"
            >
              Go
            </button>
          </div>

          {/* Quick links dropdown */}
          {showQuickLinks && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 p-1.5 space-y-1">
              <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Quick Navigation Targets
              </div>
              {quickRoutes.map((route, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInputUrl(route.path);
                    onUrlChange(route.path);
                    setShowQuickLinks(false);
                    setIsLoading(true);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded flex items-center justify-between group transition"
                >
                  <span className="font-medium text-slate-200 group-hover:text-teal-300">{route.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-teal-400 transition transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Main Viewport Container */}
      <div className="flex-1 bg-slate-950 relative overflow-auto flex items-center justify-center p-0 md:p-3">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-5 h-5 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-200">Loading YourDr. Vercel Portal</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{currentUrl}</p>
            </div>
          </div>
        )}

        {/* Viewport frame renderings */}
        {viewport === 'mobile' ? (
          /* Mobile frame (iPhone 15 Pro styled) */
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-[390px] h-[780px] max-h-full rounded-[44px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-600/80 relative flex flex-col my-auto transition-all duration-300"
          >
            {/* Dynamic Island / Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20 flex items-center justify-end pr-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
            </div>

            {/* Inner screen */}
            <div className="w-full h-full rounded-[34px] overflow-hidden bg-white relative">
              <iframe
                key={`mobile-${lastReloadKey}`}
                ref={iframeRef}
                src={currentUrl}
                title="YourDr. Live App Mobile View"
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
              />
            </div>

            {/* Mobile Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/50 rounded-full" />
          </div>
        ) : viewport === 'tablet' ? (
          /* Tablet frame (iPad style) */
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-[740px] h-[880px] max-w-full max-h-full rounded-[30px] p-3 bg-slate-800 shadow-2xl border-4 border-slate-700 relative flex flex-col my-auto transition-all duration-300"
          >
            {/* Front Camera dot */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900 border border-slate-600 z-20" />

            <div className="w-full h-full rounded-[20px] overflow-hidden bg-white relative">
              <iframe
                key={`tablet-${lastReloadKey}`}
                ref={iframeRef}
                src={currentUrl}
                title="YourDr. Live App Tablet View"
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
              />
            </div>
          </div>
        ) : viewport === 'desktop' ? (
          /* Desktop Frame */
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-[1080px] h-[780px] max-w-full max-h-full rounded-xl overflow-hidden bg-white shadow-2xl border border-slate-700/80 relative flex flex-col my-auto transition-all duration-300"
          >
            <iframe
              key={`desktop-${lastReloadKey}`}
              ref={iframeRef}
              src={currentUrl}
              title="YourDr. Live App Desktop View"
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
            />
          </div>
        ) : (
          /* Full Auto-Fit Responsive View */
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full h-full bg-white relative overflow-hidden"
          >
            <iframe
              key={`responsive-${lastReloadKey}`}
              ref={iframeRef}
              src={currentUrl}
              title="YourDr. Live App Side View"
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
            />
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium text-slate-300">Vercel Production</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 font-mono">Region: sin1 / Global Edge</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenExternal}
            className="hover:text-teal-400 transition flex items-center gap-1 font-medium"
          >
            <span>Open in popup</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
