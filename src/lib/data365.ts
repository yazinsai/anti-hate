const DAY = 24 * 60 * 60 * 1000;

class Data365 {
    constructor(private apiKey: string) { }

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
}

export default Data365;

