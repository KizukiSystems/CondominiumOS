import { useState } from 'react';
import type { AgendaItem, BoardPack } from '../types';

interface AgendaProps {
  doc: BoardPack;
  sourceCount: number;
  onBack: () => void;
  onOpenCitation: (sourceId: string) => void;
  onUpdateItem: (id: string, updates: Partial<AgendaItem>) => void;
  onFinalize: (id: string) => void;
}

// Ported from Concierge-OG per SALVAGE.md §3 with the theater cut: no
// simulated publishing, no fake calendar invites or portal syncs. A pack can
// be marked FINAL, which freezes it locally. Nothing is ever sent or filed
// (Build Spec §2: no autonomous actions).
export function Agenda({ doc, sourceCount, onBack, onOpenCitation, onUpdateItem, onFinalize }: AgendaProps) {
  const [activeTab, setActiveTab] = useState<'agenda' | 'talking-points'>('agenda');
  const items = doc.agendaItems;
  const approvedCount = items.filter((i) => i.status === 'approved').length;
  const allApproved = approvedCount === items.length;
  const isFinal = doc.status === 'final';

  return (
    <div className="h-full bg-[#FDFDFC] text-gray-900 font-sans pb-32 flex-1 overflow-y-auto">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors mr-2">
              ←
            </button>
            {(['agenda', 'talking-points'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium transition-colors border-b-2 py-4 ${
                  activeTab === tab
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'agenda' ? 'Agenda' : 'Talking Points'}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-medium text-gray-500">
              {approvedCount} of {items.length} approved
            </span>
            <button
              disabled={!allApproved || isFinal}
              onClick={() => onFinalize(doc.id)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                isFinal
                  ? 'bg-green-100 text-green-800'
                  : allApproved
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isFinal ? 'Final' : 'Mark pack final'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-16">
        <header className="mb-16">
          <div className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">
            Draft Board Agenda
          </div>
          <h1 className="text-5xl font-serif text-gray-900 mb-2">{doc.title}</h1>
          <p className="text-lg text-gray-500 mb-6 italic font-serif">
            Maple Court · OCSCC 742 · 88 residential units · Ottawa
          </p>
          <div className="text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
            Board Meeting · {doc.meetingDate} · Party Room, 200 Maple Court Lane
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-600 mb-8">
            Drafted by Concierge from <strong>{sourceCount} fictional source documents</strong> (cached demo
            data; the live pipeline arrives with WP-1.3). Every item links to its source. Review before
            circulating.
          </div>

          {isFinal && (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800 mb-8">
              Pack marked final and frozen locally. Nothing was sent, filed, or synced anywhere; export to
              file arrives with the pipeline work.
            </div>
          )}
        </header>

        <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-8">
          {activeTab === 'agenda' ? 'Decisions For The Board' : 'Speaking Notes'}
        </h2>

        <div className="space-y-16">
          {items.map((item, index) => (
            <div key={item.id} className="relative">
              <div className="absolute -left-16 top-1">
                <button
                  onClick={() =>
                    onUpdateItem(item.id, { status: item.status === 'approved' ? 'pending' : 'approved' })
                  }
                  disabled={isFinal}
                  title="Approve item"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                    item.status === 'approved'
                      ? 'bg-green-50 border-green-200 text-green-600'
                      : 'bg-white border-gray-200 text-gray-300 hover:border-gray-300'
                  } ${isFinal ? 'cursor-default opacity-80' : ''}`}
                >
                  ✓
                </button>
              </div>

              <div className="flex items-center space-x-3 mb-3">
                <span className="text-gray-400 font-mono text-sm">0{index + 1}</span>
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  {item.category}
                </span>
              </div>

              <h3 className="text-2xl font-serif text-gray-900 mb-4 leading-snug">{item.decisionHeadline}</h3>

              {activeTab === 'agenda' ? (
                <>
                  {item.needsEngineer && (
                    <div className="inline-flex items-center bg-amber-50 text-amber-800 px-3 py-1.5 rounded text-xs font-medium mb-6">
                      Recommend engineer before deciding
                    </div>
                  )}

                  <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">
                    {item.background}{' '}
                    {item.citations.map((cite) => (
                      <button
                        key={cite.sourceId}
                        onClick={() => onOpenCitation(cite.sourceId)}
                        className="inline-flex items-center px-1.5 py-0.5 mx-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded border border-gray-200 transition-colors align-baseline"
                      >
                        {cite.source} · {cite.date}
                      </button>
                    ))}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {item.options.map((option) => {
                      const isSelected = item.selectedOptionId === option.id;
                      return (
                        <div
                          key={option.id}
                          onClick={() => !isFinal && onUpdateItem(item.id, { selectedOptionId: option.id })}
                          className={`border rounded p-4 flex flex-col relative transition-all ${
                            isSelected
                              ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/40 shadow-sm'
                              : option.isManagerSuggestion
                                ? 'bg-[#F8FBFA] border-teal-100 hover:border-teal-300 cursor-pointer'
                                : 'bg-white border-gray-200 hover:border-gray-300 cursor-pointer'
                          } ${isFinal ? 'pointer-events-none' : ''}`}
                        >
                          {option.isManagerSuggestion && (
                            <div className="flex items-center text-[10px] font-bold tracking-widest text-teal-700 uppercase mb-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5" />
                              Manager's Suggestion
                            </div>
                          )}
                          <h4 className="font-medium text-gray-900 mb-1.5 text-[15px]">{option.title}</h4>
                          <p className="text-sm text-gray-500 mb-4 flex-grow">{option.detail}</p>
                          {option.meta && (
                            <div className="text-xs font-medium text-gray-700 mt-auto pt-4 border-t border-gray-100/50">
                              {option.meta}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded p-6">
                  <p className="text-gray-800 text-[15px] leading-relaxed italic border-l-2 border-blue-500 pl-4">
                    "{item.talkingPoints}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="mt-24 pt-8 border-t border-gray-200 flex justify-between text-xs text-gray-400 italic">
          <span>{isFinal ? 'Final · frozen locally' : 'Prepared for board review · not yet circulated'}</span>
          <span className="font-serif">Concierge</span>
        </footer>
      </div>
    </div>
  );
}
