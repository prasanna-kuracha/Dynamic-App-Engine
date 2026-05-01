'use client';

import React, { useState } from 'react';
import { ModelDef } from '@/shared/schema';
import { createData } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { Database, FileUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const DataImport: React.FC<{ model: ModelDef }> = ({ model }) => {
  const [importing, setImporting] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileData, setFileData] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [fileType, setFileType] = useState<'csv' | 'json' | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const queryClient = useQueryClient();

  const handleFile = (file: File) => {
    const isCsv = file.name.endsWith('.csv');
    const isJson = file.name.endsWith('.json');
    
    if (!isCsv && !isJson) {
      toast.error('Please upload a valid CSV or JSON file');
      return;
    }

    setFileType(isCsv ? 'csv' : 'json');
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (isCsv) {
        const rows = content.split('\n').filter(row => row.trim() !== '');
        const cols = rows[0].split(',').map(h => h.trim());
        setHeaders(cols);
        setFileData(rows.slice(1).map(row => row.split(',').map(v => v.trim())));
      } else {
        try {
          const json = JSON.parse(content);
          const dataArray = Array.isArray(json) ? json : [json];
          const cols = Object.keys(dataArray[0]);
          setHeaders(cols);
          setFileData(dataArray);
        } catch (err) {
          toast.error('Invalid JSON format');
        }
      }
      toast.success(`${file.name} loaded successfully!`);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    if (Object.keys(mapping).length === 0) {
      toast.error('Please map at least one field');
      return;
    }
    
    setImporting(true);
    const toastId = toast.loading('Importing records...');
    
    try {
      let count = 0;
      for (const row of fileData) {
        const record: Record<string, any> = {};
        model.fields.forEach(field => {
          const mappedCol = mapping[field.name];
          if (mappedCol) {
            let val = fileType === 'csv' ? row[headers.indexOf(mappedCol)] : row[mappedCol];
            
            // Clean up values
            if (val === undefined || val === null) return;
            
            if (field.type === 'number') record[field.name] = Number(val);
            else if (field.type === 'boolean') record[field.name] = String(val).toLowerCase() === 'true' || val === true;
            else record[field.name] = val;
          }
        });

        // Skip empty records
        if (Object.keys(record).length === 0) continue;

        await createData(model.name, record);
        count++;
      }
      queryClient.invalidateQueries({ queryKey: ['data', model.name] });
      toast.success(`Successfully imported ${count} records!`, { id: toastId });
      setHeaders([]);
      setFileData([]);
      setMapping({});
    } catch (error) {
      toast.error('Failed to import some records', { id: toastId });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mb-0">
      <motion.div 
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        animate={{ 
          scale: isDragActive ? 1.02 : 1,
          borderColor: isDragActive ? '#6366f1' : '#e0e7ff'
        }}
        className={`bg-indigo-50/30 dark:bg-gray-900/30 p-4 rounded-2xl border-2 border-dashed transition-all relative group overflow-hidden ${isDragActive ? 'border-indigo-400 bg-indigo-100/50' : 'border-indigo-100 dark:border-gray-700'}`}
      >
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <h4 className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">Import Data</h4>
          </div>
          {fileData.length > 0 && (
             <button onClick={() => { setFileData([]); setHeaders([]); }} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Clear</button>
          )}
        </div>
        
        <div className="relative z-10">
          <label className="flex flex-col items-center justify-center py-2 cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all">
            <FileUp className={`w-6 h-6 mb-1 ${isDragActive ? 'text-indigo-500 animate-bounce' : 'text-indigo-300'}`} />
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
              {isDragActive ? 'Drop File' : 'Drag & Drop File'}
            </p>
            <input 
              type="file" 
              accept=".csv,.json" 
              onChange={handleFileChange} 
              className="hidden"
            />
          </label>
        </div>

        <AnimatePresence>
          {headers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-indigo-50 dark:border-gray-700 relative z-10"
            >
              <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Map Columns:</p>
              <div className="grid grid-cols-1 gap-2">
                {model.fields.map((field) => (
                  <div key={field.name} className="flex items-center justify-between bg-indigo-50/30 dark:bg-gray-900/30 p-2 rounded-lg border border-indigo-50/50 dark:border-gray-700">
                    <span className="text-[9px] font-black text-gray-700 dark:text-gray-200 uppercase tracking-wide">{field.name}</span>
                    <select
                      className="text-[10px] bg-white dark:bg-gray-700 border-none rounded p-1 focus:ring-2 focus:ring-indigo-100 outline-none font-black text-indigo-600 dark:text-indigo-300"
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
                className="w-full mt-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-[10px] font-black py-3 rounded-lg hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 uppercase tracking-widest"
              >
                {importing ? (
                  <span className="animate-pulse text-white">Importing...</span>
                ) : (
                  <>
                    <Database className="w-3 h-3 text-white" />
                    <span>Run Import</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
