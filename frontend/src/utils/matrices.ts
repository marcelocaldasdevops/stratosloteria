export interface MatrixTemplate {
  id: string;
  name: string;
  description: string;
  v: number; // Total numbers chosen
  k: number; // Numbers per ticket
  t: number; // Guarantee (points)
  m: number; // Condition (numbers drawn among v)
  tickets: number[][]; // The relative positions (0-indexed)
}

export const MATRICES: Record<string, MatrixTemplate[]> = {
  MEGA_SENA: [
    {
      id: "MS-10-6-4-6",
      name: "10-6-4-6 (Econômico)",
      description: "Jogue com 10 números garantindo a Quadra se acertar os 6 sorteados.",
      v: 10, k: 6, t: 4, m: 6,
      tickets: [
        [0,1,2,3,4,5], [0,1,2,6,7,8], [0,1,3,4,6,9], [0,2,3,5,7,9],
        [1,2,4,5,8,9], [3,4,6,7,8,9], [0,5,6,7,8,9], [1,3,5,6,7,9], [2,4,6,7,8,9]
      ]
    },
    {
      id: "MS-12-6-4-6",
      name: "12-6-4-6 (Profissional)",
      description: "Jogue com 12 números garantindo Quadra se acertar os 6 sorteados.",
      v: 12, k: 6, t: 4, m: 6,
      tickets: [
        [0,1,2,3,4,5], [0,1,2,6,7,8], [0,1,3,9,10,11], [0,4,5,6,7,9],
        [1,4,5,8,10,11], [2,3,6,7,10,11], [2,3,8,9,10,11], [4,5,6,7,8,9],
        [0,2,4,7,9,11], [1,3,5,6,8,10], [0,6,7,8,9,10], [1,2,3,4,5,11]
      ]
    }
  ],
  LOTOFACIL: [
    {
      id: "LF-18-15-14-15",
      name: "18-15-14-15 (Ouro)",
      description: "18 números garantindo 14 pontos se os 15 sorteados estiverem entre os 18 escolhidos.",
      v: 18, k: 15, t: 14, m: 15,
      tickets: [
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
        [0,1,2,3,4,5,6,7,8,9,15,16,17,11,12],
        [0,1,2,3,4,13,14,15,16,17,5,6,7,8,9],
        [10,11,12,13,14,15,16,17,0,1,2,3,4,5,6]
      ]
    },
    {
      id: "LF-20-15-13-15",
      name: "20-15-13-15 (Master)",
      description: "20 números garantindo 13 pontos se os 15 sorteados estiverem entre os 20 escolhidos.",
      v: 20, k: 15, t: 13, m: 15,
      tickets: [
        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
        [0,1,2,3,4,5,6,7,8,15,16,17,18,19,9],
        [10,11,12,13,14,15,16,17,18,19,0,1,2,3,4]
      ]
    }
  ],
  QUINA: [
    {
      id: "QN-10-5-3-5",
      name: "10-5-3-5 (Terno)",
      description: "10 números garantindo o Terno se acertar 5 entre os 10.",
      v: 10, k: 5, t: 3, m: 5,
      tickets: [
        [0,1,2,3,4], [5,6,7,8,9], [0,1,5,6,7], [2,3,8,9,4], [0,2,4,6,8]
      ]
    }
  ]
};
