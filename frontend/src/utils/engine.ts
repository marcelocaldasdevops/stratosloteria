export interface Modality {
  name: string;
  total: number;
  min: number;
  max: number;
  grid: [number, number];
  color: string;
  api: string;
  price: number;
}

export const LOTERIAS: Record<string, Modality> = {
  MEGA_SENA: { name: "MEGA-SENA", total: 60, min: 6, max: 20, grid: [10, 6], color: "#06b6d4", api: "megasena", price: 5.0 },
  LOTOFACIL: { name: "LOTOFÁCIL", total: 25, min: 15, max: 20, grid: [5, 5], color: "#930089", api: "lotofacil", price: 3.0 },
  QUINA: { name: "QUINA", total: 80, min: 5, max: 15, grid: [10, 8], color: "#3b82f6", api: "quina", price: 2.5 },
  LOTOMANIA: { name: "LOTOMANIA", total: 100, min: 50, max: 50, grid: [10, 10], color: "#f78100", api: "lotomania", price: 3.0 },
  DUPLA_SENA: { name: "DUPLA-SENA", total: 50, min: 6, max: 15, grid: [10, 5], color: "#e11d48", api: "duplasena", price: 2.5 }
};

export const Engine = {
  fatorial(n: number): bigint {
    let res = 1n;
    for (let i = 2n; i <= BigInt(n); i++) res *= i;
    return res;
  },
  
  combinacoes(n: number, k: number): bigint {
    if (k > n) return 0n;
    if (k < 0) return 0n;
    if (k === 0 || k === n) return 1n;
    if (k > n / 2) k = n - k;
    
    let num = 1n;
    for (let i = 1n; i <= BigInt(k); i++) {
      num = num * (BigInt(n) - i + 1n) / i;
    }
    return num;
  },

  ehPrimo(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
    return true;
  },
getRandom(min: number, max: number): number {
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return min + (arr[0] % (max - min + 1));
},

getBordas(n: number, cols: number, rows: number, modalityName?: string): boolean {
  // Standard 1-based logic
  let num = n;
  if (modalityName === 'LOTOMANIA') {
    // Lotomania 00-99 is essentially 1-100 shifted
    num = n === 0 ? 100 : n; 
  }
  let r = Math.floor((num - 1) / cols) + 1;
  let c = ((num - 1) % cols) + 1;
  return (r === 1 || r === rows || c === 1 || c === cols);
},

analisarJogo(nums: number[], mod: Modality) {
  const soma = nums.reduce((a, b) => a + b, 0);
  const pares = nums.filter(n => n % 2 === 0).length;
  const impares = nums.length - pares;
  const primos = nums.filter(n => n > 1 && this.ehPrimo(n)).length;
  const fibPool = this.getFib(mod.total);
  const fibonacci = nums.filter(n => fibPool.includes(n)).length;
  const moldura = nums.filter(n => this.getBordas(n, mod.grid[0], mod.grid[1], mod.name)).length;

  // Near Peer (Vizinhas): Adjacency in sequence
  let nearPeers = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      nearPeers++;
    }
  }

  let maxSeq = 1, curSeq = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      curSeq++;
      maxSeq = Math.max(maxSeq, curSeq);
    } else {
      curSeq = 1;
    }
  }

  return { soma, pares, impares, primos, fibonacci, moldura, maxSeq, nearPeers };
}
};
