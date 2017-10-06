module.exports = {
    db: {
        provider: "mongodb",
        connection: process.env.DATABASE_URL
    },
    localDB : {
        provider: "mongodb",
        connection: "mongodb://localhost:27017/micro_api"
    },
    port_number: 3000,
    jwtSecretKey: "thisismysecretkey123638572638"
};

