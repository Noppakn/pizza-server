const express = require("express");
const app = express();
const pool = require("./db")
const port = process.env.PORT || 3001;
const cors = require("cors")

app.use(express.json())
app.use(
    cors({
        origin: "*"
    })
)

//ROUTES//

//get all
app.get("/menu", async(req, res) => {
    try {
        const menu = await pool.query("SELECT * FROM menu")
        res.json(menu.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get("/promotion", async(req, res) => {
    try {
        const menu = await pool.query("SELECT * FROM promotion")
        res.json(menu.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.get("/admin-order", async(req,res) => {
    try {
        const me = await pool.query("SELECT * FROM custorder")
        res.json(me.rows)
    } catch(error) {
        console.error(error.message)
    }
})

app.listen(port, () => {
    console.log("Start at port ", port)
})
// update
app.put("/menu/:id", async (req,res) => {
    try {
        const { id } = req.params;
        const { out } = req.body;

        const update = await pool.query(
            "UPDATE menu set out_of_stock =$1 WHERE food_id = $2",[out,id]
        )
        res.json("Update!")
    } catch (error) {
        console.error(error.message)
    }
})
//login 
app.post("/login", async (req,res) => {
    try {
        const data = req.body;
        const login_info = await pool.query(
            "SELECT * FROM user_info WHERE (username = $1) and (password = $2)",[data.username, data.password]
        )
        if (login_info.rows.length === 1){
            res.json(login_info.rows)
        }
        else
        {
            res.json(false)
            }
    } catch (error) {
        console.error(error.message)
    }
})
// get-all
app.get("/user", async(req,res) => {
    try {
        const user = await pool.query("SELECT * FROM user_info")
        res.json(user.rows)
    } catch (error) {
        console.error(error.message)
    }
})
//Register 

app.post("/loginn", async (req,res) => {
    try {
        const data = req.body;
        const exists = await pool.query(
            "SELECT username FROM user_info WHERE (username = $1) and (password = $2)",[data.username, data.password]
        )
        if (exists.rows.length === 1){
        res.json("this username is already exists")
        }
        else
        {
            const insert = await pool.query(
                            "INSERT INTO user_info (username , password, role) VALUES ($1, $2, $3)",[data.username, data.password, data.role]
                        )
                        if (insert){
                        res.json("Registeration Success")
                        }
                        else
                        {
                            res.json("Registeration  failed")
                            }
            }
    } catch (error) {
        console.error(error.message)
    }
})

//Change password

app.put("/login", async (req,res) => {
    try {
        const  body  = req.body;
        const old_password = await pool.query(
            "SELECT password FROM user_info WHERE (username = $1) and (password = $2)",[body.username, body.password]
        )
        if (old_password.rows.length === 1){
         const update = await pool.query(
           "UPDATE user_info SET password = $1 WHERE  username = $2",[body.newpassword,body.username]
        )
        res.json(" Password has been Updated!")
        }
        else{
            res.json("user or password doesn't match")
        }
    } catch (error) {
        console.error(error.message)
    }
})
app.put("/loginn", async (req,res) => {
    try {
        const  body  = req.body;
        
         const update = await pool.query(
           "UPDATE user_info SET role = $1 WHERE  username = $2",[body.role,body.username]
        )
        res.json("Updated!")
        
    } catch (error) {
        console.error(error.message)
    }
})

// status_order
app.put("/update-admin-order", async (req,res) => {
    try {
        const  body  = req.body;
        const update = await pool.query(
            `
            UPDATE public.custorder
            SET order_status= $1, menu = $2
            WHERE order_id = $3;
            `,[body.order_status,body.menu,body.order_id]
            
        )
        res.json("Update!")
    } catch (error) {
        console.error(error.message)
    }
})

//post
app.post("/create-order", async (req, res) => {
    try {
        const order = req.body
        const insert = await pool.query (
            `
            INSERT INTO public."custorder" ("table","total","menu") 
            VALUES ($1,$2,$3)
            `,[order.table, order.total, order.menu]
        )
        res.json("Create!")
    } catch (error) {
        console.error(error.message)
    }
})

//get table
app.get("/table-info", async(req, res) => {
    try {
        const menu = await pool.query("SELECT * FROM shop_info")
        res.json(menu.rows)
    } catch (error) {
        console.error(error.message)
    }
})
app.put("/update-table-info", async(req, res) => {
    try {
        const data = req.body
        const update = await pool.query(
            `
            UPDATE public.shop_info
	        SET status=$1
	        WHERE "table" = $2; 
            `,[data.status,data.table]
        )
    } catch (error) {
        console.error(error.message)
    }
})

// delete 
app.delete("/delete-order", async(req, res) => {
    const data = req.body
    const si = await pool.query(
        `
        DELETE FROM public.custorder
        WHERE "table" = $1;
        `,[data.table]
    )
})

// delete user
app.delete("/delete-user", async(req, res) => {
    const data = req.body
    await pool.query(
        `
        DELETE FROM user_info
        WHERE username = $1;
        `,[data.username]
    )
    console.log("delete!")
})

app.put("/update-table-infoo", async(req, res) => {
    try {
        const data = req.body
        const update = await pool.query(
            `
            UPDATE public.shop_info
	        SET sta=$1
	        WHERE "table" = $2; 
            `,[data.sta,data.table]

        )
        res.json("Updated!")
    } catch (error) {
        console.error(error.message)
    }
})
// 
app.post("/insert-menu", async(req, res) => {
    try {
        const data = req.body
        const insert = await pool.query(
            `
            INSERT INTO menu ("food","price") 
            VALUES ($1,$2)
            `,[data.food,data.price]
        )
        res.json("Updated!")
    } catch (error) {
        console.error(error.message)
        
    }
})
app.delete("/delete-menu", async(req, res) => {
    
    try {
        const data = req.body
    await pool.query(
        `
        DELETE FROM menu
        WHERE food = $1;
        `,[data.food]
    )
    console.log("delete!")
    } catch (error) {
        console.error(error.message)
    }
})
app.post("/insert-pro", async(req, res) => {
    try {
        const data = req.body
        const insert = await pool.query(
            `
            INSERT INTO promotion ("food","price","description") 
            VALUES ($1,$2,$3)
            `,[data.food,data.price,data.description]
        )
        res.json("Updated!")
    } catch (error) {
        console.error(error.message)
        
    }
})
app.delete("/delete-pro", async(req, res) => {
    
    try {
        const data = req.body
    await pool.query(
        `
        DELETE FROM promotion
        WHERE food = $1;
        `,[data.food]
    )
    console.log("delete!")
    } catch (error) {
        console.error(error.message)
    }
})


