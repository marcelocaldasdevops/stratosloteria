import { useState, useEffect } from 'react';
import { getGames, deleteGame } from '../services/api';
import { LOTERIAS } from '../utils/engine';
import { Trash2, Calendar, LayoutGrid, List, Dice5, History } from 'lucide-react';

const SavedGames = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await getGames();
      setGames(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este jogo?')) return;
    
    setDeletingId(id);
    try {
      await deleteGame(id);
      setGames(games.filter(g => g.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-int-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-content-secondary animate-pulse">Sincronizando com o servidor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border-default pb-4">
        <div>
          <h3 className="text-content-primary font-bold text-lg">Histórico de Apostas</h3>
          <p className="text-content-tertiary text-xs uppercase font-bold tracking-widest">{games.length} registros salvos</p>
        </div>
        
        <div className="flex bg-bg-subtle p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-surface-default text-int-primary shadow-sm' : 'text-content-tertiary hover:text-content-secondary'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-surface-default text-int-primary shadow-sm' : 'text-content-tertiary hover:text-content-secondary'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="bg-surface-default border border-border-default border-dashed rounded-2xl p-20 text-center">
          <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center mb-4 mx-auto text-content-tertiary">
            <History size={32} />
          </div>
          <h4 className="text-content-primary font-bold">Nenhum registro</h4>
          <p className="text-content-secondary text-sm mt-1">Seus jogos salvos aparecerão aqui.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
          {games.map((game) => {
            if (!game) return null;
            const mod = game.modality ? LOTERIAS[game.modality] : null;
            const numbers = Array.isArray(game.numbers) ? game.numbers : [];
            const isDeleting = deletingId === game.id;
            
            return (
              <div key={game.id} className={`bg-surface-default border border-border-default rounded-2xl p-6 hover:border-int-primary/20 transition-all shadow-sm group ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: mod?.color || '#333' }}>
                      <Dice5 size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-bold block">{mod?.name || game.modality || 'Desconhecido'}</span>
                      <div className="flex items-center gap-1.5 text-content-tertiary text-[10px] font-bold uppercase mt-0.5">
                        <Calendar size={12} />
                        {game.created_at ? new Date(game.created_at).toLocaleDateString() : '--/--/----'} • {game.created_at ? new Date(game.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(game.id)}
                    disabled={isDeleting}
                    className="text-content-tertiary hover:text-status-danger-content p-2 hover:bg-status-danger-bg rounded-lg transition-all disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {numbers.map((n: number, idx: number) => (
                    <div key={idx} className="w-10 h-10 bg-bg-subtle border border-border-default rounded-lg flex items-center justify-center font-bold text-sm text-content-primary group-hover:bg-surface-default transition-colors">
                      {n < 10 ? `0${n}` : n}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border-default flex justify-between items-center">
                  <span className="text-[10px] text-content-tertiary font-bold uppercase tracking-wider">Soma Total: {game.meta?.soma || '--'}</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-status-success-content"></div>
                    <div className="w-2 h-2 rounded-full bg-status-success-content/30"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedGames;
