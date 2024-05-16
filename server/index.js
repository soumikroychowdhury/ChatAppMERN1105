const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const userRoutes=require('./routes/userRoutes');
const messagesRoute=require('./routes/messagesRoute');
const app=express()
require('dotenv').config()
app.use(cors());
app.use(express.json());
app.use('/api/auth',userRoutes);
app.use('/api/message',messagesRoute);
mongoose.connect(process.env.url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB connected successfully");
}).catch((err)=>{
    console.log(err.message);
});
const server=app.listen(process.env.port,()=>{
    console.log(`Server is running on port: ${process.env.port}`)
})