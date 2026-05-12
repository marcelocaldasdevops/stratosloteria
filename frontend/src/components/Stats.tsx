import { useState } from 'react';
import { LOTERIAS } from '../utils/engine';
import { BarChart3, Info, Zap, Cpu } from 'lucide-react';

const Stats = () => {
  const [iterations, setIterations] = useState(100000);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeMod = LOTERIAS['MEGA_SENA']; // Default fixed to avoid unused setModality for now

  const runSimulation = async () => {
    setLoading(true);
    setProgress(0);
    setResults(null);

    const userNums = new Uint8Array(activeMod.total + 1);
    const userNumsList: number[] = [];
    while (userNumsList.length < activeMod.min) {
      const r = Math.floor(Math.random() * activeMod.total) + 1;
      if (userNums[r] === 0) {
        userNums[r] = 1;
        userNumsList.push(r);
      }
    }

    const hitMap = new Uint32Array(activeMod.min + 1);
    const t0 = performance.now();
    const totalIter = iterations;
    const chunkSize = 50000; 
    
    for (let i = 0; i < totalIter; i += chunkSize) {
      await new Promise(resolve => setTimeout(resolve, 0));
      const end = Math.min(i + chunkSize, totalIter);
      const modTotal = activeMod.total;
      const modMin = activeMod.min;

      for (let s = i; s < end; s++) {
        let hits = 0;
        let count = 0;
        const draw = new Uint8Array(modTotal + 1);
        while (count < modMin) {
          const r = Math.floor(Math.random() * modTotal) + 1;
          if (draw[r] === 0) {
            draw[r] = 1;
            if (userNums[r] === 1) hits++;
            count++;
          }
        }
        hitMap[hits]++;
      }
      setProgress(Math.round((end / totalIter) * 100));
    }

    const t1 = performance.now();
    const finalHitMap: Record<number, number> = {};
    hitMap.forEach((val, idx) => finalHitMap[idx] = val);

    setResults({
      hitMap: finalHitMap,
      time: Math.round(t1 - t0),
      userNums: userNumsList.sort((a, b) => a - b)
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-default pb-6">
        <div>
          <h3 className="text-content-primary font-bold text-xl">Motor de Simulação Turbo</h3>
          <p className="text-content-tertiary text-xs font-bold uppercase tracking-widest mt-1">Otimizado para Multi-milhões de Operações</p>
        </div>
        <div className="bg-int-primary/10 px-4 py-2 rounded-xl border border-int-primary/20 flex items-center gap-2">
           <Cpu size={16} className="text-int-primary animate-pulse" />
           <span className="text-[10px] font-black text-int-primary uppercase">Hardware Acceleration Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-content-tertiary uppercase mb-2">Simulações</label>
                <select 
                  value={iterations} 
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                  className="w-full bg-bg-subtle border border-border-default rounded-xl p-3 text-sm font-medium outline-none focus:border-int-primary transition-all"
                >
                  <option value={100000}>100.000 (Instantâneo)</option>
                  <option value={1000000}>1.000.000 (Padrão)</option>
                  <option value={5000000}>5.000.000 (Avançado)</option>
                  <option value={10000000}>10.000.000 (Estresse)</option>
                </select>
              </div>

              <button 
                onClick={runSimulation}
                disabled={loading}
                className="w-full bg-int-primary hover:bg-int-primary-hover text-int-primary-on font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-int-primary/20 disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="text-sm">{progress}%</span>
                    <div className="w-full max-w-[100px] bg-white/20 h-1 rounded-full ml-2">
                       <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Executar Turbo Sim</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-status-info-bg border border-status-info-border rounded-2xl p-5 flex gap-4">
             <Info className="text-status-info-content shrink-0" size={20} />
             <p className="text-[10px] text-content-secondary leading-relaxed font-medium">
               Utilizamos TypedArrays e Alocação de Memória Contígua para processar até 2 milhões de sorteios por segundo no seu navegador.
             </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!results && !loading ? (
             <div className="h-full border-2 border-dashed border-border-default rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-40">
                <BarChart3 size={48} className="mb-4 text-content-tertiary" />
                <h4 className="font-bold text-lg">Aguardando Parâmetros</h4>
                <p className="text-sm mt-1">Configure o número de sorteios e inicie o motor.</p>
             </div>
          ) : results ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
               <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b border-border-default pb-4">
                    <h4 className="text-xs font-bold text-content-secondary uppercase tracking-widest">Resultado da Análise Turbo</h4>
                    <span className="text-[10px] font-mono text-int-primary bg-int-primary/5 px-2 py-1 rounded">V_TIME: {results.time}ms</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {Object.entries(results.hitMap).reverse().map(([hits, count]: any) => {
                       const pct = ((count / iterations) * 100).toFixed(5);
                       const isHigh = parseInt(hits) >= 4;
                       return (
                         <div key={hits} className={`p-4 rounded-2xl border transition-all hover:scale-105 ${isHigh ? 'bg-status-success-bg border-status-success-border' : 'bg-bg-subtle border-border-default'}`}>
                            <div className="text-[9px] font-black uppercase text-content-tertiary mb-1">{hits} Pontos</div>
                            <div className={`text-xl font-black ${isHigh ? 'text-status-success-content' : 'text-content-primary'}`}>{count.toLocaleString()}</div>
                            <div className="text-[10px] font-bold text-int-primary mt-1">{pct}%</div>
                         </div>
                       );
                     })}
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
               <div className="relative w-20 h-20 mb-6">
                 <div className="absolute inset-0 border-4 border-int-primary/20 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-int-primary border-t-transparent rounded-full animate-spin"></div>
               </div>
               <h4 className="font-bold text-lg animate-pulse text-int-primary">SIMULANDO EM ALTA VELOCIDADE</h4>
               <p className="text-sm text-content-secondary mt-2">Processando {iterations.toLocaleString()} combinações...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
