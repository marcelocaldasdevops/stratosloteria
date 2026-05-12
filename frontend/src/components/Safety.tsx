import { AlertTriangle, ShieldCheck, HeartPulse, Wallet } from 'lucide-react';

const Safety = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-status-warning-bg border border-status-warning-border rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-status-warning-content opacity-10">
          <ShieldCheck size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-status-warning-content mb-4">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold uppercase tracking-tight">Compromisso com o Jogo Responsável</h2>
          </div>
          <p className="text-content-primary text-base leading-relaxed max-w-2xl">
            Loterias são sistemas de entretenimento baseados em probabilidade. Jogue com moderação e lembre-se: o vício em jogos é uma condição séria. Nunca use dinheiro destinado a necessidades básicas.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center text-int-primary mb-4">
            <Wallet size={20} />
          </div>
          <h3 className="font-bold text-sm mb-3">Controle Financeiro</h3>
          <p className="text-content-secondary text-xs leading-relaxed">
            Estabeleça um limite fixo mensal para apostas e nunca tente recuperar perdas aumentando o valor jogado.
          </p>
        </div>

        <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center text-int-primary mb-4">
            <HeartPulse size={20} />
          </div>
          <h3 className="font-bold text-sm mb-3">Sinais de Alerta</h3>
          <p className="text-content-secondary text-xs leading-relaxed">
            Se o jogo está causando estresse, ansiedade ou afetando suas relações, é hora de fazer uma pausa prolongada.
          </p>
        </div>

        <div className="bg-surface-default border border-border-default rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-bg-subtle rounded-xl flex items-center justify-center text-int-primary mb-4">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-sm mb-3">Ajuda Profissional</h3>
          <p className="text-content-secondary text-xs leading-relaxed mb-4">
            Existem organizações prontas para ajudar sem julgamentos.
          </p>
          <div className="flex items-center gap-2 text-int-primary font-bold text-sm bg-bg-subtle p-2 rounded-lg justify-center">
            CVV: 188
          </div>
        </div>
      </div>

      <div className="bg-surface-default border border-border-default rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-bg-subtle px-6 py-4 border-b border-border-default">
          <h3 className="text-xs font-bold uppercase tracking-widest text-content-secondary">Desmistificando o Azar</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-4 p-4 rounded-xl hover:bg-bg-subtle transition-colors">
            <div className="text-status-danger-content font-black text-xs pt-1">MITO</div>
            <p className="text-sm text-content-primary">"Números que não saem há muito tempo têm mais chances no próximo sorteio."</p>
          </div>
          <div className="flex gap-4 p-4 rounded-xl bg-status-success-bg/30">
            <div className="text-status-success-content font-black text-xs pt-1">FATO</div>
            <p className="text-sm text-content-primary">Cada sorteio é um evento independente. A probabilidade de qualquer número sair é rigorosamente a mesma em todas as rodadas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Safety;
