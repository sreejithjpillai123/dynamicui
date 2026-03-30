import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';

export function useBlocks(endpoint) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/${endpoint}`);
      setBlocks(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch blocks');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  return { blocks, setBlocks, loading, error, refetch: fetchBlocks };
}

export const blocksApi = {
  getAdmin:   ()        => axios.get(`${API}/admin/blocks`),
  getClient:  ()        => axios.get(`${API}/client/blocks`),
  create:     (data)    => axios.post(`${API}/admin/blocks`, data),
  update:     (id, data) => axios.put(`${API}/admin/blocks/${id}`, data),
  delete:     (id)      => axios.delete(`${API}/admin/blocks/${id}`),
  toggle:     (id)      => axios.patch(`${API}/admin/blocks/${id}/toggle`),
  reorder:    (ids)     => axios.put(`${API}/admin/blocks/reorder`, { orderedIds: ids }),
};
