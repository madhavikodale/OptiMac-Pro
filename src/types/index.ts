export interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    upload: number;
    download: number;
  };
  temperature: number;
  processes: number;
}

export interface DashboardLayout {
  cards: string[];
  order: number[];
}

export interface User {
  id: string;
  name: string;
  plan: 'premium' | 'simple';
}
