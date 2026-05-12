import { useState, useEffect } from 'react';
import { LOTERIAS } from '../utils/engine';
import { MATRICES, type MatrixTemplate } from '../utils/matrices';
import { saveGame } from '../services/api';
import { Layers, MousePointer2, Save, Info, Sparkles } from 'lucide-react';

const Wheels = () => {
  const [modality, setModality] = useState('MEGA_SENA');
  const [selectedMatrix, setSelectedMatrix] = useState<MatrixTemplate | null>(null);
  const [chosenNums, setChosenNums] = useState<number[]>([]);
  const [generatedGames, setGeneratedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const activeMod = LOTERIAS[modality];
  const availableMatrices = MATRICES[modality] || [];

  useEffect(() => {
    setSelectedMatrix(null);
    setChosenNums([]);
    setGeneratedGames([]);
  }, [modality]);

  const toggleNumber = (num: number) => {
    if (!selectedMatrix) return;
    if (chosenNums.includes(num)) {
      setChosenNums(chosenNums.filter(n => n !== num));
    } else {
      if (chosenNums.length < selectedMatrix.v) {
        setChosenNums([...chosenNums, num].sort((a, b) => a - b));
      }
    }
  };

  const generateWheels = () => {
    if (!selectedMatrix || chosenNums.length !== selectedMatrix.v) return;
    
    setLoading(true);
    setTimeout(() => {
      const results = selectedMatrix.tickets.map(indices => {
        const nums = indices.map(idx => chosenNums[idx]).sort((a, b) => a - b);
        const soma = nums.reduce((a, b) => a + b, 0);
        return { nums, meta: { soma }, saved: false };
      });
      setGeneratedGames(results);
      setLoading(false);
    }, 500);
  };

  const handleSaveAll = async () => {
    try {
      for (const game of generatedGames) {
        if (!game.saved) {
          await saveGame({ modality, numbers: game.nums, meta: game.meta });
        }
      }
      setGeneratedGames(generatedGames.map(g => ({ ...g, saved: true })));
      alert('Fechamento salvo com sucesso!');
    } catch (e) {
      alert('Erro ao salvar fechamento.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
      {/* Configuration Section */}
      <section className="lg:col-span-4 space-y-6">
        <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-int-primary">
            <Layers size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wider text-content-primary">Configurar Matriz</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-content-tertiary uppercase block mb-1.5">Modalidade</label>
              <select value={modality} onChange={(e) => setModality(e.target.value)} className="w-full bg-bg-subtle border border-border-default rounded-xl p-3 text-sm font-medium outline-none focus:border-int-primary">
                {Object.keys(LOTERIAS).map(m => <option key={m} value={m}>{LOTERIAS[m].name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-content-tertiary uppercase block mb-1.5">Selecionar Fechamento</label>
              <div className="space-y-2">
                {availableMatrices.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => { setSelectedMatrix(m); setChosenNums([]); setGeneratedGames([]); }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedMatrix?.id === m.id ? 'bg-int-primary/10 border-int-primary text-int-primary' : 'bg-bg-subtle border-border-default text-content-secondary hover:border-border-strong'}`}
                  >
                    <div className="font-bold text-xs">{m.name}</div>
                    <div className="text-[9px] opacity-70 mt-1">{m.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedMatrix && (
              <div className="bg-status-info-bg/50 border border-status-info-border p-4 rounded-xl">
                 <div className="flex gap-2 text-status-info-content mb-2">
                    <Info size={14} />
                    <span className="text-[10px] font-bold uppercase">Condição de Vitória</span>
                 </div>
                 <p className="text-[10px] text-content-secondary leading-relaxed">
                   Se você acertar <strong>{selectedMatrix.m}</strong> dezenas entre as <strong>{selectedMatrix.v}</strong> escolhidas, o sistema garante matematicamente pelo menos um bilhete com <strong>{selectedMatrix.t}</strong> pontos.
                 </p>
              </div>
            )}
          </div>
        </div>

        {selectedMatrix && (
          <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-content-tertiary uppercase">Números Selecionados</span>
              <span className={`text-xs font-black ${chosenNums.length === selectedMatrix.v ? 'text-status-success-content' : 'text-int-primary'}`}>
                {chosenNums.length} / {selectedMatrix.v}
              </span>
            </div>
            <button 
              onClick={generateWheels}
              disabled={chosenNums.length !== selectedMatrix.v || loading}
              className="w-full bg-int-primary hover:bg-int-primary-hover text-int-primary-on font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-int-primary/20 transition-all disabled:opacity-30"
            >
              <Sparkles size={18} />
              {loading ? 'Processando Matriz...' : 'Gerar Fechamento'}
            </button>
          </div>
        )}
      </section>

      {/* Grid Selection Area */}
      <main className="lg:col-span-8 space-y-6">
        {selectedMatrix ? (
          <div className="bg-surface-default border border-border-default rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
               <MousePointer2 size={18} className="text-int-primary" />
               <h3 className="font-bold text-lg">Escolha suas {selectedMatrix.v} dezenas preferidas</h3>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-8">
              {Array.from({ length: activeMod.total }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => toggleNumber(n)}
                  className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all border ${
                    chosenNums.includes(n) 
                    ? 'bg-int-primary border-int-primary text-int-primary-on shadow-lg scale-110' 
                    : 'bg-bg-subtle border-border-default text-content-primary hover:border-int-primary/50'
                  }`}
                >
                  {n < 10 ? `0${n}` : n}
                </button>
              ))}
            </div>

            {generatedGames.length > 0 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="border-t border-border-default pt-8 flex justify-between items-center">
                   <h4 className="text-xs font-bold uppercase tracking-widest text-content-tertiary">Matriz Processada ({generatedGames.length} Jogos)</h4>
                   <button onClick={handleSaveAll} className="flex items-center gap-2 text-[10px] font-bold text-int-primary border border-int-primary/30 px-3 py-1.5 rounded-lg hover:bg-int-primary/5 transition-all">
                      <Save size={14} /> Salvar Tudo no Banco
                   </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                   {generatedGames.map((game, idx) => (
                     <div key={idx} className="bg-bg-subtle border border-border-default rounded-xl p-4 flex justify-between items-center group hover:border-int-primary/30 transition-all">
                        <div className="flex gap-2 flex-wrap">
                           {game.nums.map((n: number) => (
                             <div key={n} className="w-8 h-8 rounded-lg bg-surface-default border border-border-default flex items-center justify-center text-xs font-black text-content-primary group-hover:border-int-primary/20">
                               {n < 10 ? `0${n}` : n}
                             </div>
                           ))}
                        </div>
                        <span className="text-[8px] font-black text-content-tertiary uppercase bg-bg-muted px-2 py-1 rounded ml-4">SOMA: {game.meta.soma}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[400px] border-2 border-dashed border-border-default rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-40">
             <Layers size={48} className="mb-4 text-content-tertiary" />
             <h4 className="font-bold text-lg">Módulo de Fechamento Matemático</h4>
             <p className="text-sm max-w-xs mt-1">Selecione uma modalidade e uma matriz de fechamento no painel lateral para começar.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wheels;
