const Message=require('../model/messageModel');
module.exports.addMessage=async(req,res,next)=>{
    try{
        const {from,to,message}=req.body;
        const data=await Message.create({message,users:[from,to],sender:from});
        if(data) return res.json({message:"Message added successfully to the database"});
        return res.json({message:"Failed to add message to the database"});
    }catch(e){
        next
    }
};
module.exports.getAllMessages=async(req,res,next)=>{
    try{
        const {from,to}=req.body;
        const messages=await Message.find({users:{$all:[from,to]}}).sort({updatedAt:1});
        const showMessages=messages.map((message)=>{
            return {fromSelf:message.sender.toString()===from,message:message.message.text};
        });
        res.json(showMessages);
    }catch(e){
        next(e);
    }
};