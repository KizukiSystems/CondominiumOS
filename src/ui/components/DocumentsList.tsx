import type { BoardPack } from '../types';

interface DocumentsListProps {
  documents: BoardPack[];
  onSelect: (id: string) => void;
}

export function DocumentsList({ documents, onSelect }: DocumentsListProps) {
  return (
    <>
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shrink-0">
        <h1 className="text-xl font-medium text-gray-900">Board Meeting Documents</h1>
      </header>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No packs yet.</p>
              <p className="text-sm mt-2">Go to Inbox and choose "Prep Board Meeting" to generate one.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelect(doc.id)}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-serif text-gray-900">{doc.title}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                      doc.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Meeting: {doc.meetingDate} · {doc.agendaItems.length} decisions · generated{' '}
                  {doc.generatedDate}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
