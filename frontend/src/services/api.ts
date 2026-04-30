const API_BASE_URL = 'http://localhost:5002/api';

export const fetchConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/config`);
  if (!response.ok) throw new Error('Failed to fetch config');
  return response.json();
};

export const fetchData = async (modelName: string) => {
  const response = await fetch(`${API_BASE_URL}/data/${modelName}`);
  if (!response.ok) throw new Error(`Failed to fetch data for ${modelName}`);
  return response.json();
};

export const createData = async (modelName: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/data/${modelName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create data for ${modelName}`);
  return response.json();
};
