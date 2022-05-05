const Pool = require("pg").Pool;
const pool = new Pool({
    user : "ckqmsaoomwuuoy",
    password : "07707a0771969bd38d9ddc6a5a2151440b27c5fb55836b8d1eba8b379b722b66",
    host : "ec2-3-223-213-207.compute-1.amazonaws.com",
    database : "dbo8htt5h5143i",
    port : 5432,
    ssl : {
        rejectUnauthorized: false
    }
})

module.exports = pool;