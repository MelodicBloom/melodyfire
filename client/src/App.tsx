import { Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useCursorGlow } from './hooks/useCursorGlow';

// Pages — lazy loaded for code splitting
// Named exports (files we created in this build)
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const ReversePromptPage = lazy(() => import('./pages/ReversePromptPage'));

// Default exports (pre-existing pages)
const GenerativeArtPage = lazy(() => import('./pages/GenerativeArtPage'));
const AIToolsPage = lazy(() => import('./pages/AIToolsPage'));
const RegenerativePage = lazy(() => import('./pages/RegenerativePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ChildrensArtPage = lazy(() => import('./pages/ChildrensArtPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mandala-loader" />
    </div>
  );
}

function AppInner() {
  // Global side-effects
  useScrollReveal();
  useCursorGlow();

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Nav />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/work" component={PortfolioPage} />
            <Route path="/art" component={GenerativeArtPage} />
            <Route path="/ai-tools" component={AIToolsPage} />
            <Route path="/regenerative" component={RegenerativePage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/children-art" component={ChildrensArtPage} />
            <Route path="/reverse-prompt" component={ReversePromptPage} />
            <Route path="/blog" component={BlogPage} />
            <Route path="/shop" component={ShopPage} />
            {/* 404 fallback */}
            <Route>
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-6 pt-16">
                <div className="font-display text-8xl font-black gradient-text-fire">404</div>
                <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-md">
                  This page doesn't exist — but the mandala keeps turning.
                </p>
                <a href="/#/" className="px-6 py-3 rounded-xl text-white font-semibold"
                  style={{ background: 'var(--gradient-fire)' }}>
                  Return Home
                </a>
              </div>
            </Route>
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <AppInner />
    </Router>
  );
}
