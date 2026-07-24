import { useState } from 'react';
import { Agenda } from './components/Agenda';
import { CitationPanel } from './components/CitationPanel';
import { DocumentsList } from './components/DocumentsList';
import { Inbox } from './components/Inbox';
import { Layout, type View } from './components/Layout';
import { cachedAgendaItems, seedThreads } from './data/demoSeed';
import type { AgendaItem, BoardPack } from './types';

export default function App() {
  const [view, setView] = useState<View>('inbox');
  const [packs, setPacks] = useState<BoardPack[]>([]);
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);

  // Deterministic demo generation from cached data; the live LLM pipeline
  // (ingest -> classify -> generate -> assertCoverage) arrives with WP-1.3.
  const handlePrepMeeting = () => {
    const pack: BoardPack = {
      id: `pack_${packs.length + 1}`,
      title: 'May 2026 Board Meeting Prep',
      meetingDate: 'Thursday, May 8 2026, 7:00 PM',
      generatedDate: 'from cached demo data',
      status: 'draft',
      agendaItems: cachedAgendaItems.map((item) => ({ ...item })),
    };
    setPacks((prev) => [pack, ...prev]);
    setActivePackId(pack.id);
    setView('pack');
  };

  const handleUpdateItem = (itemId: string, updates: Partial<AgendaItem>) => {
    setPacks((prev) =>
      prev.map((pack) =>
        pack.id === activePackId
          ? {
              ...pack,
              agendaItems: pack.agendaItems.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
            }
          : pack,
      ),
    );
  };

  const handleFinalize = (packId: string) => {
    setPacks((prev) => prev.map((pack) => (pack.id === packId ? { ...pack, status: 'final' } : pack)));
  };

  const activePack = packs.find((p) => p.id === activePackId) ?? null;
  const activeThread = activeSourceId ? (seedThreads.find((t) => t.id === activeSourceId) ?? null) : null;

  return (
    <Layout currentView={view} onNavigate={setView}>
      {view === 'inbox' && <Inbox threads={seedThreads} onPrepMeeting={handlePrepMeeting} />}
      {view === 'documents' && (
        <DocumentsList
          documents={packs}
          onSelect={(id) => {
            setActivePackId(id);
            setView('pack');
          }}
        />
      )}
      {view === 'pack' && activePack && (
        <Agenda
          doc={activePack}
          messageCount={seedThreads.length}
          threadCount={new Set(seedThreads.map((t) => t.threadId ?? t.id)).size}
          onBack={() => setView('documents')}
          onOpenCitation={setActiveSourceId}
          onUpdateItem={handleUpdateItem}
          onFinalize={handleFinalize}
        />
      )}
      <CitationPanel
        thread={activeThread}
        isOpen={activeSourceId !== null}
        onClose={() => setActiveSourceId(null)}
      />
    </Layout>
  );
}
