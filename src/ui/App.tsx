export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFC] text-gray-900 font-sans flex items-center justify-center">
      <main className="max-w-xl px-8 text-center">
        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          Concierge · Scaffold
        </p>
        <h1 className="font-serif text-4xl mb-4">The frame is up.</h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          This is the WP-1.1 scaffold: build tooling, lane separation, and
          directory layout only. The pipeline (ingest, classify, generate) and
          the demo corpus land with the next work packages.
        </p>
        <p className="text-xs text-gray-400 italic">
          Lane A · fictional data only · nothing here is generated or cited yet
        </p>
      </main>
    </div>
  );
}
