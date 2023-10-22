class Data365 {
    constructor(private apiKey: string) { }

    async submitKeywordSearch(keyword: string) {
        const response = await fetch('https://api.data365.co/v1.1/linkedin/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: this.apiKey,
                keyword: keyword
            })
        });
        const data = await response.json();
        return data;
    }

    async checkSearchStatus(searchId: string) {
        const response = await fetch(`https://api.data365.co/v1.1/linkedin/search/${searchId}`, {
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

