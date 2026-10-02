// Sites uses the root. The static build supplies the GitHub Pages base directory.
const base = typeof __PORTFOLIO_BASE__ === 'string' ? __PORTFOLIO_BASE__ : '/';
export function publicAsset(path) {
  return base.replace(/\/?$/, '/') + path.replace(/^\/+/, '');
}
