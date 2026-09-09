// Runs in <head>, before the first paint and before browser scroll restoration.
export const pageBootstrap = `(() => {
  const page = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    page.dataset.heroIntro = 'pending';
    // Leave the copy readable if client initialization fails.
    window.setTimeout(() => {
      if (page.dataset.heroIntro === 'pending') delete page.dataset.heroIntro;
    }, 5000);
  }
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation && navigation.type === 'reload') {
    history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
    const startAtTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    startAtTop();
    window.addEventListener('pageshow', startAtTop, { once: true });
  }
})();`;
