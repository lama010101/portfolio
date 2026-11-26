import type { WorkProject } from '../work-types';

// One data file per project lives in ./projects. The glob makes adding a case
// study a one-file operation: drop in a new *.ts file exporting `project`.
const modules = import.meta.glob('./projects/*.ts', { eager: true });

export const projects: WorkProject[] = Object.values(modules)
  .map((mod) => (mod as { project?: WorkProject }).project)
  .filter((project): project is WorkProject => Boolean(project))
  .sort((a, b) => a.title.localeCompare(b.title));

export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
