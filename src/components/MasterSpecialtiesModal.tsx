import React, { useState, useMemo } from 'react';
import { X, Search, Check, Sparkles, BookOpen, Scale, Landmark, Cpu, Stethoscope, Atom, FlaskConical, MessageSquareHeart, Palette, Compass, Brain, Briefcase, Globe, UtensilsCrossed, Leaf } from 'lucide-react';
import { getT } from '../utils/translations';

export interface SpecialtyOption {
  id: string;
  name: string;
  category: 'law_biz' | 'science_tech' | 'humanities' | 'medicine' | 'culture';
  icon: string;
  description: string;
  tags: string[];
}

export const MASTER_SPECIALTIES_CATALOG: SpecialtyOption[] = [
  {
    id: 'law',
    name: 'Law & Jurisprudence',
    category: 'law_biz',
    icon: '⚖️',
    description: 'Contractual clauses, courtroom rhetoric, constitutional statutes, legal precedence & jurisprudence.',
    tags: ['Legal', 'Court', 'Contracts', 'Statutes']
  },
  {
    id: 'finance',
    name: 'Finance, Banking & Economics',
    category: 'law_biz',
    icon: '📈',
    description: 'Macroeconomic analysis, equity securities, monetary policy, sovereign bonds & corporate valuation.',
    tags: ['Markets', 'Economics', 'Banking', 'Valuation']
  },
  {
    id: 'business',
    name: 'Business Strategy & Entrepreneurship',
    category: 'law_biz',
    icon: '💼',
    description: 'Mergers & acquisitions, venture capital financing, market disruption & executive governance.',
    tags: ['Management', 'Strategy', 'Venture Capital']
  },
  {
    id: 'medicine',
    name: 'Medicine, Surgery & Clinical Healthcare',
    category: 'medicine',
    icon: '🩺',
    description: 'Diagnostic pathology, anatomical physiology, pharmacology, surgical procedures & hospital rounds.',
    tags: ['Clinical', 'Pathology', 'Anatomy', 'Pharma']
  },
  {
    id: 'it_ai',
    name: 'IT, Software Engineering & AI',
    category: 'science_tech',
    icon: '💻',
    description: 'Distributed architectures, algorithm complexity, neural network models, cryptography & cloud infrastructure.',
    tags: ['Software', 'AI', 'Cloud', 'Algorithms']
  },
  {
    id: 'physics',
    name: 'Physics & Quantum Sciences',
    category: 'science_tech',
    icon: '⚛️',
    description: 'Astrophysics, quantum superposition, general relativity, particle mechanics & thermodynamics.',
    tags: ['Astrophysics', 'Quantum', 'Mechanics']
  },
  {
    id: 'chemistry',
    name: 'Chemistry & Materials Science',
    category: 'science_tech',
    icon: '🧪',
    description: 'Organic stereochemistry, molecular synthesis, thermodynamics, crystalline lattices & polymers.',
    tags: ['Synthesis', 'Molecules', 'Polymers']
  },
  {
    id: 'classical_literary',
    name: 'Classical, Literary & Historic Register',
    category: 'humanities',
    icon: '📜',
    description: 'High-flown prose, elevated syntactic rhythms, classical archaisms, Dante/Manzoni rhetoric & literary tenses.',
    tags: ['Dante', 'Literary', 'Classical', 'Poetic']
  },
  {
    id: 'colloquial_slang',
    name: 'Colloquial, Street Slang & Regional Idioms',
    category: 'culture',
    icon: '💬',
    description: 'Authentic youth vernacular, regional expressions, rapid idioms, conversational banter & vivid metaphors.',
    tags: ['Slang', 'Idioms', 'Banter', 'Street']
  },
  {
    id: 'philosophy',
    name: 'Philosophy, Logic & Epistemology',
    category: 'humanities',
    icon: '🏛️',
    description: 'Metaphysics, existentialism, dialectical logic, ethics, phenomenology & philosophical argumentation.',
    tags: ['Ethics', 'Dialectics', 'Metaphysics']
  },
  {
    id: 'diplomacy_politics',
    name: 'Politics, Diplomacy & International Relations',
    category: 'law_biz',
    icon: '🌐',
    description: 'Multilateral treaties, statecraft, ambassadorial protocol, geopolitical friction & diplomatic communiqués.',
    tags: ['Treaties', 'Diplomacy', 'Statecraft']
  },
  {
    id: 'biology_neuroscience',
    name: 'Biology, Genetics & Cognitive Neuroscience',
    category: 'science_tech',
    icon: '🧬',
    description: 'Genomic sequencing, synaptic transmission, neurobiology, evolutionary ecology & cellular biology.',
    tags: ['Genomics', 'Brain', 'Ecology']
  },
  {
    id: 'art_architecture',
    name: 'Architecture, Fine Arts & Art History',
    category: 'humanities',
    icon: '🎨',
    description: 'Renaissance aesthetics, neoclassical spatial theory, architectural composition & art criticism.',
    tags: ['Renaissance', 'Aesthetics', 'Architecture']
  },
  {
    id: 'gastronomy_enology',
    name: 'Gastronomy, Enology & Culinary Heritage',
    category: 'culture',
    icon: '🍷',
    description: 'Wine terroir, artisanal enology, haute cuisine techniques, sensory tasting vocabulary & regional traditions.',
    tags: ['Wine', 'Haute Cuisine', 'Terroir']
  },
  {
    id: 'psychology',
    name: 'Psychology & Psychoanalysis',
    category: 'medicine',
    icon: '🧠',
    description: 'Cognitive behavioral psychology, psychoanalytic unconscious dynamics, neurosis & behavioral therapy.',
    tags: ['Psychoanalysis', 'Cognitive', 'Behavioral']
  },
  {
    id: 'engineering',
    name: 'Aerospace & Mechanical Engineering',
    category: 'science_tech',
    icon: '🚀',
    description: 'Propulsion dynamics, fluid mechanics, robotic kinematics & structural integrity calculations.',
    tags: ['Aerospace', 'Robotics', 'Mechanics']
  }
];

