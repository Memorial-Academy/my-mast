export const GET = {
    json: async (url: string, endpoint: string, parameter?: string): Promise<any> => {
        let req = await fetch(`${url}/${endpoint}${parameter ? `/${parameter}` : ""}`, {
            method: "GET"
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


export const POST = {
    json: async (url: string, endpoint: string, json: {
        [key: string]: any
    }): Promise<any> => {
        let req = await fetch(`${url}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(json)
        })
    
        if (req.status != 200) {
            throw {
                code: req.status,
                msg: await req.text()
            }
        }
    
        return await req.json();
    },
    text: async (url: string, endpoint: string, data: string): Promise<any> => {
        let req = await fetch(`${url}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: data
        })
    
        if (req.status != 200) {
            throw {
                code: req.status,
                msg: await req.text()
            }
        }
    
        if (req.headers.get("Content-Type") == "application/json") {
            return await req.json();
        } else {
            return await req.text();
        }
    }
}