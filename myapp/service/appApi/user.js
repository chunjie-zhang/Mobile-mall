const Router = require("koa-router");
let router = new Router();
const mongoose = require("mongoose");


router.get("/",async(ctx)=>{
   ctx.body = "用户首页";
})

router.post("/register",async(ctx)=>{
   const User = mongoose.model("User");
   let newUser = new User(ctx.request.body);
   await newUser.save().then(()=>{
      ctx.body={
         code:200,
         message:"注册成功",
      }
   }).catch(error=>{
      ctx.body = {
         code:500,
         message:error,
      }
   })
})

router.post('/login',async(ctx)=>{
   let loginUser = ctx.request.body
   console.log(loginUser)
   let userName = loginUser.userName
   let password = loginUser.password

   //引入User的model
   const User = mongoose.model('User')

   await User.findOne({userName:userName}).exec().then(async(result)=>{
       console.log(result)
       if(result){
           let newUser = new User()
           await newUser.comparePassword(password,result.password)
           .then(isMatch=>{
               ctx.body={code:200,message:isMatch}
           })
           .catch(error=>{
               console.log(error)
               ctx.body={code:500,message:error}
           })
       }else{
           ctx.body={code:500,message:'用户名不存在'}
       }
   }).catch(error=>{
       console.log(error)
       ctx.body={code:500,message:error}
   })

})

module.exports =router