export function formatCurrency(value: number, currency: string = 'EGP'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(value);
}

export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatTimeAgo(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (secondsAgo < 60) return 'Just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;

    return formatDate(d);
}

export function truncateText(text: string, length: number = 100): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    feedback: string[];
} {
    const feedback: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (password.length < 8) {
        feedback.push('Password must be at least 8 characters long');
    } else if (password.length < 12) {
        strength = 'medium';
    } else {
        strength = 'strong';
    }

    if (!/[A-Z]/.test(password)) {
        feedback.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        feedback.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        feedback.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
        feedback.push('Password should contain at least one special character');
    }

    return {
        isValid: feedback.length === 0,
        strength,
        feedback,
    };
}

export function validatePhone(phone: string): boolean {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
}

export function calculateDiscount(original: number, discounted: number): number {
    if (original === 0) return 0;
    return Math.round(((original - discounted) / original) * 100);
}

export function calculateTotalPrice(items: any[]): number {
    return items.reduce((total, item) => {
        const price = item.priceAfterDiscount || item.price || 0;
        return total + price * (item.quantity || 1);
    }, 0);
}

export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...arr].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (typeof aVal === 'string') {
            return order === 'asc'
                ? (aVal as string).localeCompare(bVal as string)
                : (bVal as string).localeCompare(aVal as string);
        }

        if (typeof aVal === 'number') {
            return order === 'asc'
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
        }

        return 0;
    });
}

export function filterByMultiple<T>(
    arr: T[],
    filters: Record<keyof T, any>
): T[] {
    return arr.filter(item =>
        Object.entries(filters).every(([key, value]) => {
            if (value === undefined || value === null) return true;
            return item[key as keyof T] === value;
        })
    );
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
}

export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export async function retryRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
    throw new Error('Failed after retries');
}

export function isClient(): boolean {
    return typeof window !== 'undefined';
}

export function isServer(): boolean {
    return typeof window === 'undefined';
}

export function getQueryParams(): Record<string, string> {
    if (!isClient()) return {};

    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

export function buildQueryUrl(baseUrl: string, params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.set(key, String(value));
        }
    });
    return `${baseUrl}${query.toString() ? '?' + query.toString() : ''}`;
}