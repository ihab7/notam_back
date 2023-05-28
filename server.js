const express  = require('express')
const cors = require('cors')
const app = express()
const router = require("./router")
const pool = require("./database")
app.listen(process.env.PORT || 5000,()=>{
  console.log("app running on port 5000")
})
app.use(express.json())
pool.connect((err)=>{
    if(err)console.log(err);
    else console.log("connected successfully!")});
  app.use(cors())
  app.use("/notams",router)
