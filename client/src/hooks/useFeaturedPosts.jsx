import { useEffect, useState } from 'react';
import api from '../lib/api';

// Fetches posts flagged as "featured" in the admin panel, across all categories.
const useFeaturedPosts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchFeatured = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get('/featured', { signal: controller.signal });
                const payload = res.data;
                setData(Array.isArray(payload) ? payload : payload.data ?? []);
            } catch (err) {
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
        return () => controller.abort();
    }, []);

    return { data, loading, error };
};

export default useFeaturedPosts;
