const mongoose = require("mongoose")
const { Telegraf , Composer } = require('micro-bot')

//custom model
const userModel = require('./model/userModel')
const withdrawlModel = require('./model/withdrawModel')


const bot = new Composer()


// db connection
mongoose.connect('mongodb+srv://rasedul20:rasedul20@cluster0.ax9se.mongodb.net/airdropBot?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true}).catch((e)=>{
        console.log(e)
}).then((d)=>console.log('Database connected')).catch((e)=>console.log(e))



bot.start(ctx=>{

    const userQuery = {
        userId: ctx.from.id
    }
    userModel.find(userQuery , (e,data)=>{
        if (e) {
            console.log(e)
        } else {
            const hasUser = data.length
            if (hasUser >0 ) {
                ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name} \nWellcome to ${ctx.botInfo.username} \n\nAccount information: \nUserId: ${data[0].userId} \nName: ${data[0].name}` , {
                    reply_markup:{
                        keyboard: [
                            [{text: "Withdraw"},{text: "My account"}],
                            [{text: "Help"}]
                        ],
                        resize_keyboard: true
                    }
                }).catch((e)=>console.log(e))
            } else {
                ctx.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name} \n\nWe are very sorry we could not find you our database \nPlease join our airdrop first \n\nThank you using ${ctx.botInfo.username}`).catch((e)=>console.log(e))
            }
        }
    })

})



bot.hears("Back",ctx=>{

    const userQuery = {
        userId: ctx.from.id
    }
    userModel.find(userQuery , (e,data)=>{
        if (e) {
            console.log(e)
        } else {
            const hasUser = data.length
            if (hasUser >0 ) {
                ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name} \n\nAccount information: \nUserId: ${data[0].userId} \nName: ${data[0].name}` , {
                    reply_markup:{
                        keyboard: [
                            [{text: "Withdraw"},{text: "My account"}],
                            [{text: "Help"}]
                        ],
                        resize_keyboard: true
                    }
                }).catch((e)=>console.log(e))
            } else {
                ctx.telegram.sendMessage(ctx.chat.id, `Hello ${ctx.from.first_name} \n\nWe are very sorry we could not find you our database \nPlease join our airdrop first \n\nThank you using ${ctx.botInfo.username}`).catch((e)=>console.log(e))
            }
        }
    })

})

bot.hears("My account",ctx=>{

    const userQuery = {
        userId: ctx.from.id
    }
    userModel.find(userQuery , (e,data)=>{
        if (e) {
            console.log(e)
        } else {
            const hasUser = data.length
            if (hasUser >0 ) {
                ctx.telegram.sendMessage(ctx.chat.id , `Hello ${ctx.from.first_name} \n\nAccount information: \nUserId: ${data[0].userId} \nName: ${data[0].name} \nBalance: ${data[0].balance} \nYour referral: ${data[0].referralCount} \nWallet: ${data[0].wallet}` , {
                    reply_markup:{
                        keyboard: [
                            [{text: "Back"}]
                        ],
                        resize_keyboard: true
                    }
                }).catch((e)=>console.log(e))
            }
        }
    })

})


bot.hears("Withdraw", ctx=>{

    const userQuery = {
        userId: ctx.from.id
    }
    userModel.find(userQuery , (e,data)=>{
        if (e) {
            console.log(e)
        } else {
            const hasUser = data.length
            if (hasUser >0 ) {
                ctx.telegram.sendMessage(ctx.chat.id , ` If you want to withdraw your balance then tap on withdraw request \n\nAccount information: \nUserId: ${data[0].userId} \nName: ${data[0].name} \nBalance: ${data[0].balance} \nYour referral: ${data[0].referralCount} \nWallet: ${data[0].wallet}` , {
                    reply_markup:{
                        keyboard: [
                            [{text: "Withdraw Request"},{text: "Back"}]
                        ],
                        resize_keyboard: true
                    }
                }).catch((e)=>console.log(e))
            }
        }
    })

})


bot.hears('Withdraw Request' , ctx=>{

    const userQuery = {
        userId: ctx.from.id
    }
    userModel.find(userQuery , (e,data)=>{
        if (e) {
            console.log(e)
        } else {
            const hasUser = data[0].length
            if (hasUser >0 ) {

                const userId = ctx.from.id
                const name = data[0].name
                const wallet = data[0].wallet
                const balance = data[0].balance

                const bl = parseFloat(balance)

                if (bl > 0) {

                    const withdrawData = new withdrawlModel({
                        userId: userId,
                        name: name,
                        withdrawl_balance: balance,
                        wallet: wallet
                    })
    
                    withdrawData.save((e)=>{
                        if (e) {
                            console.log(e)
                        } else {
                            
                            userModel.updateOne({userId: ctx.from.id} , {balance : 0} , (e)=>{
                                if (e) {
                                    console.log(e)
                                }else{
                                    ctx.telegram.sendMessage(ctx.chat.id , `Your withdraw request has been sucessfully submited` , {
                                        reply_markup:{
                                            keyboard: [
                                                [{text: "Back"}]
                                            ],
                                            resize_keyboard: true
                                        }
                                    }).catch((e)=>console.log(e))
                                }
                            })
                        }
                    })
                    
                } else {
                    

                    ctx.telegram.sendMessage(ctx.chat.id , `Sorry, You have not enough balance to withdraw` , {
                        reply_markup:{
                            keyboard: [
                                [{text: "Back"}]
                            ],
                            resize_keyboard: true
                        }
                    }).catch((e)=>console.log(e))

                }

            }
        }
    })
})

bot.hears('Help',ctx=>{
    ctx.telegram.sendMessage(ctx.chat.id , `<b>If you need help</b> \n\n Please join our <a href="https://t.me/amdg_global">Telegram group</a> \nOr\n Join our <a href="https://t.me/AMDGCommunityID">Telegram community</a> \n\nThen tap on button next` , {
        reply_markup: {
            keyboard:[
                [{text: "Back"}]
            ],
            resize_keyboard: true
        },
        parse_mode: "HTML"
    }).catch((e)=>console.log(e))
})






module.exports = bot