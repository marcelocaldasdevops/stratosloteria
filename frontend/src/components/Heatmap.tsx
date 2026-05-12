import { useState, useEffect } from 'react';
import { LOTERIAS } from '../utils/engine';
import { getLatestResult, getHistory } from '../services/api';
import { Activity, RefreshCw, Trophy, Calendar, TrendingUp } from 'lucide-react';

const Heatmap = () => {
  const [modality, setModality] = useState('MEGA_SENA');
  const [latest, setLatest] = useState<any>(null);
  const [frequencies, setFreq] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const activeMod = LOTERIAS[modality];

  useEffect(() => {
    loadData();
  }, [modality, activeMod]);

  const loadData = async () => {
    setLoading(true);
    try {
      const modKey = activeMod.api;
      const [latestData, historyData] = await Promise.all([
        getLatestResult(modKey),
        getHistory(modKey)
      ]);

      setLatest(latestData);

      const last50 = historyData.slice(0, 50);
      const freq: Record<number, number> = {};
      for (let i = 1; i <= activeMod.total; i++) freq[i] = 0;
      
      last50.forEach((draw: any) => {
        if (draw && draw.dezenas) {
          draw.dezenas.forEach((n: string) => {
            const num = parseInt(n);
            if (freq[num] !== undefined) freq[num]++;
          });
        }
      });
      setFreq(freq);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-bg-subtle text-content-tertiary opacity-40';
    if (count >= 10) return 'bg-status-danger-bg text-status-danger-content border-status-danger-border shadow-sm shadow-status-danger-content/20 scale-105'; 
    if (count >= 6) return 'bg-int-primary/20 text-int-primary border-int-primary/30'; 
    return 'bg-status-success-bg/30 text-status-success-content border-status-success-border/30'; 
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-int-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-int-primary uppercase animate-pulse">Sincronizando com Servidores Oficiais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {latest && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
           <div className="md:col-span-2 bg-surface-default border border-border-default rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-int-primary opacity-5">
                 <Trophy size={120} />
              </div>
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-int-primary font-black text-2xl">Concurso #{latest.concurso}</h3>
                    <div className="flex items-center gap-2 text-content-tertiary text-xs font-bold uppercase mt-1">
                       <Calendar size={12} /> {latest.data}
                    </div>
                 </div>
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${latest.acumulou ? 'bg-status-danger-bg text-status-danger-content border border-status-danger-border' : 'bg-status-success-bg text-status-success-content'}`}>
                    {latest.acumulou ? '🔥 Acumulado' : '✅ Premiado'}
                 </span>
              </div>
              <div className="flex gap-3 flex-wrap mb-8">
                 {latest.dezenas && latest.dezenas.map((n: string) => (
                    <div key={n} className="w-14 h-14 bg-int-primary rounded-2xl flex items-center justify-center text-xl font-black text-int-primary-on shadow-lg shadow-int-primary/20">
                       {n}
                    </div>
                 ))}
              </div>
              <div className="pt-6 border-t border-border-default flex flex-col sm:flex-row gap-6">
                 <div>
                    <span className="text-[9px] font-bold text-content-tertiary uppercase block mb-1">Próximo Prêmio</span>
                    <span className="text-xl font-black text-content-primary">
                       {latest.valorEstimadoProximoConcurso ? latest.valorEstimadoProximoConcurso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ --'}
                    </span>
                 </div>
                 <button onClick={loadData} className="flex items-center gap-2 text-[10px] font-bold uppercase text-int-primary hover:bg-int-primary/5 px-4 py-2 rounded-xl border border-int-primary/20 ml-auto transition-all">
                    <RefreshCw size={14} /> Atualizar Agora
                 </button>
              </div>
            section
           </div>

           <div className="bg-surface-default border border-border-default rounded-3xl p-8 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                 <TrendingUp size={18} className="text-int-primary" />
                 <h4 className="font-bold text-sm uppercase tracking-widest">Estatística Rápida</h4>
              </div>
              <div className="space-y-4 flex-1">
                 <div className="bg-bg-subtle p-4 rounded-2xl border border-border-default">
                    <span className="text-[9px] font-bold text-content-tertiary uppercase">Ganhadores (Principal)</span>
                    <div className="text-lg font-black text-content-primary mt-1">
                       {latest.premiacoes && latest.premiacoes[0] ? latest.premiacoes[0].ganhadores : '0'}
                    </div>
                 </div>
                 <div className="bg-bg-subtle p-4 rounded-2xl border border-border-default">
                    <span className="text-[9px] font-bold text-content-tertiary uppercase">Local do Sorteio</span>
                    <div className="text-sm font-bold text-content-secondary mt-1">{latest.localSorteio || 'Oficial'}</div>
                 </div>
              </div>
           </div>
        </section>
      )}

      <section className="bg-surface-default border border-border-default rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-int-primary/10 rounded-xl flex items-center justify-center text-int-primary">
                 <Activity size={20} />
              </div>
              <div>
                 <h3 className="font-bold text-lg">Mapa de Calor (Tendências)</h3>
                 <p className="text-xs text-content-tertiary font-medium uppercase tracking-tighter">Frequência real baseada nos últimos 50 concursos</p>
              </div>
           </div>

           <div className="flex gap-2">
              <select value={modality} onChange={(e) => setModality(e.target.value)} className="bg-bg-subtle border border-border-default rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-int-primary transition-all">
                 {Object.keys(LOTERIAS).map(m => <option key={m} value={m}>{LOTERIAS[m].name}</option>)}
              </select>
           </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-10">
           {Array.from({ length: activeMod.total }, (_, i) => i + 1).map(n => {
              const count = frequencies[n] || 0;
              return (
                 <div 
                   key={n} 
                   className={`aspect-square rounded-xl flex flex-col items-center justify-center border transition-all duration-300 group cursor-help ${getHeatColor(count)}`}
                   title={`${n} apareceu ${count} vezes`}
                 >
                    <span className="text-sm font-black">{n < 10 ? `0${n}` : n}</span>
                    <span className="text-[7px] font-bold opacity-70 group-hover:opacity-100">{count}x</span>
                 </div>
              );
           })}
        </div>

        <div className="flex flex-wrap gap-6 pt-8 border-t border-border-default">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-danger-bg border border-status-danger-border shadow-sm"></div>
              <span className="text-[10px] font-bold text-content-secondary uppercase">Quentes (Frequência Alta)</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-int-primary/20 border border-int-primary/30"></div>
              <span className="text-[10px] font-bold text-content-secondary uppercase">Médias</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-status-success-bg/30 border border-status-success-border/30"></div>
              <span className="text-[10px] font-bold text-content-secondary uppercase">Frias (Raras)</span>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Heatmap;
