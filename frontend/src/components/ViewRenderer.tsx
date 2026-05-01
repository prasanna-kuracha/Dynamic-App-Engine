'use client';

import React, { useState } from 'react';
import { ViewDef, ModelDef } from '@/shared/schema';
import { fetchData, createData } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataImport } from './DataImport';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { Plus, List, Calendar as CalendarIcon, Check, X, Search, Download, Database } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ViewRendererProps {
  view: ViewDef;
  model: ModelDef;
}

export const ViewRenderer: React.FC<ViewRendererProps> = ({ view, model }) => {
  if (view.type === 'dashboard') {
    return <DashboardView view={view} model={model} />;
  }
  if (view.type === 'table') {
    return <TableView view={view} model={model} />;
  }
  if (view.type === 'form') {
    return <FormView view={view} model={model} />;
  }
  return <div>Unknown view type: {view.type}</div>;
};

const DashboardView: React.FC<{ view: ViewDef; model: ModelDef }> = ({ view, model }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['data', model.name],
    queryFn: () => fetchData(model.name),
  });

  if (isLoading) return <div className="p-8 text-center text-indigo-400 font-medium animate-pulse">Loading Analytics...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-black text-indigo-950 dark:text-white tracking-tight">{view.title}</h2>
          <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-1">Real-time Performance Metrics</p>
        </div>
      </div>
      <AnalyticsDashboard data={data || []} modelName={model.name} />
    </div>
  );
};

