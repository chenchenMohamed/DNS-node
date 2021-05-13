const {Commande, validateStatistiqueAdmin, validateClientCommande, validateCommentaires, validateRequestCommandes, validateCommandeSansClient} =require('../Models/commandeModel')
const {Contact, validateContact} =require('../Models/contactModel')
const {User} =require('../Models/userModel');


const pdf = require('html-pdf');

const pdfTemplate = require('../documents');


const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');

var dateFormat = require('dateformat');

router.post('/create-pdf', async(req, res)=>{

    let user = await User.findById(req.body.client)

    await pdf.create(pdfTemplate(req.body, user), {}).toFile('uploads/commande.pdf', (err) => {
        if(err){
            return res.send(Promise.reject());
        }

        return res.send(Promise.resolve());
      
    })
})

router.get('/fetch-pdf', async(req, res)=> {
    res.sendFile(`${__dirname}/commande.pdf`)
})

router.post('/newCommandeWithAdmin/:id/:num',  verifytoken, async(req,res)=>{
    
   
    const {error}=validateClientCommande(req.body)
    //console.log(error.details[0].message)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})

    let isNewAdmin = 0
    let isNewClient = 0
    
    let createur = ""

    if(req.user.user.role == "admin"){
       isNewAdmin = 0
       isNewClient = 1
       createur = "admin"
    }else{
       isNewAdmin = 1
       isNewClient = 0
       createur = req.user.user.username
    }

    

    
    const nbr = await Commande.count({});
    const num = nbr + 1;
   
    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd");
    let timeCurrent = dateFormat(new Date(), "HH:MM");
    let dateTimeCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    
    const commande=new Commande({
        client:req.params.id,
        colis:req.body.colis,
        facture:req.body.facture,
        factureAutomatique:req.body.factureAutomatique,
        commentaires:[],
        
        etat:req.body.etat,
        
        detailsCourse:req.body.detailsCourse,
        etageDepart:req.body.etageDepart,
        etageArrive:req.body.etageArrive,
        distance:req.body.distance,
        heureFin:req.body.heureFin,
        minuteFin:req.body.minuteFin,
        creneaux:req.body.creneaux,

        tempsMunitation:req.body.tempsMunitation,

        codeLivraison:req.body.codeLivraison,

        typeCamion:req.body.typeCamion,

        createur:createur,

        num:num,
        numClient:req.params.num,
        isOpenAdmin:isNewAdmin,
        isOpenClient:isNewClient,
        adresseDepart:req.body.adresseDepart,
        adresseArrive:req.body.adresseArrive,

        latDepart:req.body.latDepart,
        lngDepart:req.body.lngDepart,

        latArrive:req.body.latArrive,
        lngArrive:req.body.lngArrive,

        duration:req.body.duration,

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


router.post('/newCommandeSansClient', async(req,res)=>{
    
  
    const {error}=validateCommandeSansClient(req.body)
   // console.log(error.details[0].message)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const nbr = await Commande.count({});
    const num = nbr + 1;
   
    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd");
    let timeCurrent = dateFormat(new Date(), "HH:MM");
    let dateTimeCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    
    const commande=new Commande({
        etat:req.body.etat,
        
        commentaires:[],
        
        telephone:req.body.telephone,
       
        typeCamion:req.body.typeCamion,
        
        detailsCourse:req.body.detailsCourse,
        etageDepart:req.body.etageDepart,
        etageArrive:req.body.etageArrive,
       
        heureFin:req.body.heureFin,
        minuteFin:req.body.minuteFin,
        creneaux:req.body.creneaux,

        codeLivraison:req.body.codeLivraison,

        num:num,
        isOpenAdmin:1,
        isOpenClient:0,
        
        adresseDepart:req.body.adresseDepart,
        latDepart:req.body.latDepart,
        lngDepart:req.body.lngDepart,

        adresseArrive:req.body.adresseArrive,
        latArrive:req.body.latArrive,
        lngArrive:req.body.lngArrive,

        distance:req.body.distance,
        duration:req.body.duration,
        
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
  
    //if(req.user.user.role != "admin" ) return res.status(400).send({status:false})

    console.log(req.body)

    const {error}=validateClientCommande(req.body)
   //console.log(error.details[0].message)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
  
    const result=await Commande.findByIdAndUpdate(req.params.idCommande,
        {
            colis:req.body.colis,
            facture:req.body.facture,
            factureAutomatique:req.body.factureAutomatique,

            detailsCourse:req.body.detailsCourse,
            etageDepart:req.body.etageDepart,
            etageArrive:req.body.etageArrive,
            heureFin:req.body.heureFin,
            minuteFin:req.body.minuteFin,
            creneaux:req.body.creneaux,

            codeLivraison:req.body.codeLivraison,

            typeCamion:req.body.typeCamion,
        
            adresseDepart:req.body.adresseDepart,
            latDepart:req.body.latDepart,
            lngDepart:req.body.lngDepart,
    
            adresseArrive:req.body.adresseArrive,
            latArrive:req.body.latArrive,
            lngArrive:req.body.lngArrive,
    
            distance:req.body.distance,
            duration:req.body.duration,

            date:req.body.date,
            heure:req.body.heure,
            minute:req.body.minute,
            etat:req.body.etat, 
            isOpenAdmin:0,
            isOpenClient:1,
            updatedDate:dateCurrent,

            tempsMunitation:req.body.tempsMunitation,

        })

    return res.send({status:true,resultat:result})
    
})

router.post('/ajouterCommentaires', verifytoken, async(req,res)=>{
  
    const {error}=validateCommentaires(req.body)
    //console.log(error.details[0].message)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
    console.log(req.body)

    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");

    let commentaire
    if(req.user.user.role == "admin"){
       commentaire = {message:req.body.commentaire, nom:"Admin", dateCommentaire:dateCurrent, isAdmin:"1"}
    }else{
       commentaire = {message:req.body.commentaire, nom:"Client "+req.user.user.num, dateCommentaire:dateCurrent, isAdmin:"0"}
    }

    const commande = await Commande.findById(req.body.idCommande)
    if(commande == null){
        return
    }

    let commentaires = commande.commentaires
    
    if(commentaires == null){
        commentaires = []
    }
    
    commentaires.push(commentaire)
    console.log(commentaires)

    const result=await Commande.findByIdAndUpdate(req.body.idCommande,
    {
            commentaires:commentaires,
    })

    return res.send({status:true,resultat:commentaires})

})


router.post('/modifierEtat2/:idCommande/:etat', verifytoken, async(req,res)=>{
  
   
    console.log(req.params.idCommande)
    let commande = Commande.findOne({_id:req.params.idCommande});
   
   

    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");

    if(req.user.user.role == "admin"){
        const result=await Commande.findByIdAndUpdate(req.params.idCommande,
            {
                etat:req.params.etat, 
                isOpenClient:1,
                isOpenAdmin:0,
                updatedDate:dateCurrent
            })
    
    }else{
        const result=await Commande.findByIdAndUpdate(req.params.idCommande,
            {
                etat:req.params.etat, 
                isOpenAdmin:1,
                isOpenClient:0,
                updatedDate:dateCurrent
            })
    
 
    }
  
    
   
    return res.send({status:true})
    
})


router.post('/satistiqueAdmin', verifytoken, async(req,res)=>{

    const {error}=validateStatistiqueAdmin(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
    if(req.user.user.role != "admin") res.status(400).send({status:false})
    
   
    const nbrEnAttentDevis = await Commande.count({etat:req.body.etatEnAttentDevis});
   
    const nbrEnAttentConfirmation = await Commande.count({etat:req.body.etatEnAttentConfirmation});
   
    const nbrEnAttentLivraison = await Commande.count({etat:req.body.etatEnAttentLivraison});
   
    const nbrComplete = await Commande.count({etat:req.body.etatComplete});
   
    const nbrAnnuler = await Commande.count({etat:req.body.etatAnnuler});
   
    const nbrLivraisonNow = await Commande.count({etat:req.body.etatEnAttentLivraison, date:req.body.dateNow});
   
    const nbrClient = await User.count({});
   
    const nbrContact = await Contact.count({});
   
    resultat = {nbrEnAttentDevis:nbrEnAttentDevis,nbrAnnuler:nbrAnnuler, nbrEnAttentConfirmation:nbrEnAttentConfirmation, nbrEnAttentLivraison:nbrEnAttentLivraison, nbrComplete:nbrComplete ,nbrLivraisonNow:nbrLivraisonNow, nbrClient:nbrClient, nbrContact:nbrContact}
    
    return res.send({status:true,resultat:resultat})

})



router.post('/satistiqueClient', verifytoken, async(req,res)=>{

    const {error}=validateStatistiqueAdmin(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
    let id = ""
    if(req.user.user.role == "client"){
        id=req.user.user.id
    }else{
        id=req.user.user.chef
    }
    
    const nbrEnAttentConfirmation = await Commande.count({etat:req.body.etatEnAttentConfirmation, client:id});
   
    const nbrEnAttentLivraison = await Commande.count({etat:req.body.etatEnAttentLivraison, client:id});
   
    const nbrComplete = await Commande.count({etat:req.body.etatComplete, client:id});
   
    const nbrLivraisonNow = await Commande.count({etat:req.body.etatEnAttentLivraison, date:req.body.dateNow, client:id});
   
    const nbrLivraisonAnnuler = await Commande.count({etat:req.body.etatAnnuler, client:id});
   
    resultat = { nbrLivraisonAnnuler:nbrLivraisonAnnuler, nbrEnAttentConfirmation:nbrEnAttentConfirmation, nbrEnAttentLivraison:nbrEnAttentLivraison, nbrComplete:nbrComplete ,nbrLivraisonNow:nbrLivraisonNow}
    
    return res.send({status:true,resultat:resultat})

})



router.post('/commandes', verifytoken, async(req,res)=>{
   
    const {error}=validateRequestCommandes(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
   
    const options = {
        page: req.body.page,
        limit: Number(req.body.limitPage),
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            createdAt: -1 
        }
    };

    let filter = []
    let filterGlobal = {}

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

        if(filter.length > 0){
            filterGlobal = {$and:filter}
        }else{
            filterGlobal={}
        }
    
    }else if(req.user.user.role == "client"){
  
        filter.push({"client":req.user.user.id})
        
        if(filter.length > 1){
            filterGlobal = {$and:filter}
        }else{
            filterGlobal = {"client":req.user.user.id}
        }
    }else{
  
        filter.push({"client":req.user.user.chef})
        
        if(filter.length > 1){
            filterGlobal = {$and:filter}
        }else{
            filterGlobal = {"client":req.user.user.chef}
        }
    }

   
   

    const result=await Commande.paginate(filterGlobal, options)
    return res.send({status:true,resultat:result})

})

router.post('/newsCommandes', verifytoken, async(req,res)=>{
   
    
    const options = {
        page: 1,
        limit: 100,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            updatedAt: -1 
        }
    };

    
    if(req.user.user.role == "admin"){
        filterGlobal = {"isOpenAdmin":1}
    }else{
        filterGlobal = {"client":req.user.user.id, "isOpenClient":1}
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
  
    if(req.user.user.role == "admin"){
        await Commande.findByIdAndUpdate(req.body.idCommande,{isOpenAdmin:0})
    }else{
        await Commande.findByIdAndUpdate(req.body.idCommande,{isOpenClient:0})
    }
    
    return res.send({status:true})
    
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
