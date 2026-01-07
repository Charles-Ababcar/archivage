import React from 'react';

interface HeaderItem {
  label: string;
  icon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps {
  headers: string[] | HeaderItem[];
  children: React.ReactNode;
  compact?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

export const Table: React.FC<TableProps> = ({ 
  headers, 
  children, 
  compact = false,
  striped = true,
  hoverable = true
}) => {
  const isObjectHeaders = headers.length > 0 && typeof headers[0] !== 'string';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <tr>
            {isObjectHeaders 
              ? (headers as HeaderItem[]).map((header, i) => (
                  <th 
                    key={i} 
                    className={`p-4 text-xs font-bold text-slate-600 uppercase tracking-wider ${header.align === 'center' ? 'text-center' : header.align === 'right' ? 'text-right' : 'text-left'}`}
                    style={header.width ? { width: header.width } : undefined}
                  >
                    <div className={`flex items-center gap-2 ${header.align === 'center' ? 'justify-center' : header.align === 'right' ? 'justify-end' : ''}`}>
                      {header.icon && <span className="text-slate-400">{header.icon}</span>}
                      {header.label}
                    </div>
                  </th>
                ))
              : (headers as string[]).map((header, i) => (
                  <th 
                    key={i} 
                    className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))
            }
          </tr>
        </thead>
        <tbody className={`divide-y divide-slate-100 ${striped ? '[&>tr:nth-child(even)]:bg-slate-50' : ''} ${hoverable ? '[&>tr:hover]:bg-slate-50' : ''}`}>
          {children}
        </tbody>
      </table>
    </div>
  );
};