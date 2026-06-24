/**
 * GSC Data Extractor — v3.1
 *
 * This module defines the data shape and collection logic for
 * Google Search Console exports. To use with real data:
 *
 * 1. Export CSV from GSC (Queries tab, last 28 days)
 * 2. Map columns to GscQuery[] and GscPage[] via parseGscCsv()
 * 3. Feed into rule-engine.ts → task-list.ts
 *
 * Node / Python equivalent:
 *   - Node: use `googleapis` package with GSC API
 *   - Python: use `google-api-python-client`
 *   - Auth: OAuth 2.0 or service account with GSC read scope
 */

import type { GscQuery, GscPage } from '~/data/seo/types';

export interface GscExportRow {
  query: string;
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

/**
 * Parse raw GSC CSV rows into typed arrays.
 */
export function parseGscCsv(rows: string[][]): GscExportRow[] {
  return rows.slice(1).map(row => ({
    query: row[0] || '',
    page: row[1] || '',
    impressions: parseInt(row[2], 10) || 0,
    clicks: parseInt(row[3], 10) || 0,
    ctr: parseFloat(row[4]) || 0,
    position: parseFloat(row[5]) || 0,
  }));
}

/**
 * Aggregate query-level data from raw exports.
 * Deduplicates by query, summing impressions/clicks, averaging position.
 */
export function aggregateQueries(rows: GscExportRow[]): GscQuery[] {
  const map = new Map<string, { impressions: number; clicks: number; positions: number[] }>();
  for (const row of rows) {
    const existing = map.get(row.query);
    if (existing) {
      existing.impressions += row.impressions;
      existing.clicks += row.clicks;
      existing.positions.push(row.position);
    } else {
      map.set(row.query, { impressions: row.impressions, clicks: row.clicks, positions: [row.position] });
    }
  }
  return Array.from(map.entries()).map(([query, data]) => ({
    query,
    impressions: data.impressions,
    clicks: data.clicks,
    ctr: data.impressions > 0 ? Math.round((data.clicks / data.impressions) * 10000) / 100 : 0,
    position: Math.round((data.positions.reduce((a, b) => a + b, 0) / data.positions.length) * 10) / 10,
  })).sort((a, b) => b.impressions - a.impressions);
}

/**
 * Aggregate page-level data from raw exports.
 */
export function aggregatePages(rows: GscExportRow[]): GscPage[] {
  const map = new Map<string, { impressions: number; clicks: number; positions: number[] }>();
  for (const row of rows) {
    const existing = map.get(row.page);
    if (existing) {
      existing.impressions += row.impressions;
      existing.clicks += row.clicks;
      existing.positions.push(row.position);
    } else {
      map.set(row.page, { impressions: row.impressions, clicks: row.clicks, positions: [row.position] });
    }
  }
  return Array.from(map.entries()).map(([path, data]) => {
    const ctr = data.impressions > 0 ? Math.round((data.clicks / data.impressions) * 10000) / 100 : 0;
    const position = Math.round((data.positions.reduce((a, b) => a + b, 0) / data.positions.length) * 10) / 10;
    let category: GscPage['category'] = 'no-exposure';
    if (data.impressions > 500 && ctr < 2) category = 'high-impression-low-ctr';
    else if (position >= 4 && position <= 20) category = 'mid-rank';
    return { path, impressions: data.impressions, clicks: data.clicks, ctr, position, category };
  }).sort((a, b) => b.impressions - a.impressions);
}

/**
 * GSC API URL builder (for reference when integrating with real GSC API).
 */
export function buildGscApiUrl(siteUrl: string, startDate: string, endDate: string): string {
  return `https://searchconsole.googleapis.com/v1/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
}
