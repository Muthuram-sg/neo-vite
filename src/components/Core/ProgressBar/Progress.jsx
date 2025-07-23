import React from 'react';

export default function Progress({ value, color }) {
  return (
    <div className="w-full bg-Background-bg-secondary rounded-full h-4 mb-4 dark:bg-Background-bg-secondary-dark">
      <div
        className="h-4 rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}
