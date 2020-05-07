const { NotificationHub } = require("./lib/index")
const nm = require("nodemailer")

var main = async () => { 
    var testAccount = await nm.createTestAccount()
    console.log(testAccount)
    const sender = new NotificationHub({
        ...testAccount.smtp,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })
    setTimeout(()=> sender.msgTemplate("T.HSBC.0002"),0)
    // sender.msgTemplate("T.HSBC.0002")
    setTimeout(()=> sender.msgTemplate("T.HSBC.0001"),0)
    setTimeout(()=> sender.sendMail("edward@hsbc.com.cn","This subject"),200) 
}

main()