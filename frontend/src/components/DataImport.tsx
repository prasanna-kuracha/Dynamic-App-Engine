'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { ModelDef } from '@/shared/schema';
import { createData } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { FileUp, Database } from 'lucide-react';

export const DataImport: React.FC<{ model: ModelDef }> = ({ model }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'csv' | 'json' | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const isJson = selectedFile.name.endsWith('.json');
      setFileType(isJson ? 'json' : 'csv');

      if (isJson) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = JSON.parse(event.target?.result as string);
            const data = Array.isArray(json) ? json[0] : json;
            setHeaders(Object.keys(data));
          } catch (err) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(selectedFile);
      } else {
        Papa.parse(selectedFile, {
          header: true,
          preview: 1,
          complete: (results) => {
            setHeaders(results.meta.fields || []);
          },
        });
      }
    }
  };

  const processImport = async (data: any[]) => {
    for (const row of data) {
      const mappedData: any = {};
      model.fields.forEach((field) => {
        const sourceCol = mapping[field.name];
        if (sourceCol && row[sourceCol] !== undefined && row[sourceCol] !== null && row[sourceCol] !== '') {
          mappedData[field.name] = row[sourceCol];
        }
      });

      if (Object.keys(mappedData).length > 0) {
        await createData(model.name, mappedData);
      }
    }
    queryClient.invalidateQueries({ queryKey: ['data', model.name] });
    setImporting(false);
    setFile(null);
    setHeaders([]);
    alert('Import completed successfully!');
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);

    if (fileType === 'json') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const data = Array.isArray(json) ? json : [json];
          await processImport(data);
        } catch (err) {
          alert('Error processing JSON');
          setImporting(false);
        }
      };
      reader.readAsText(file);
    } else {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          await processImport(results.data);
        },
      });
    }
  };

  return (
    <div className="bg-indigo-50/50 dark:bg-gray-800 p-8 rounded-[2rem] border-2 border-dashed border-indigo-200 dark:border-gray-600 transition-all hover:border-indigo-300 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <Database className="w-5 h-5 text-indigo-500" />
        <h4 className="text-base font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">Data Import</h4>
      </div>
      
      <div className="relative mb-4">
        <input 
          type="file" 
          accept=".csv,.json" 
          onChange={handleFileChange} 
          className="block w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
        />
      </div>
      
      {headers.length > 0 && (
        <div className="mt-6 space-y-4 bg-white/50 dark:bg-gray-900/50 p-6 rounded-[1.5rem] shadow-sm">
          <p className="text-[10px] font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">Map fields:</p>
          <div className="grid grid-cols-1 gap-3">
            {model.fields.map((field) => (
              <div key={field.name} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-indigo-50/50">
                <span className="text-[10px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide">{field.name}</span>
                <select
                  className="text-xs bg-indigo-50 dark:bg-gray-700 border-none rounded-lg p-2 focus:ring-4 focus:ring-indigo-100 outline-none font-black"
                  onChange={(e) => setMapping({ ...mapping, [field.name]: e.target.value })}
                  value={mapping[field.name] || ''}
                >
                  <option value="">(Skip)</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full mt-4 flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 uppercase tracking-widest"
          >
            {importing ? (
              <span className="animate-pulse text-xs">Importing...</span>
            ) : (
              <>
                <FileUp className="w-5 h-5" />
                <span>Start Import</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
