export type WorkStatus = 'live alpha' | 'in development' | 'planned';

export interface WorkLink {
  label: string;
  url: string;
}

export interface WorkScreenshot {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface WorkFact {
  k: string;
  v: string;
}

export interface WorkProject {
  slug: string;
  title: string;
  status: WorkStatus;
  summary: string;
  capabilities: string[];
  seoDescription: string;
  body?: string[];
  facts?: WorkFact[];
  links?: WorkLink[];
  screenshots?: WorkScreenshot[];
}
