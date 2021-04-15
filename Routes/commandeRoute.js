const {Commande, validateClientCommande, validateAdminCommande, validateRequestCommandes} =require('../Models/commandeModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');
const {User} =require('../Models/userModel');

var dateFormat = require('dateformat');

router.post('/newCommande',  verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "client") return res.status(403).send({status:false})
    
    const {error}=validateClientCommande(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const nbr = await Commande.count({});
    const num = nbr + 1;
   
    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd");
    let timeCurrent = dateFormat(new Date(), "HH:MM");
    let dateTimeCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    
    const commande=new Commande({
        client:req.user.user.id,
        colis:req.body.colis,
        etat:req.body.etat,
        num:num,
        numClient:req.user.user.num,
        isOpenAdmin:0,
        isOpenClient:1,
        adresseDepart:req.body.adresseDepart,
        adresseArrive:req.body.adresseArrive,
        date:req.body.date,
        heure:req.body.heure,
        minute:req.body.minute,
        createdDate:dateCurrent,
        createdTime:timeCurrent,
        updatedDate:dateTimeCurrent
    },)

    const result=await commande.save()
    return res.send({status:true,resultat:result})
})


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

router.post('/modifierCommande/:idCommande', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin" ) return res.status(400).send({status:false})

    const {error}=validateAdminCommande(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})

    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
  
    const result=await Commande.findByIdAndUpdate(req.params.idCommande,
        {
            colis:req.body.colis,
            facture:req.body.facture,
            adresseDepart:req.body.adresseDepart,
            adresseArrive:req.body.adresseArrive,
            date:req.body.date,
            heure:req.body.heure,
            minute:req.body.minute,
            etat:req.body.etat, 
            isOpenAdmin:1,
            isOpenClient:0,
            updatedDate:dateCurrent
        })

    return res.send({status:true,resultat:result})
    
})


router.post('/commandes', verifytoken, async(req,res)=>{
   
    const {error}=validateRequestCommandes(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
   
    const options = {
        page: req.body.page,
        limit: req.body.limitPage,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            createdAt: -1 
        }
    };

    let filter = []

    if(req.body.etat != ""){
        filter.push({"etat":req.body.etat})
    }

    if(req.body.dateLivraison != ""){
        filter.push({"date":req.body.dateLivraison})
    }

    if(req.body.dateCreation != ""){
        filter.push({"createdDate":req.body.dateCreation})
    }

    if(req.user.user.role == "admin"){
  
        if(req.body.numClient != 0){
            filter.push({"numClient":req.body.numClient})
        }
    
    }else{
        filter.push({"client":req.user.user.id})
    }

    let filterGlobal = {}
    if(filter.length > 0){
        filterGlobal = {$and:filter}
    }

    const result=await Commande.paginate(filterGlobal, options)
    return res.send({status:true,resultat:result})

})

/*router.post('/listCommandes/:etat', verifytoken, async(req,res)=>{
  
    const options = {
        page: req.body.page,
        limit: req.body.limit,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            createdAt: -1 
        }
    };

    var etat = req.params.etat
    const etats = ["enAttent","annuler","livree"]

    var ok = false
    
    for(i = 0; i < etats.length; i++){
        if(etat == etats[i] ){
            ok = true
        }
    }

    if(!ok) return res.status(400).send({status:false})
    
    if(req.user.user.role == "admin"){
        const result=await Commande.paginate({etat:etat}, options)
        return res.send({status:true,resultat:result})
    }else if(req.user.user.role == "client"){
        const result=await Commande.paginate({etat:etat, client:req.user.user.id}, options)
        return res.send({status:true,resultat:result})
    }
    
})
*/

router.post('/listCommandesClient', verifytoken, async(req,res)=>{

    const options = {
        page: 1,
        limit: 10000,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            createdAt: -1 
        }
    };
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const commandes = await Commande.paginate({client:req.body.idClient},options)

    const client = await User.findOne({_id:req.body.idClient})

    client.password = ""

    return res.send({status:true, commandes:commandes, client:client})
    
})

router.post('/changeIsOpen', verifytoken, async(req,res)=>{
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const result=await Commande.findByIdAndUpdate(req.body.idCommande,{isOpen:"1"})
    return res.send({status:true,resultat:result})
    
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

module.exports.routerCommande=router
