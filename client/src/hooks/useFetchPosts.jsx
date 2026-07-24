import { useEffect, useState } from 'react';
import api from '../lib/api';

const useFetchPosts = (category, page = 1, limit = 10) => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/${category}`, {
                    params: { page, limit },
                    signal: controller.signal,
                });
                // supports both new { data, total, totalPages } and legacy array shapes
                const payload = response.data;
                if (Array.isArray(payload)) {
                    setData(payload);
                    setTotal(payload.length);
                    setTotalPages(1);
                } else {
                    setData(payload.data ?? []);
                    setTotal(payload.total ?? 0);
                    setTotalPages(payload.totalPages ?? 0);
                }
            } catch (err) {
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
    }, [category, page, limit]);

    return { data, total, totalPages, loading, error };
};

export default useFetchPosts;
