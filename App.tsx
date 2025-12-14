import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, X, BookOpen, Cpu, Activity, AlertTriangle, Info, Home, Search } from 'lucide-react';
import HomePage from './pages/Home';
import ModuleLibrary from './pages/ModuleLibrary';
import ModuleDetail from './pages/ModuleDetail';
import DeviceCatalog from './pages/DeviceCatalog';
import DeviceDetail from './pages/DeviceDetail';
import TopologyAtlas from './pages/TopologyAtlas';
import FailureAtlas from './pages/FailureAtlas';
import Glossary from './pages/Glossary';
import About from './pages/About';

const NavItem = ({ to, icon: Icon, label, onClick, className }: { to: string, icon: any, label: string, onClick?: () => void, className?: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
        isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      } ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
};

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState(searchParams.get('search') || '');

  // Sync local state with URL param when it changes (e.g. navigation)
  useEffect(() => {
    setTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTerm(val);
    
    // Logic: If on device catalog, update param. If elsewhere, navigate to device catalog.
    // For a smoother UX, we update URL immediately.
    if (!location.pathname.startsWith('/devices')) {
        navigate(`/devices?search=${encodeURIComponent(val)}`);
    } else {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (val) newParams.set('search', val);
            else newParams.delete('search');
            return newParams;
        }, { replace: true });
    }
  };

  return (
    <div className="relative w-full md:w-64 group">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-accent transition-colors" />
       <input 
         type="text" 
         placeholder="Cihaz ara..." 
         className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-full focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none bg-slate-50 transition-all focus:bg-white placeholder:text-slate-400"
         value={term}
         onChange={handleSearch}
       />
    </div>
  )
}

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30 shadow-sm">
        
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-xl text-primary flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-primary text-white p-1 rounded">
                <Activity className="w-5 h-5 text-accent" />
            </div>
            <span>ElektroLab</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/" icon={Home} label="Ana Sayfa" />
            <NavItem to="/modules" icon={Cpu} label="Modüller" />
            <NavItem to="/devices" icon={BookOpen} label="Cihazlar" />
            <NavItem to="/topologies" icon={Activity} label="Topolojiler" />
            <NavItem to="/failures" icon={AlertTriangle} label="Arızalar" />
            <NavItem to="/glossary" icon={BookOpen} label="Sözlük" />
            <NavItem to="/about" icon={Info} label="Hakkında" />
          </nav>
        </div>

        {/* Search & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-white z-20 overflow-y-auto border-t border-slate-100">
          <div className="p-4 space-y-4">
            <div className="mb-4">
                <SearchBar />
            </div>
            <div className="space-y-1">
                <NavItem to="/" icon={Home} label="Ana Sayfa" onClick={() => setIsMobileMenuOpen(false)} className="w-full" />
                <NavItem to="/modules" icon={Cpu} label="Modüller" onClick={() => setIsMobileMenuOpen(false)} className="w-full" />
                <NavItem to="/devices" icon={BookOpen} label="Cihazlar" onClick={() => setIsMobileMenuOpen(false)} className="w-full" />
                <NavItem to="/topologies" icon={Activity} label="Topolojiler" onClick={() => setIsMobileMenuOpen(false)} className="w-full" />
                <NavItem to="/failures" icon={AlertTriangle} label="Arızalar" onClick={() => setIsMobileMenuOpen(false)} className="w-full" />
                <NavItem to="/glossary" icon={BookOpen} label="Sözlük" onClick={() => setIsMobileMenuOpen(false)} className="w-full" />
                <NavItem to="/about" icon={Info} label="Hakkında" onClick={() => setIsMobileMenuOpen(false)} className="w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Scrollable Area */}
      <main className="flex-1 overflow-y-auto w-full relative scroll-smooth bg-slate-50/50">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/modules" element={<ModuleLibrary />} />
          <Route path="/modules/:moduleId" element={<ModuleDetail />} />
          <Route path="/devices" element={<DeviceCatalog />} />
          <Route path="/devices/:deviceId" element={<DeviceDetail />} />
          <Route path="/topologies" element={<TopologyAtlas />} />
          <Route path="/failures" element={<FailureAtlas />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;