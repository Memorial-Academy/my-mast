const MYMAST_URL = process.env.NODE_ENV === "production" ? {
    // production URLs
    CLIENT: "https://my.memorialacademy.org",
    ADMIN: "https://admin.memorialacademy.org",
    API: "https://api.memorialacademy.org"
} : {
    // development URLs
    CLIENT: "http://localhost:3000",
    ADMIN: "http://localhost:3001",
    API: "http://localhost:5000"
}

export default MYMAST_URL;