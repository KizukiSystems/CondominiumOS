import type { Thread } from '../types';

interface CitationPanelProps {
  thread: Thread | null;
  isOpen: boolean;
  onClose: () => void;
}

// The citation chip's destination: the raw source, shown whole. Ported from
// Concierge-OG (KEEP verdict); the dead "open in portal" button was removed.
export function CitationPanel({ thread, isOpen, onClose }: CitationPanelProps) {
  if (!isOpen) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50" />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-900">Source document</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>
        {thread ? (
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-4 leading-snug">{thread.subject}</h3>
            <div className="flex items-center justify-between text-sm mb-6 pb-6 border-b border-gray-100">
              <span className="font-medium text-gray-900">{thread.sender}</span>
              <span className="text-gray-500">{thread.date}</span>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{thread.body}</p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mt-8 text-sm text-gray-600">
              This is the cited source for the selected claim, shown in full.
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Source not found.</div>
        )}
      </div>
    </>
  );
}
