const {Schema,model, modelNames} = require("mongoose")

const MessageSchema = new Schema({
    test:String,
    sender:String,
    room:String,
})

module.exports = model("Message",MessageSchema)