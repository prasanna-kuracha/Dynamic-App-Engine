'use client';

import React, { useState } from 'react';
import { ViewDef, ModelDef } from '@/shared/schema';
import { fetchData, createData } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataImport } from './DataImport';
import { Plus, List, Calendar as CalendarIcon, Check, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface ViewRendererProps {
  view: ViewDef;
  model: ModelDef;
}

export const ViewRenderer: React.FC<ViewRendererProps> = ({ view, model }) => {
  if (view.type === 'table') {
    return <TableView view={view} model={model} />;
  }
  if (view.type === 'form') {
    return <FormView view={view} model={model} />;
  }
  return <div>Unknown view type: {view.type}</div>;
};

const TableView: React.FC<{ view: ViewDef; model: ModelDef }> = ({ view, model }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data', model.name],
    queryFn: () => fetchData(model.name),
  });

  if (isLoading) return <div className="p-8 text-center text-indigo-400 font-medium animate-pulse">Fetching your data...</div>;
  if (error) return <div className="p-8 text-center text-red-400">Error loading data</div>;

  const columns = view.columns || model.fields.map(f => f.name);

  return (
    <div className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm rounded-3xl shadow-2xl shadow-indigo-100/30 overflow-hidden border border-indigo-50 flex flex-col max-h-[75vh]">
      <div className="p-6 border-b border-indigo-50 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-50/50 to-transparent flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl">
            <List className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-indigo-950 dark:text-white tracking-tight">{view.title}</h3>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{data?.length || 0} Records Found</p>
          </div>
        </div>
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <DataImport model={model} />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-indigo-50/80 dark:bg-gray-700 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-8 py-4 text-xs font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50/50 dark:divide-gray-700">
            {data?.length === 0 ? (
               <tr>
                 <td colSpan={columns.length} className="px-8 py-16 text-center text-indigo-300 italic font-bold">No records found. Start by adding one or importing data!</td>
               </tr>
            ) : data?.map((item: any, idx: number) => (
              <tr key={idx} className="hover:bg-indigo-50/40 transition-all group">
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
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formValues);
    e.currentTarget.reset();
  };

  const fieldsToRender = view.fields || model.fields.map(f => f.name);

  return (
    <div className="bg-white/90 dark:bg-gray-800 backdrop-blur-md rounded-[2.5rem] shadow-2xl shadow-purple-200/40 p-10 border border-purple-50 flex flex-col">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-purple-100 rounded-2xl shadow-inner">
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
                     <div className="flex items-center space-x-4 h-12 px-6 rounded-2xl border-2 border-indigo-50 bg-indigo-50/20">
                        <input
                          type="checkbox"
                          checked={formValues[fieldName] || false}
                          onChange={(e) => setFormValues({ ...formValues, [fieldName]: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 border-indigo-200 rounded-lg focus:ring-indigo-500"
                        />
                        <span className="text-sm font-black text-indigo-950/60 uppercase tracking-wide">Is Completed?</span>
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


