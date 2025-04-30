export const GET = {
    json: async (url: string, endpoint: string, parameter?: string): Promise<any> => {
        let req = await fetch(`${url}/${endpoint}${parameter ? `/${parameter}` : ""}`, {
            method: "GET"
        })
    
        if (req.status != 200) {
            return {
                code: req.status,
                msg: await req.text()
            }
        } else {
            return await req.json();
        }    
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

        // console.log("content-type: " + req.headers.get("content-type") + "; status: " + req.status);
        if (req.headers.get("content-type") && req.headers.get("content-type")?.indexOf("text/plain") != -1) {
            return await req.text();
        } else {
            return await req.json();
        }
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