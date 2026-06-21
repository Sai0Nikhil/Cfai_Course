import React from 'react';
import { ShieldAlert, Activity, BookOpen } from 'lucide-react';

export default function ImportanceBadge({ rating }) {
  // Determine badge styling based on rating
  let badgeClass = 'badge-sage';
  let label = 'Foundational';
  let Icon = BookOpen;
  let scoreColor = '#4E8773';

  if (rating >= 8) {
    badgeClass = 'badge-terracotta';
    label = 'Exam Critical';
    Icon = ShieldAlert;
    scoreColor = 'var(--coral)';
  } else if (rating >= 5) {
    badgeClass = 'badge-gold';
    label = 'Important';
    Icon = Activity;
    scoreColor = 'var(--gold)';
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <span className={`badge ${badgeClass}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <Icon size={12} />
        {label}
      </span>
      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
        Importance:{' '}
        <span style={{ color: scoreColor, fontWeight: '700', fontSize: '1rem' }}>
          {rating}/10
        </span>
      </span>
    </div>
  );
}
