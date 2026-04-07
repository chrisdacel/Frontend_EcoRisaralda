import { useState } from 'react';

// Star Rating Component (Extracted for HU007)
export default function StarRating({ rating, onRatingChange, size = 'medium', interactive = true }) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  if (!interactive) {
    // Versión estática sin interacción
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star}>
            <svg
              className={`${sizeClasses[size]}`}
              fill={rating >= star ? '#f59e0b' : 'none'}
              stroke={rating >= star ? '#f59e0b' : '#cbd5e1'}
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`${sizeClasses[size]} transition-colors`}
            fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
            stroke={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