interface MasterSpecialtiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpecialties: string[];
  onChangeSpecialties: (newSelection: string[]) => void;
  targetLang?: string;
  baseLang?: string;
}

export const MasterSpecialtiesModal: React.FC<MasterSpecialtiesModalProps> = ({
  isOpen,
  onClose,
  selectedSpecialties,
  onChangeSpecialties,
  targetLang = 'Italian',
  baseLang = 'English'
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'law_biz' | 'science_tech' | 'humanities' | 'medicine' | 'culture'>('all');
  const t = getT(baseLang);

  const filteredSpecialties = useMemo(() => {
    return MASTER_SPECIALTIES_CATALOG.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const q = search.trim().toLowerCase();
      if (!q) return matchesCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, categoryFilter]);

  if (!isOpen) return null;

  const toggleSpecialty = (name: string) => {
    if (selectedSpecialties.includes(name)) {
      onChangeSpecialties(selectedSpecialties.filter((s) => s !== name));
    } else {
      onChangeSpecialties([...selectedSpecialties, name]);
    }
  };

  const selectPreset = (names: string[]) => {
    const combined = Array.from(new Set([...selectedSpecialties, ...names]));
    onChangeSpecialties(combined);
  };

  const clearAll = () => {
    onChangeSpecialties([]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 flex items-center justify-center font-extrabold text-xl shadow-lg ring-2 ring-amber-300/40">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    Master Level Specialties (C2+)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/90 text-amber-950 tracking-wider">
                    Specialist Tier
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 mt-0.5 max-w-md">
                  Select one or more domains. Stories in {targetLang} will weave authentic expert vocabulary, specialized phrasing, and native sophistication.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-emerald-100/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title={t.close || 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Counter & Clear Bar */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-200">
                Active Selection:
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 rounded-full font-bold text-xs">
                {selectedSpecialties.length} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              {selectedSpecialties.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-rose-200 hover:text-rose-100 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search domains (e.g. law, physics, classical Italian, slang, medicine)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008450]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
            {[
              { id: 'all', label: 'All Domains' },
              { id: 'law_biz', label: '⚖️ Law & Business' },
              { id: 'science_tech', label: '⚛️ Science & Tech' },
              { id: 'medicine', label: '🩺 Healthcare' },
              { id: 'humanities', label: '📜 Literary & Arts' },
              { id: 'culture', label: '💬 Colloquial & Life' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer shrink-0 ${
                  categoryFilter === cat.id
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'bg-white hover:bg-slate-200/70 text-slate-600 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Specialties Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 max-h-[46vh]">
          {filteredSpecialties.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No specialties found matching &quot;{search}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredSpecialties.map((item) => {
                const isSelected = selectedSpecialties.includes(item.name);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSpecialty(item.name)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer select-none text-left relative ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-100/80">
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.name}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              isSelected
                                ? 'bg-emerald-200/60 text-emerald-900 font-bold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="absolute right-3 top-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition border ${
                          isSelected
                            ? 'bg-[#008450] text-white border-[#008450] shadow-2xs'
                            : 'border-slate-300 text-transparent hover:border-slate-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Selected Summary & Confirm */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 truncate max-w-sm">
            {selectedSpecialties.length === 0 ? (
              <span className="italic text-slate-400">No specialties selected (default general C2+ mastery will apply).</span>
            ) : (
              <span>
                <strong className="text-slate-900">{selectedSpecialties.length} active:</strong>{' '}
                {selectedSpecialties.slice(0, 2).join(', ')}
                {selectedSpecialties.length > 2 && ` +${selectedSpecialties.length - 2} more`}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#008450] hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Save & Apply Specialties</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
