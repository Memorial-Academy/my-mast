export const Fetch = {
    getJSON: async (url: string, endpoint: string): Promise<any | FetchError> => {
        let req = await fetch(`${url}/${endpoint}`, {
            method: "GET"
        })
    
        if (req.status != 200) {
            return {
                code: req.status,
                error_msg: await req.text()
            }
        }
    
        return await req.json();
    },
    
    postJSON: async (url: string, endpoint: string, json: {
        [key: string]: any
    }): Promise<any | FetchError> => {
        let req = await fetch(`${url}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        })
    
        if (req.status != 200) {
            return {
                code: req.status,
                error_msg: await req.text()
            }
        }
    
        return await req.json();
    }
}