const TableView: React.FC<{ view: ViewDef; model: ModelDef }> = ({ view, model }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data', model.name],
    queryFn: () => fetchData(model.name),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  if (isLoading) return <div className="p-8 text-center text-indigo-400 font-medium animate-pulse">Fetching your data...</div>;
  if (error) return <div className="p-8 text-center text-red-400">Error loading data</div>;

  const columns = (view as any).columns || model.fields.map(f => f.name);

  // Filter logic
  const filteredData = data?.filter((item: any) => {
    const matchesSearch = columns.some((col: string) => 
      String(item[col] || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterStatus === 'all') return matchesSearch;
    const isCompleted = item.completed === true || String(item.completed).toLowerCase() === 'true';
    return matchesSearch && (filterStatus === 'completed' ? isCompleted : !isCompleted);
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`${view.title} - Export`, 14, 15);
    
    const tableRows = filteredData?.map((item: any) => columns.map((col: string) => item[col] || '-'));
    
    (doc as any).autoTable({
      head: [columns.map((c: string) => c.toUpperCase())],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8, font: 'helvetica' },
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] },
    });
    
    doc.save(`${model.name}_export.pdf`);
    toast.success('PDF Exported Successfully!');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Records");
    XLSX.writeFile(wb, `${model.name}_export.xlsx`);
    toast.success('Excel Exported Successfully!');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-100/30 overflow-hidden border border-indigo-50 dark:border-gray-700 flex flex-col max-h-[75vh]">
        <div className="p-6 border-b border-indigo-50 dark:border-gray-700 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-gradient-to-r from-indigo-50/50 to-transparent flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <List className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-indigo-950 dark:text-white tracking-tight">{view.title}</h3>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{filteredData?.length || 0} Records Found</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
              <input 
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-white dark:bg-gray-700 border-2 border-indigo-50 dark:border-gray-600 rounded-xl text-sm font-bold focus:border-indigo-400 outline-none transition-all dark:text-white"
              />
            </div>

            {/* Filter Toggle */}
            <select 
              value={filterStatus}
              onChange={(e: any) => setFilterStatus(e.target.value)}
              className="h-11 px-4 bg-white dark:bg-gray-700 border-2 border-indigo-50 dark:border-gray-600 rounded-xl text-sm font-bold focus:border-indigo-400 outline-none transition-all dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            {/* Export Actions */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleExportPDF}
                className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-900/20 rounded-xl transition-all shadow-sm"
                title="Export to PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button 
                onClick={handleExportExcel}
                className="p-3 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 dark:bg-emerald-900/20 rounded-xl transition-all shadow-sm"
                title="Export to Excel"
              >
                <Database className="w-5 h-5" />
              </button>
            </div>

            <div className="h-8 w-[1px] bg-indigo-50 dark:bg-gray-700 hidden xl:block"></div>

            <div className="w-full xl:w-auto">
              <DataImport model={model} />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-indigo-50/80 dark:bg-gray-700 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                {columns.map(col => (
                  <th key={col} className="px-8 py-4 text-xs font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-[0.2em] border-b border-indigo-100 dark:border-gray-600">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/50 dark:divide-gray-700">
              {filteredData?.length === 0 ? (
                 <tr>
                   <td colSpan={columns.length} className="px-8 py-16 text-center text-indigo-300 italic font-bold">
                     {searchTerm ? `No results matching "${searchTerm}"` : "No records found."}
                   </td>
                 </tr>
              ) : filteredData?.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-all group">
                  {columns.map(col => {
                    const val = item[col];
                    const displayValue = (val === undefined || val === null || val === "") ? "-" : String(val);
                    
                    return (
                      <td key={col} className="px-8 py-4 whitespace-nowrap text-sm font-bold text-indigo-950/80 dark:text-gray-200">
                        {col === 'completed' ? (
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full w-fit text-[10px] font-black uppercase tracking-wider ${displayValue.toLowerCase() === 'true' || val === true ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {displayValue.toLowerCase() === 'true' || val === true ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            <span>{displayValue}</span>
                          </div>
                        ) : displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FormView: React.FC<{ view: ViewDef; model: ModelDef }> = ({ view, model }) => {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  const mutation = useMutation({
    mutationFn: (data: any) => createData(model.name, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data', model.name] });
      setFormValues({});
      toast.success(`${model.name} added successfully!`);
    },
    onError: () => {
      toast.error(`Failed to add ${model.name}`);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formValues);
    e.currentTarget.reset();
  };

  const fieldsToRender = view.fields || model.fields.map(f => f.name);

  return (
    <div className="bg-white/90 dark:bg-gray-800 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-purple-200/40 p-10 border border-purple-50 dark:border-gray-700 flex flex-col">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl shadow-inner">
          <Plus className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{view.title}</h3>
          <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Add New {model.name} Entry</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {fieldsToRender.map(fieldName => {
            const fieldDef = model.fields.find(f => f.name === fieldName);
            if (!fieldDef) return null;

            return (
              <div key={fieldName} className="space-y-2 group">
                <label className="block text-[10px] font-black text-indigo-950 dark:text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-500">
                  {fieldName}
                </label>
                <div className="relative">
                  {fieldDef.type === 'date' ? (
                    <div className="relative modern-datepicker-wrapper">
                      <DatePicker
                        selected={formValues[fieldName] ? new Date(formValues[fieldName]) : null}
                        onChange={(date: Date | null) => setFormValues({ ...formValues, [fieldName]: date?.toISOString().split('T')[0] })}
                        dateFormat="yyyy-MM-dd"
                        placeholderText={`Select ${fieldName}...`}
                        className="block w-full h-12 px-6 rounded-2xl border-2 border-indigo-50 bg-indigo-50/20 text-indigo-950 font-black text-sm focus:bg-white focus:border-indigo-400 focus:ring-8 focus:ring-indigo-100/50 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required={fieldDef.required}
                      />
                      <CalendarIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 pointer-events-none" />
                    </div>
                  ) : fieldDef.type === 'boolean' ? (
                     <div className="flex items-center space-x-4 h-12 px-6 rounded-2xl border-2 border-indigo-50 bg-indigo-50/20 dark:bg-gray-700 dark:border-gray-600">
                        <input
                          type="checkbox"
                          checked={formValues[fieldName] || false}
                          onChange={(e) => setFormValues({ ...formValues, [fieldName]: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 border-indigo-200 rounded-lg focus:ring-indigo-500"
                        />
                        <span className="text-sm font-black text-indigo-950/60 dark:text-gray-300 uppercase tracking-wide">Is Completed?</span>
                     </div>
                  ) : (
                    <input
                      name={fieldName}
                      type={fieldDef.type === 'number' ? 'number' : 'text'}
                      value={formValues[fieldName] || ''}
                      onChange={(e) => setFormValues({ ...formValues, [fieldName]: e.target.value })}
                      placeholder={`Enter ${fieldName}...`}
                      required={fieldDef.required}
                      className="block w-full h-12 px-6 rounded-2xl border-2 border-indigo-50 bg-indigo-50/20 text-indigo-950 font-black text-sm placeholder-indigo-200 focus:bg-white focus:border-indigo-400 focus:ring-8 focus:ring-indigo-100/50 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-base shadow-2xl shadow-indigo-300/40 hover:shadow-indigo-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-3 uppercase tracking-widest"
        >
          {mutation.isPending ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Submit Record</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
