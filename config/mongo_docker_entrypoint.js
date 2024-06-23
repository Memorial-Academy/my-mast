db = db.getSiblingDB("admin")
console.log(process.env)
console.log(db)
db.createUser({
    user: process.env.MONGO_USER,
    pwd: process.env.MONGO_PASSWORD,
    roles: [
        { role: "readWrite", db: "auth" }
    ]
})