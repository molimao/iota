import { describe, expect, it } from 'vitest';
import { AVAILABLE_PROJECT_IDS, PROJECT_IDS, isAvailableProject } from './projects';
import { AVAILABLE_FLEET_PROJECTS, bindingSchema } from './fleet';
import { crawlPages } from './crawl';
import { articles } from '../components/site/articles';
import { guidesForProject } from '../components/site/project-guides';

describe('retired Gonka project', () => {
  it('removes public and new-device choices while retaining the saved record format', () => {
    expect(PROJECT_IDS).toContain('gonka');
    expect(AVAILABLE_PROJECT_IDS).not.toContain('gonka');
    expect(AVAILABLE_FLEET_PROJECTS).not.toContain('gonka');
    expect(isAvailableProject('gonka')).toBe(false);
    expect(isAvailableProject('iota')).toBe(true);
    expect(bindingSchema.parse({ id: 'old', project: 'gonka', identifier: 'old-public-id', worker: '' }).project).toBe('gonka');
  });
  it('removes Gonka pages and guides from public discovery', () => {
    expect(crawlPages.some((p) => p.path === 'projects/gonka')).toBe(false);
    expect(articles.some((article) => article.project === 'gonka')).toBe(false);
    expect(guidesForProject().some((guide) => guide.project === 'gonka')).toBe(false);
  });
});
