import React from 'react';

export const Table = ({
  headers = [],
  children,
  isEmpty = false,
  emptyMessage = 'No records found.',
  isLoading = false,
}) => {
  return (
    <div className="w-full overflow-hidden border border-white/[0.035] rounded-2xl bg-slate-950/20 backdrop-blur-xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-slate-300">
          <thead>
            <tr className="border-b border-white/[0.035] bg-slate-950/45">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {isLoading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-14 text-center">
                  <div className="inline-flex items-center space-x-2 text-indigo-400">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest ml-2">Synchronizing clinical data...</span>
                  </div>
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm font-semibold text-slate-400">{emptyMessage}</p>
                    <p className="text-[10px] text-slate-655 font-mono">STATUS_VOID_NULL</p>
                  </div>
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
