import type { Search } from "@/models/posts";

const DAY = 24 * 60 * 60 * 1000;

class Data365 {
    constructor(private apiKey: string) {
        if (!apiKey) {
            throw new Error('Data365 API key is required');
        }

        this.apiKey = apiKey;
    }

    async submitKeywordSearch(keyword: string, from_date: string = new Date(Date.now() - 1 * DAY).toISOString()) {
        const response = await fetch('https://api.data365.co/v1.1/linkedin/posts/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api_key': this.apiKey
            },
            body: JSON.stringify({
                keyword: keyword,
                from_date: from_date
            })
        });
        const data = await response.json();
        return data;
    }

    async getCachedPosts(keyword: string, from_date: string = new Date(Date.now() - 1 * DAY).toISOString()) {
        const response = await fetch(`https://api.data365.co/v1.1/linkedin/posts/search/cached?keyword=${keyword}&from_date=${from_date}`, {
            headers: {
                'Content-Type': 'application/json',
                'api_key': this.apiKey
            }
        });
        const data = await response.json();
        return data;
    }

    async getPosts(params: Partial<Search>, cursor: string = '') {
        // Filter falsy values from params
        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
        const response = await fetch(`https://api.data365.co/v1.1/linkedin/post/search/posts?access_token=${this.apiKey}&max_page_size=100&${new URLSearchParams(filteredParams as Record<string, string>)}&cursor=${cursor}`, {
            headers: {
                'Content-Type': 'application/json',
                'api_key': this.apiKey
            }
        });
        const data = await response.json();
        return data;
    }
}

export default new Data365(process.env.DATA365_API_KEY || '');

