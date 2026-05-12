import { useState, useEffect } from 'react';
import { LOTERIAS, Engine } from '../utils/engine';
import { saveGame } from '../services/api';
import { Save, Dice5, Settings2, Sparkles, CheckCheck, Filter, Calculator, BarChart2, PieChart, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const FilterLabel = ({ label, tooltip }: { label: string, tooltip: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-1.5 mb-1.5 relative">
      <label className="text-[10px] font-bold text-content-tertiary uppercase tracking-wider">{label}</label>
      <div 
        onMouseEnter={() => setShow(true)} 
        onMouseLeave={() => setShow(false)}
        className="cursor-help text-content-tertiary hover:text-int-primary transition-colors"
      >
        <Info size={12} />
      </div>
      {show && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-48 bg-surface-raised border border-border-default p-2 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[10px] leading-relaxed text-content-secondary font-medium">{tooltip}</p>
        </div>
      )}
    </div>
  );
};

const Generator = () => {
  const [modality, setModality] = useState('MEGA_SENA');
  const [numPerGame, setNumPerGame] = useState(6);
  const qtyGames = 5; 
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [savingAll, setSavingAll] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const [filters, setFilters] = useState({
    sumMin: 0,
    sumMax: 0,
    maxPares: 0,
    maxPrimos: 0,
    maxFib: 0,
    maxSeq: 3,
    minMoldura: 0,
    maxNearPeer: 2
  });

  const activeMod = LOTERIAS[modality];

  useEffect(() => {
    setNumPerGame(activeMod.min);
    let sumMin = Math.floor(activeMod.total * 1.5);
    let sumMax = Math.floor(activeMod.total * 4.5);
    
    if (modality === 'LOTOFACIL') {
      sumMin = 150;
      sumMax = 250;
    } else if (modality === 'LOTOMANIA') {
      sumMin = 2000;
      sumMax = 3000;
    }

    setFilters({
      sumMin,
      sumMax,
      maxPares: Math.ceil(activeMod.min * 0.8),
      maxPrimos: Math.ceil(activeMod.min * 0.6),
      maxFib: Math.ceil(activeMod.min * 0.5),
      maxSeq: modality === 'LOTOFACIL' ? 4 : 3,
      minMoldura: Math.floor(activeMod.min * 0.2),
      maxNearPeer: (modality === 'LOTOFACIL' || modality === 'LOTOMANIA') ? 15 : 2
    });
  }, [modality, activeMod]);

  const combinationsCount = Engine.combinacoes(activeMod.total, activeMod.min);
  const userCombinations = Engine.combinacoes(numPerGame, activeMod.min);

  const generateGames = async () => {
    setLoading(true);
    setGenProgress(0);
    setResults([]);
    
    const newResults: any[] = [];
    const maxAttempts = 50000;
    let attempts = 0;
    
    while (newResults.length < qtyGames && attempts < maxAttempts) {
      for (let i = 0; i < 500; i++) {
        attempts++;
        let ticket = new Set<number>();
        while (ticket.size < activeMod.min) {
          const num = modality === 'LOTOMANIA' 
            ? Math.floor(Math.random() * 100) 
            : Math.floor(Math.random() * activeMod.total) + 1;
          ticket.add(num);
        }
        const sortedNums = Array.from(ticket).sort((a, b) => a - b);
        const analysis = Engine.analisarJogo(sortedNums, activeMod);

        const passSum = (filters.sumMin === 0 || analysis.soma >= filters.sumMin) && (filters.sumMax === 0 || analysis.soma <= filters.sumMax);
        const passPares = analysis.pares <= filters.maxPares;
        const passPrimos = analysis.primos <= filters.maxPrimos;
        const passFib = analysis.fibonacci <= filters.maxFib;
        const passSeq = analysis.maxSeq <= filters.maxSeq;
        const passMoldura = analysis.moldura >= filters.minMoldura;
        const passNearPeer = analysis.nearPeers <= filters.maxNearPeer;

        if (passSum && passPares && passPrimos && passFib && passSeq && passMoldura && passNearPeer) {
          const key = sortedNums.join(',');
          if (!newResults.some(r => r.nums.join(',') === key)) {
            newResults.push({ nums: sortedNums, meta: analysis, saved: false });
          }
        }
        if (newResults.length >= qtyGames) break;
      }
      
      setGenProgress(Math.round((newResults.length / qtyGames) * 100));
      await new Promise(r => setTimeout(r, 0));
      if (attempts >= maxAttempts) break;
    }
    setResults(newResults);
    setLoading(false);
  };

  const handleSave = async (game: any, index: number) => {
    try {
      await saveGame({ modality, numbers: game.nums, meta: game.meta });
      const nr = [...results];
      nr[index].saved = true;
      setResults(nr);
    } catch (e) { console.error(e); }
  };

  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      for (let i = 0; i < results.length; i++) {
        if (!results[i].saved) await saveGame({ modality, numbers: results[i].nums, meta: results[i].meta });
      }
      setResults(results.map(r => ({ ...r, saved: true })));
    } catch (e) { console.error(e); } finally { setSavingAll(false); }
  };

  const chartDataPares = {
    labels: ['Pares', 'Ímpares'],
    datasets: [{
      data: [results.reduce((acc, r) => acc + r.meta.pares, 0), results.reduce((acc, r) => acc + r.meta.impares, 0)],
      backgroundColor: ['#B3C50E', '#4A4A4B'],
      borderWidth: 0
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Settings2 size={18} className="text-int-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Configuração Base</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-content-tertiary uppercase block mb-1.5">Modalidade</label>
              <select value={modality} onChange={(e) => setModality(e.target.value)} className="w-full bg-bg-subtle border border-border-default rounded-xl p-3 text-sm font-medium outline-none focus:border-int-primary transition-all">
                {Object.keys(LOTERIAS).map(m => <option key={m} value={m}>{LOTERIAS[m].name}</option>)}
              </select>
            </div>
            <div className="bg-int-primary/5 p-4 rounded-xl border border-int-primary/20">
               <div className="flex justify-between items-center mb-1 text-int-primary">
                 <span className="text-[10px] font-bold uppercase tracking-widest">Chance Matemática</span>
                 <Calculator size={14} />
               </div>
               <div className="text-xl font-black text-int-primary">
                 1 em {(Number(combinationsCount) / Number(userCombinations)).toLocaleString(undefined, {maximumFractionDigits: 0})}
               </div>
               <p className="text-[8px] text-content-tertiary mt-2 uppercase font-bold">Base: {combinationsCount.toLocaleString()} combinações</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full mb-6 group">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-int-primary" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Filtros Inteligentes</h3>
            </div>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAdvanced && (
            <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FilterLabel label="Soma Mín" tooltip="Soma mínima total das dezenas." />
                  <input type="number" value={filters.sumMin} onChange={(e)=>setFilters({...filters, sumMin: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
                <div>
                  <FilterLabel label="Soma Máx" tooltip="Soma máxima permitida." />
                  <input type="number" value={filters.sumMax} onChange={(e)=>setFilters({...filters, sumMax: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FilterLabel label="Máx Pares" tooltip="Limite de números pares." />
                  <input type="number" value={filters.maxPares} onChange={(e)=>setFilters({...filters, maxPares: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
                <div>
                  <FilterLabel label="Máx Primos" tooltip="Máximo de números primos." />
                  <input type="number" value={filters.maxPrimos} onChange={(e)=>setFilters({...filters, maxPrimos: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FilterLabel label="Máx Fibonacci" tooltip="Limite de números Fibonacci." />
                  <input type="number" value={filters.maxFib} onChange={(e)=>setFilters({...filters, maxFib: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
                <div>
                  <FilterLabel label="Min Moldura" tooltip="Garante dezenas nas bordas do volante." />
                  <input type="number" value={filters.minMoldura} onChange={(e)=>setFilters({...filters, minMoldura: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FilterLabel label="Max Seq." tooltip="Limite de números em sequência." />
                  <input type="number" value={filters.maxSeq} onChange={(e)=>setFilters({...filters, maxSeq: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
                <div>
                  <FilterLabel label="Max Vizinhas" tooltip="Limite de números adjacentes." />
                  <input type="number" value={filters.maxNearPeer} onChange={(e)=>setFilters({...filters, maxNearPeer: parseInt(e.target.value)||0})} className="w-full bg-bg-subtle border border-border-default rounded-lg p-2 text-xs font-bold outline-none focus:border-int-primary" />
                </div>
              </div>

              <button onClick={generateGames} disabled={loading} className="w-full bg-int-primary hover:bg-int-primary-hover text-int-primary-on font-bold rounded-xl py-4 flex flex-col items-center justify-center transition-all shadow-lg shadow-int-primary/20 active:scale-95">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs uppercase">Minerando Matrizes {genProgress}%</span>
                    <div className="w-48 bg-white/20 h-1 rounded-full overflow-hidden">
                       <div className="bg-white h-full transition-all duration-300" style={{ width: `${genProgress}%` }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Dice5 size={18} /> <span>Gerar Jogos Inteligentes</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="lg:col-span-8 space-y-6">
        {results.length > 0 && (
          <div className="flex bg-bg-subtle p-1 rounded-xl w-fit">
            <button onClick={() => setShowStats(false)} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${!showStats ? 'bg-surface-default text-int-primary shadow-sm' : 'text-content-tertiary'}`}>Jogos Gerados</button>
            <button onClick={() => setShowStats(true)} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${showStats ? 'bg-surface-default text-int-primary shadow-sm' : 'text-content-tertiary'}`}>Estatísticas do Lote</button>
          </div>
        )}

        {!showStats ? (
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="bg-surface-default border border-border-default border-dashed rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-bg-subtle rounded-full flex items-center justify-center mb-6 text-content-tertiary animate-bounce">
                  <Sparkles size={40} />
                </div>
                <h4 className="text-content-primary font-extrabold text-xl">Pronto para a Mineração</h4>
                <p className="text-content-secondary text-sm mt-2 max-w-xs leading-relaxed">Nossos algoritmos processam milhares de combinações para entregar apenas as que possuem equilíbrio estatístico real.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-bold text-content-tertiary uppercase tracking-widest flex items-center gap-2">
                    <CheckCheck size={14} className="text-status-success-content" />
                    Resultados de Alta Performance
                  </h3>
                  <button onClick={handleSaveAll} disabled={savingAll || results.every(r=>r.saved)} className="text-[10px] font-black uppercase text-int-primary border border-int-primary/30 px-4 py-2 rounded-xl hover:bg-int-primary/10 transition-all active:scale-95 disabled:opacity-30">
                    {savingAll ? 'Salvando Lote...' : 'Salvar Tudo no Histórico'}
                  </button>
                </div>
                {results.map((res, idx) => (
                  <div key={idx} className="bg-surface-default border border-border-default rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-int-primary/40 transition-all shadow-sm">
                    <div className="flex-1 w-full">
                      <div className="flex gap-2 flex-wrap mb-5">
                        {res.nums.map((n: number, nIdx: number) => (
                          <div 
                            key={n} 
                            className="w-11 h-11 bg-bg-subtle rounded-xl flex items-center justify-center font-extrabold text-sm text-content-primary border border-border-default group-hover:bg-surface-default group-hover:border-int-primary/30 transition-all animate-float"
                            style={{ animationDelay: `${nIdx * 0.1}s` }}
                          >
                            {n < 10 && modality !== 'LOTOMANIA' ? `0${n}` : n}
                            {modality === 'LOTOMANIA' && n < 10 ? `0${n}` : n}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {['SOMA', 'PARES', 'PRIMOS', 'FIB', 'MOLDURA', 'VIZINHAS'].map((tag, i) => (
                          <div key={tag} className="flex flex-col bg-bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border-default/40">
                            <span className="text-[7px] font-black text-content-tertiary uppercase tracking-tighter">{tag}</span>
                            <span className="text-xs font-black text-content-primary">{[res.meta.soma, res.meta.pares, res.meta.primos, res.meta.fibonacci, res.meta.moldura, res.meta.nearPeers][i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleSave(res, idx)} disabled={res.saved} className={`w-full md:w-auto p-4 rounded-xl transition-all shadow-md active:scale-95 ${res.saved ? 'bg-status-success-bg text-status-success-content' : 'bg-bg-subtle hover:bg-int-primary hover:text-int-primary-on text-content-secondary'}`}>
                      {res.saved ? <CheckCheck size={24} /> : <Save size={24} />}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
             <div className="bg-surface-default border border-border-default rounded-3xl p-8 shadow-sm">
                <h4 className="text-xs font-bold uppercase text-content-secondary mb-6 flex items-center gap-2"><PieChart size={14}/> Equilíbrio Par/Ímpar</h4>
                <Pie data={chartDataPares} options={{ plugins: { legend: { position: 'bottom' } } }} />
             </div>
             <div className="bg-surface-default border border-border-default rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <BarChart2 size={32} className="text-int-primary mb-4" />
                <h4 className="text-sm font-bold uppercase">Mais Insights em Breve</h4>
                <p className="text-xs text-content-tertiary mt-2">Estamos expandindo a engine estatística.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Generator;
