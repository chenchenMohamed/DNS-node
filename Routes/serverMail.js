require('dotenv').config();
const nodemailer = require('nodemailer');
const express=require('express')
const router=express.Router()
const {User, validateModifierMotPasse} =require('../Models/userModel')
const {Commande, validateStatistiqueAdmin, validateClientCommande, validateCommentaires, validateRequestCommandes, validateCommandeSansClient} =require('../Models/commandeModel')


const jwt = require('jsonwebtoken');

const pdfTemplate5 = require('../documents5');
const pdfTemplate4 = require('../documents4');

//Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port: '465',
    ssl : true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


/*
let transporter = nodemailer.createTransport({
  host: 'smtp.ionos.fr',
  port: 587,
  auth: {
     user: 'info@dna-transport.fr',
     pass: 'Naseh8658!'
  }
});
*/

router.post('/notificationCourse/:id', async(req, res)=>{

  console.log("ce bon")

  let dateEnglaise = req.body.date

  let somme = ""  
  let pos1 = dateEnglaise.indexOf("-")
  somme += "/"+dateEnglaise.substr(0, pos1)
  dateEnglaise = dateEnglaise.substr(pos1+1, dateEnglaise.length)

  pos1 = dateEnglaise.indexOf("-")
  somme = "/"+dateEnglaise.substr(0, pos1) + somme
  dateEnglaise = dateEnglaise.substr(pos1+1, dateEnglaise.length)
  
  somme = dateEnglaise + somme

  let user={}

  let commande={}

  if(req.params.id != "0"){
    commande = await Commande.findById(req.params.id)

    console.log(commande)

    user = await User.findById(commande.client)
  }else{

    /*let mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: req.body.etat,
    //  html: pdfTemplate4(req.body)
      html: `<h1> n° = ${$req.body.num} </h1>`
    }
  
    // Step  3
    transporter.sendMail(mailOptions, function(err,data){
        if(err){
            console.log(err)
          return res.send({status:false})
        }else{  
          return res.send({status:true})
        }
    })
  */
    return
  }

  let  mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: req.body.etat,
    html: `<h1> n° = ${req.body.codeLivraison} </h1>`
  }

  let subject = ""
  if(req.body.etat == "Attente-Livraison"){

    subject = "Nouvelle course"
  
  }else if(req.body.etat == "Annuler avec refacturation"){
    
    subject = "Course annulée"
  
  }else{
    return
  }
  console.log("pas 1")
  mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: subject,
    html: `<p> n° : ${req.body.codeLivraison} </p> <p> Date de livraison : ${somme} </p> <p>  Nom et prénom du client : ${user.nom} </p> `
  }
  console.log("pas 2")
   // Step  3
  transporter.sendMail(mailOptions, function(err,data){
    if(err){
        console.log(err)
      return res.send({status:false})
    }else{  
      return res.send({status:true})
    }
  })
  console.log("pas 3")
  mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: subject,
    html: `<p> n° : ${req.body.codeLivraison} </p> <p> Date de livraison : ${somme} </p> <p>  Nom et prénom du client : ${user.nom} </p> `
  }
  console.log("pas 4")
   // Step  3
  transporter.sendMail(mailOptions, function(err,data){
    if(err){
        console.log(err)
      return res.send({status:false})
    }else{  
      return res.send({status:true})
    }
  })
  console.log("pas 5")
  let user2 = await User.findOne({username:commande.createur}); 

  if( user2.role != "admin" && user2.role != "client"){
    console.log("pas 6")
     mailOptions = {
       from: process.env.EMAIL,
       to: user2.email,
       subject: subject,
       html: `<p> n° : ${req.body.codeLivraison} </p> <p> Date de livraison : ${somme} </p> <p>  Nom et prénom du client : ${user.nom} </p> `
     }
     console.log("pas 7")
      // Step  3
     transporter.sendMail(mailOptions, function(err,data){
       if(err){
           console.log(err)
         return res.send({status:false})
       }else{  
         return res.send({status:true})
       }
     })
     console.log("pas 8")
  }


  return
 

})


router.post('/emailMotPasseEmail',async(req,res)=>{
   //step 2
  const {error}=validateModifierMotPasse(req.body)
  if(error) return res.send({status:false,message:error.details[0].message})

  
  let user = await User.findOne({email:req.body.email})

  if(user == null){
    return res.send({status:false})
  }

  let codeModificationString = ""
  let ok = false
  while(!ok){
    let nbrActivation1 = "00"
    for(let i = 0; i < 4; i++){
      nbrActivation1 += (Math.floor(Math.random() * 100000000000) + 900000000000)+"";
    }
    codeModificationString = nbrActivation1 + "" 
    
    let users = await User.findOne({codeForgotPassword:codeModificationString})

    if(users == null){
      ok = true
    }
  }

  await User.findByIdAndUpdate(user.id,{codeForgotPassword:codeModificationString})
  
  let url = req.body.baseUrl+"/"+codeModificationString;
  
  let mailOptions = {
       from: process.env.EMAIL,
       to: req.body.email,
       subject: "Nouveau mot de passe",
       html: ` 
          <div style='text-align:center;'> 

            <span style="font-size:20px; padding:5px; font-weight:700; width:100%;"> Bonjour !! </span> 
            <br> 
            <span style="color:#fe5723; font-size:17px; padding:5px; font-weight:500; width:100%;"> Bienvenue Chez DNA Transport </span> <br> 
       
            <p>Nous avons récemment reçu une demande de récupération du compte ${req.body.email}. </p>
            <p> Si vous ne vous êtes pas connecté récemment, vous devez immédiatement modifier votre mot de passe.</p>

            <button style=" background-color: #fe5723; /* Green */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px; border-radius:25px;">

            <a style='font-size:15px; padding:5px; font-weight:500; color:white;' href="${url}" > Cliquez ici pour modifier votre Mot de passe !!</a> 
            </button> 
          </div>`
  }
   
  // Step  3
  transporter.sendMail(mailOptions, function(err,data){
       if(err){
         return res.send({status:false})
       }else{
         return res.send({status:true})
       }
  })
  
})

router.post('/emailTest',async(req,res)=>{
    //step 2
    var message = " sdssfdsdf ";
   
    let mailOptions = {
        from: process.env.EMAIL,
        to: 'chenchenmohamedhedi@gmail.com',
        subject: req.body.subject,
        text: message
    }
    
    
    // Step  3
    transporter.sendMail(mailOptions, function(err,data){
        if(err){
            console.log(err)
          return res.send({status:false})
        }else{  
          return res.send({status:true})
        }
    })
   
})

router.post('/emailValidation',async(req,res)=>{
 
  
   var message = " Bonjour :" +req.body.nom+ " \r\n Bienvenue Chez Errahma Stores \r\n SVP, validez votre compte par c'est url : "+req.body.url;
  
   let mailOptions = {
       from: process.env.EMAIL,
       to: req.body.email,
       subject: "Validation",
       html: ` <div style='text-align:center;'> <span style="font-size:20px; padding:5px; font-weight:500; width:100%;"> Bonjour ${req.body.nom}! </span> <br> <span style="font-size:17px; padding:5px; font-weight:500; width:100%;"> Bienvenue Chez dna-transport </span> <br> <button> <a style='font-size:15px; padding:5px; font-weight:500;' href=${req.body.url} > Valider Votre Compte </a> </button> </div>`
   }
   
    // Step  3
   transporter.sendMail(mailOptions, function(err,data){
       if(err){
         return res.send({status:false})
       }else{
         return res.send({status:true})
       }
   })

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

module.exports.routerServerMail=router
