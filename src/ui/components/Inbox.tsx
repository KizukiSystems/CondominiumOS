import type { Thread } from '../types';

interface InboxProps {
  threads: Thread[];
  onPrepMeeting: () => void;
}

export function Inbox({ threads, onPrepMeeting }: InboxProps) {
  return (
    <>
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
        <h1 className="text-xl font-medium text-gray-900">Inbox</h1>
        <button
          onClick={onPrepMeeting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Prep Board Meeting
        </button>
      </header>
      <div className="flex-1 overflow-y-auto bg-white">
        {threads.map((thread) => (
          <div key={thread.id} className="border-b border-gray-100 p-4 hover:bg-gray-50 flex flex-col">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-medium text-gray-900">{thread.sender}</h3>
              <span className="text-xs text-gray-500">{thread.date}</span>
            </div>
            <h4 className="text-sm font-medium text-gray-800 mb-1">{thread.subject}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{thread.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
