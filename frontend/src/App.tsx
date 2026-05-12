import { useState, useEffect } from 'react';
import { Dice5, History, BarChart3, ShieldCheck, Moon, Sun, Layers, Activity } from 'lucide-react';
import Generator from './components/Generator';
import SavedGames from './components/SavedGames';
import Stats from './components/Stats';
import Safety from './components/Safety';
import Wheels from './components/Wheels';
import Heatmap from './components/Heatmap';

function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderTab = () => {
    switch (activeTab) {
      case 'generator': return <Generator />;
      case 'wheels': return <Wheels />;
      case 'heatmap': return <Heatmap />;
      case 'history': return <SavedGames />;
      case 'stats': return <Stats />;
      case 'safety': return <Safety />;
      default: return <Generator />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-content-primary transition-colors duration-200">
      <header className="bg-surface-default border-b border-border-default px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-int-primary rounded-md flex items-center justify-center">
            <Dice5 size={20} className="text-int-primary-on" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">
            Stratos<span className="text-int-primary">Loteria</span>
          </h1>
        </div>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-bg-subtle transition-colors text-content-secondary"
          aria-label="Alternar tema"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <nav className="flex gap-1 bg-bg-subtle p-1 rounded-xl mb-8 w-fit overflow-x-auto custom-scrollbar">
          {[
            { id: 'generator', label: 'Gerador', icon: Dice5 },
            { id: 'wheels', label: 'Fechamento', icon: Layers },
            { id: 'heatmap', label: 'Tendências', icon: Activity },
            { id: 'history', label: 'Histórico', icon: History },
            { id: 'stats', label: 'Análise', icon: BarChart3 },
            { id: 'safety', label: 'Consciente', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-surface-default text-int-primary shadow-sm' 
                  : 'text-content-tertiary hover:text-content-primary hover:bg-bg-muted'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderTab()}
        </main>
      </div>

      <footer className="py-12 px-6 border-t border-border-default mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-content-tertiary text-sm">
          <p>© 2026 Stratos Loteria Intelligence. Conectado a Servidores Oficiais.</p>
          <div className="flex gap-6 font-bold uppercase text-[10px]">
             <span className="text-status-success-content">API Real-Time Enabled</span>
             <span className="text-int-primary">Predictive Heatmaps</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
