export function runRules(data) {
  const high = [];
  const medium = [];

  for (const d of data) {
    if (d.impressions > 100 && d.ctr < 0.02) {
      high.push({
        type: 'CTR_FIX',
        page: d.page,
        query: d.query,
        priority: 3,
        reason: `High impressions (${d.impressions}) but low CTR (${(d.ctr * 100).toFixed(1)}%). Need title/meta rewrite.`,
        action: 'Rewrite title tag and meta description to improve click-through rate.',
      });
    }

    if (d.position >= 4 && d.position <= 20) {
      high.push({
        type: 'RANK_BOOST',
        page: d.page,
        query: d.query,
        priority: 3,
        reason: `Position ${d.position} is within striking distance of top 3.`,
        action: 'Add internal links, expand content with relevant sections, improve heading structure.',
      });
    }

    if (d.impressions < 50 && d.query.split(' ').length >= 3) {
      medium.push({
        type: 'CONTENT_GAP',
        page: d.page,
        query: d.query,
        priority: 2,
        reason: `Low impressions (${d.impressions}) for a long-tail query. Potential content gap.`,
        action: 'Add a dedicated section or FAQ entry covering this query.',
      });
    }

    if (d.position <= 3 && d.ctr < 0.05) {
      high.push({
        type: 'PAGE_CTR_FIX',
        page: d.page,
        query: d.query,
        priority: 3,
        reason: `Position ${d.position} but CTR only ${(d.ctr * 100).toFixed(1)}%. Snippet/title not compelling.`,
        action: 'Update meta title and description to be more action-oriented.',
      });
    }
  }

  return { high, medium };
}
