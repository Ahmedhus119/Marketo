import { useState, useCallback, useEffect, useRef } from 'react';

// useFetch Hook - for data fetching
export function useFetch<T>(url: string, options?: RequestInit) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const json = await response.json();
                if (isMounted) setData(json);
            } catch (err) {
                if (isMounted) setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, options]);

    return { data, loading, error };
}

// useForm Hook - for form state management
export function useForm<T>(initialValues: T) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    }, []);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setTouched(prev => ({
            ...prev,
            [e.target.name]: true,
        }));
    }, []);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    const setFieldError = useCallback((field: keyof T, error: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: error,
        }));
    }, []);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        resetForm,
        setFieldError,
        setValues,
    };
}

// useLocalStorage Hook - for localStorage persistence
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue] as const;
}

// useAsync Hook - for async operations
export function useAsync<T>(
    asyncFunction: () => Promise<T>,
    immediate = true
) {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [value, setValue] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setValue(null);
        setError(null);
        try {
            const response = await asyncFunction();
            setValue(response);
            setStatus('success');
            return response;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            setStatus('error');
            throw err;
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, value, error };
}

// useDebounce Hook - for debounced values
export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

// usePrevious Hook - to track previous value
export function usePrevious<T>(value: T) {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

// useToggle Hook - for boolean state
export function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue(v => !v);
    }, []);

    return [value, toggle] as const;
}

// usePagination Hook - for pagination
export function usePagination<T>(items: T[], itemsPerPage: number) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        goToPage,
    };
}