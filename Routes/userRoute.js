const {User, validateNewPassowrd, validateLogin, validateUser, validateUpdateUser} =require('../Models/userModel')

const express=require('express')
const router=express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator'
};

router.post('/register',async(req,res)=>{
    
    const {error}=validateUser(req.body)
    if(error) return res.send({status:false,message:error.details[0].message})

    const emailExist = await User.findOne({ email: req.body.email});
    if(emailExist) return res.send({status:false,message:'errorRegister'})

    const usernameExist = await User.findOne({ username: req.body.username});
    if(usernameExist) return res.send({status:false,message:'errorRegister'})

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let role = "client";
    
    const admin = await User.findOne({ role: 'admin'});
    
    if (admin == null){
        role = "admin"
    }else{
        return res.send({status:false,message:'errorRegister'})
    }

    const nbr = await User.count({});
    const num = nbr + 1;

    const user=new User({
        nom:req.body.nom,
        num:num,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        adresse:req.body.adresse,
        role:role,
        prenom:req.body.prenom,
        email:req.body.email,
        password: hashPassword,
        
        lat: req.body.lat,
        lng: req.body.lng,
        
        username: req.body.username,
        entreprise: req.body.entreprise,
        numChef: req.body.numChef,
      
        carteIdentite: req.body.carteIdentite,
    })

    const result=await user.save()

    return res.send({status:true,resultat:result})
})

router.post('/registerClient',verifytoken, async(req,res)=>{

    
    if(req.user.user.role == "sousClient")
    return res.status(400).json('articleId expected');
  
    let role = "client";

    if(req.user.user.role == "client"){
         role="sousClient"
    }
    
    const {error}=validateUser(req.body)
    if(error) return res.send({status:false,message:error.details[0].message})

    const emailExist = await User.findOne({ email: req.body.email});
    if(emailExist) return res.send({status:false,message:'errorRegister'})

    const usernameExist = await User.findOne({ username: req.body.username});
    if(usernameExist) return res.send({status:false,message:'errorUpdateCompte4'})

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const nbr = await User.count({});
    const num = nbr + 1;

    const user=new User({
        nom:req.body.nom,
        
        num:num,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        adresse:req.body.adresse,
        role:role,
        prenom:req.body.prenom,
        email:req.body.email,
        password: hashPassword,
       
        lat: req.body.lat,
        lng: req.body.lng,
        
        username: req.body.username,
        entreprise: req.body.entreprise,
        numChef: req.user.user.num,
        chef: req.user.user.id,
        

        carteIdentite: req.body.carteIdentite,
    })

    const result=await user.save()

    return res.send({status:true,resultat:result})
})





router.post('/login',async(req,res)=>{
   
    const {error}=validateLogin(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    let user = await User.findOne({ email: req.body.email});
    
    if(!user){
        user = await User.findOne({ username: req.body.email});
    }
    
    if(!user) return res.send({status:false, message:'errorLogin'});

    if(user.isActive == 0 && user.role != "admin") return res.send({status:false, message:'errorLogin'});

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.send({status:false, message:'errorLogin'})    

    if(user.codeForgotPassword.length > 1){
        const result = await User.findByIdAndUpdate(user.id,{
            codeForgotPassword: ""
        })
    }

    jwt.sign({user}, 'secretkey', (err, token) => {
        res.json({status:true, email: user.email, token:token, role: user.role, user:user});
    });

})

router.post('/newPassword',async(req,res)=>{
   
    const {error}=validateNewPassowrd(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    if(req.body.code.length < 10){
        return res.send({status:false});
    }

    const user = await User.findOne({codeForgotPassword: req.body.code});
    if(user == null) return res.send({status:false});

    var hashPassword = ""
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(req.body.newPassword, salt);
     
    const result = await User.findByIdAndUpdate(user.id,{
        password: hashPassword,
        codeForgotPassword: ""
    })
         
     return res.send({status:true})
})


router.get('/detailsAdmin/:id', verifytoken, async(req,res)=>{
  
    if(!req.params.id && req.user.user.role == "sousClient")
    return res.status(400).json('articleId expected');
    
    const result=await User.findById(req.params.id)
    result.password = ""
    return res.send({status:true,resultat:result})
})


router.get('/details', verifytoken, async(req,res)=>{
  const result = await User.findById(req.user.user.id)
  result.password = ""
  return res.send({status:true,resultat:result})
})



router.post('/update', verifytoken, async(req,res)=>{

    const {error}=validateUpdateUser(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})

    

    if(req.body.email != req.user.user.email){
        return res.send({status:false,message:'errorUpdateCompte1'});
    }

    const users = await User.find({email:req.body.email})
    const user = users[0]
    const newUser = user


    if(users.length == 0) return res.send({status:false,message:'errorUpdateCompte1'});
    
    if(req.body.newEmail != null && req.body.newEmail != ""){
        const users2 = await User.find({email:req.body.newEmail})
        if(users2.length > 0 && req.body.email != req.body.newEmail) return res.send({status:false,message:'errorUpdateCompte2'});
        newUser.email = req.body.newEmail
    }

    const validationPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validationPassword) return res.send({status:false, message:'errorUpdateCompte3'});
    
    if(req.body.newPassword != null && req.body.newPassword != ""){
       var hashPassword = ""
       const salt = await bcrypt.genSalt(10);
       hashPassword = await bcrypt.hash(req.body.newPassword, salt);
       newUser.password = hashPassword
    }

    if(req.body.username != req.user.user.username){
        const users = await User.find({username:req.body.username})
        if(users.length > 0) return res.send({status:false,message:'errorUpdateCompte4'});
    }

    const result = await User.findByIdAndUpdate(req.user.user.id,{
        carteIdentite:req.body.carteIdentite,
        nom:req.body.nom,
        username:req.body.username,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        adresse:req.body.adresse,
        lat:req.body.lat,
        lng: req.body.lng,
        email:newUser.email,
        password: newUser.password,
        entreprise: req.body.entreprise
    })
        
    return res.send({status:true,resultat:result})

 
})


