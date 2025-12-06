interface PassagePanelProps {
  passageText: string | null;
}

export default function PassagePanel({ passageText }: PassagePanelProps) {
  if (!passageText) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-center px-8">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 text-lg">No passage for this question</p>
        </div>
      </div>
    );
  }
  
  const paragraphs = passageText.split('\n\n').filter(p => p.trim());
  
  return (
    <div className="h-full overflow-y-auto passage-scroll bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-3">
        <span className="text-sm font-medium text-gray-500">Reading Passage</span>
      </div>
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-gray-800 leading-relaxed text-[15px]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
