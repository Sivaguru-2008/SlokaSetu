import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { Occasion } from '../types';

interface OccasionCardProps {
  occasion: Occasion;
}

export const OccasionCard: React.FC<OccasionCardProps> = ({ occasion }) => {
  const isAmrita = !!occasion.institutionId || occasion.category?.slug.includes('amrita');
  const primaryDate = occasion.dates && occasion.dates.length > 0 ? occasion.dates[0] : null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date to be announced';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`rounded-xl border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden bg-white ${
      isAmrita ? 'border-maroon-200/90' : 'border-stone-200/90'
    }`}>
      <div className="p-5">
        
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
            isAmrita 
              ? 'bg-maroon-50 text-maroon-800 border-maroon-200' 
              : 'bg-gold-50 text-gold-900 border-gold-200'
          }`}>
            {occasion.category?.name || 'Festival'}
          </span>

          {isAmrita && (
            <span className="flex items-center space-x-1 text-[11px] text-maroon-700 bg-maroon-50/50 px-2 py-0.5 rounded font-medium border border-maroon-100">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Amrita Institutional</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-maroon-800 transition-colors mb-2 line-clamp-1">
          <Link to={`/occasions/${occasion.slug}`}>
            {occasion.name}
          </Link>
        </h3>

        {/* Date and Region */}
        <div className="space-y-1.5 mb-3 text-xs text-stone-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-maroon-700 shrink-0" />
            <span className="font-semibold text-stone-800">{formatDate(primaryDate?.gregorianDate)}</span>
            {primaryDate?.region && (
              <span className="text-[11px] text-stone-500 font-normal">
                ({primaryDate.region})
              </span>
            )}
          </div>

          {occasion.institution && (
            <div className="flex items-center space-x-2 text-[11px] text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{occasion.institution.name} ({occasion.institution.campus})</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
          {occasion.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="bg-stone-50/80 px-5 py-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-500 flex items-center space-x-1">
          <BookOpen className="w-3.5 h-3.5 text-stone-400" />
          <span>
            {occasion.occasionSlokas?.length || 0} Parayanam texts
          </span>
        </span>
        <Link
          to={`/occasions/${occasion.slug}`}
          className="text-xs font-semibold text-maroon-700 hover:text-maroon-900 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Programme</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