router.post('/updateAdmin/:id', verifytoken, async(req,res)=>{

    const {error}=validateUpdateUser(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})


    const users = await User.find({_id:req.params.id})
    
    
    if(users.length == 0) return res.send({status:false,message:'errorUpdateCompte1'});

    const user = users[0]

    if(req.body.email != user.email){
        return res.send({status:false,message:'errorUpdateCompte1'});
    }

    const newUser = user

   

    
    
    if(req.body.newEmail != null && req.body.newEmail != ""){
        const users2 = await User.find({email:req.body.newEmail})
        if(users2.length > 0 && req.body.email != req.body.newEmail) return res.send({status:false,message:'errorUpdateCompte2'});
        newUser.email = req.body.newEmail
    }

    const validationPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validationPassword) return res.send({status:false, message:'errorUpdateCompte3'});
    
    if(req.body.newPassword != null && req.body.newPassword != ""){
       var hashPassword = ""
       const salt = await bcrypt.genSalt(10);
       hashPassword = await bcrypt.hash(req.body.newPassword, salt);
       newUser.password = hashPassword
    }

    if(req.body.username != user.username){
        const users = await User.find({username:req.body.username})
        if(users.length > 0) return res.send({status:false,message:'errorUpdateCompte4'});
    }

    const result = await User.findByIdAndUpdate(user.id,{
        carteIdentite:req.body.carteIdentite,
        nom:req.body.nom,
        username:req.body.username,
        prenom:req.body.prenom,
        telephone:req.body.telephone,
        adresse:req.body.adresse,
        lat:req.body.lat,
        lng: req.body.lng,
        email:newUser.email,
        password: newUser.password,
        entreprise: req.body.entreprise
    })
        
    return res.send({status:true,resultat:result})

 
})


router.post('/listesClients', verifytoken, async(req,res)=>{

    //await User.deleteMany();
    
    const options = {
        page: req.body.page,
        limit: req.body.limit,
        customLabels: myCustomLabels,
        sort:{
            createdAt: -1 
        }
    };

    let filter = [{role:"client"}]

    if(req.body.search != undefined && req.body.search != "" ){
        filter.push({nom:{ $regex: '.*' + req.body.search + '.*' }})
    }

    if(req.body.num != undefined && req.body.num != 0){
        filter.push({num:req.body.num})
    }
    
    if(req.user.user.role != "admin"){
      return res.send({status:false})
    }

    let result = null
    if(filter.length == 1){
        result=await User.paginate({role:"client"}, options)
    }else{
        result=await User.paginate({$and:filter}, options)
    }
    
    
    return res.send({status:true,resultat:result})
})

router.post('/allClients', verifytoken, async(req,res)=>{
    //await User.deleteMany({role:"sousClient"});

    result=await User.find({role:"client"})
  
    return res.send({status:true,resultat:result})
})

router.post('/listesSousClients', verifytoken, async(req,res)=>{

    const options = {
        page: req.body.page,
        limit: req.body.limit,
        customLabels: myCustomLabels,
        sort:{
            createdAt: -1 
        }
    };

    let filter = [{role:"sousClient"},{numChef:req.user.user.num}]

    if(req.body.search != undefined && req.body.search != "" ){
        filter.push({nom:{ $regex: '.*' + req.body.search + '.*' }})
    }

    if(req.body.num != undefined && req.body.num != 0){
        filter.push({num:req.body.num})
    }
    
    if(req.user.user.role != "client"){
      return res.send({status:false})
    }

    let result = null
    if(filter.length == 1){
        result=await User.paginate({role:"sousClient"}, options)
    }else{
        result=await User.paginate({$and:filter}, options)
    }
    
    return res.send({status:true,resultat:result})
})


router.post('/ActiveClients/:id/:active', async(req,res)=>{
    
    const result = await User.findByIdAndUpdate(req.params.id,{
       isActive:req.params.active,  
    })
    
    return res.send({status:true,resultat:result, request:req.body})
  
})


router.post('/supprimerSousClients', verifytoken, async(req,res)=>{

    
    if(req.user.user.role != "client"){
      return res.send({status:false})
    }

    if(await User.findOneAndDelete({num:req.body.num})){
        return res.send({status:true})
    }else{
        return res.send({status:false.err})
    }

})

router.post('/supprimerClients', verifytoken, async(req,res)=>{

    
    if(req.user.user.role != "admin"){
      return res.send({status:false})
    }

    if(await User.findOneAndDelete({_id:req.body.id})){
        return res.send({status:true})
    }else{
        return res.send({status:false.err})
    }

})


function verifytoken(req, res, next){
    
    const bearerHeader = req.headers['authorization'];
      
    if(typeof bearerHeader !== 'undefined'){
    
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, 'secretkey', (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{
                req.user = authData;
                next();
            }
        });
    
    }else{
        res.sendStatus(401);
    }

}

module.exports.verifytoken=verifytoken
module.exports.routerUser=router
