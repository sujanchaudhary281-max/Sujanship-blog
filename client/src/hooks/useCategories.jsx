import { useEffect, useState } from 'react';
import api from '../lib/api';

// Fetches the category list from the backend so the whole client
// (navbar, home feed, category pages) stays in sync with the admin panel.
const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/api/categories', { signal: controller.signal });
                // controller returns { data: [...] }; tolerate a bare array too
                const payload = res.data;
                setCategories(Array.isArray(payload) ? payload : payload.data ?? []);
            } catch (err) {
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        return () => controller.abort();
    }, []);

    return { categories, loading, error };
};

export default useCategories;
