const {Commande, validateStatistiqueAdmin, validateClientCommande, validateCommentaires, validateRequestCommandes, validateCommandeSansClient} =require('../Models/commandeModel')
const {Contact, validateContact} =require('../Models/contactModel')
const {User} =require('../Models/userModel');

var fs = require('fs');

var PDFDocument = require('pdfkit');

const pdf = require('html-pdf');

const pdfTemplate = require('../documents');

const pdfTemplate2 = require('../documents2');

const pdfTemplate3 = require('../documents3');

const documentsFirstTotale = require('../documentsFirstTotale');
const documentsSecondTotale = require('../documentsSecondTotale');

const documentsEmployer = require('../documentsEmployer');
const documentsEmployerSansClient = require('../documentsEmployerSansClient');

const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');

var dateFormat = require('dateformat');

const puppeteer = require('puppeteer');
//nconst fsExtra = require('fs-extra');

var phantom = require('phantom'); 

router.post('/create-pdfEmployer', async(req, res)=>{

    doc = new PDFDocument;    
    doc.pipe(fs.createWriteStream('uploads/commande_'+req.body.num+'.pdf')); 

    if(req.body.client != "0"){

        let user = await User.findOne({_id:req.body.client})
    
        const options1 = { format: 'Letter'}
        
        await pdf.create(documentsEmployer(req.body, user), options1).toFile('uploads/commande_'+req.body.num+'.pdf', (err) => {
            if(err){
                return res.send(Promise.reject());
            }
       
            res.send({url:"/uploads/commande_"+req.body.num+".pdf"})
        })
        
        /*  await pdf.create(documentsEmployer(req.body, user), options).toFile('uploads/commande_'+req.body.codeLivraison+'.pdf', (err) => {
        
            if(err){
                return res.send(Promise.reject());
            }
    
            res.send({url:"/uploads/commande_"+req.body.codeLivraison+".pdf"})
          
        })*/
    
    }else{

        const options1 = { format: 'Letter'}
        await pdf.create(documentsEmployerSansClient(req.body), options1).toFile('uploads/commande_'+req.body.num+'.pdf', (err) => {
            if(err){
                return res.send(Promise.reject());
            }
       
            res.send({url:"/uploads/commande_"+req.body.num+".pdf"})
        })
        
    }
    
})


router.post('/create-pdf1Totale', async(req, res)=>{

    doc = new PDFDocument;    
    doc.pipe(fs.createWriteStream('uploads/commande_'+req.body.codeLivraison+'.pdf')); 

    let user = await User.findOne({num:req.body.client})

    const options = { format: 'A4' }
    
    await pdf.create(documentsFirstTotale(req.body, user), options).toFile('uploads/commande_'+req.body.codeLivraison+'.pdf', (err) => {
    
        if(err){
            return res.send(Promise.reject());
        }

        res.send({url:"/uploads/commande_"+req.body.codeLivraison+".pdf"})
      
    })

})


router.post('/create-pdf2Totale', async(req, res)=>{

    doc = new PDFDocument;    
    doc.pipe(fs.createWriteStream('uploads/details_'+req.body.codeLivraison+'.pdf')); 
   
    let user = await User.findOne({num:req.body.client})

    const options = { format: 'A4' }
    await pdf.create(documentsSecondTotale(req.body, user), options).toFile('uploads/details_'+req.body.codeLivraison+'.pdf', (err) => {
        if(err){
            return res.send(Promise.reject());
        }
   
        res.send({url:"/uploads/details_"+req.body.codeLivraison+".pdf"})
      
    })

})



router.post('/create-pdf', async(req, res)=>{

    
    doc = new PDFDocument;    
    doc.pipe(fs.createWriteStream('uploads/commande_'+req.body.codeLivraison+'.pdf')); 

    let user = await User.findById(req.body.client)

    const options = { format: 'A4' }
    await pdf.create(pdfTemplate(req.body, user), options).toFile('uploads/commande_'+req.body.codeLivraison+'.pdf', (err) => {
        if(err){
            return res.send(Promise.reject());
        }

        res.send({url:"/uploads/commande_"+req.body.codeLivraison+".pdf"})
      
    })
})

router.post('/create-pdf3', async(req, res)=>{

    console.log(req.body)
    doc = new PDFDocument;    
    doc.pipe(fs.createWriteStream('uploads/commande_'+req.body.num+'.pdf')); 

    let imgSrc = 'logo.png';
   
    var _basePath = 'file:///' + __dirname + '\\';

    console.log(_basePath)
    
    var options = {
        format: 'A4',
        base: _basePath
    };

    await pdf.create(pdfTemplate3(req.body,imgSrc), options).toFile('uploads/commande_'+req.body.num+'.pdf', (err) => {
        if(err){
            return res.send(Promise.reject());
        }

        res.send({url:"/uploads/commande_"+req.body.num+".pdf"})
      
    })
})


router.get('/create-pdf4', async(req, res)=>{


       let pdfDoc = new PDFDocument;
       pdfDoc.pipe(fs.createWriteStream('SampleDocument2.pdf'));
      // pdfDoc.image('../documents3/logo.png', {scale: 0.75});
       
       pdfDoc.end();
})


router.post('/create-pdf2', async(req, res)=>{

    doc = new PDFDocument;    
    doc.pipe(fs.createWriteStream('uploads/details_'+req.body.codeLivraison+'.pdf')); 

    let user = await User.findById(req.body.client)

    const options = { format: 'A4' }
    await pdf.create(pdfTemplate2(req.body, user), options).toFile('uploads/details_'+req.body.codeLivraison+'.pdf', (err) => {
        if(err){
            return res.send(Promise.reject());
        }

        res.send({url:"/uploads/details_"+req.body.codeLivraison+".pdf"})
      
    })
})

router.get('/fetch-pdf', async(req, res)=> {
    res.sendFile(`${__dirname}/commande_${req.body.codeLivraison}.pdf`)
})

router.post('/newCommandeWithAdmin/:id/:num',  verifytoken, async(req,res)=>{
    
   
    let clientVerifier = User.find({id:req.user.user.id})
    if(clientVerifier.length == 0){
        res.status(400).send({status:false})
    }

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
   
    let dateCurrent = req.body.dateCurrent;
    let timeCurrent = req.body.timeCurrent;
    let dateTimeCurrent = req.body.dateTimeCurrent;
   
    let dateLivraison =  req.body.date;
    let year = Number(dateLivraison.substring(0,4))
    let mois = Number(dateLivraison.substring(5,7))
    let day = Number(dateLivraison.substring(8,10))  
    
    let moisCal = mois + 10
    let sommeDate = year * 10000 + moisCal * 100 + day

    let heureCal = req.body.heure + 10
    sommeDate = sommeDate * 10000 + heureCal * 100 + req.body.minute;

   
    const commande=new Commande({

        nomSansClient:req.body.nomSansClient,
        telephoneSansClient:req.body.telephoneSansClient,

        nomDestination:req.body.nomDestination,
        telephoneDestination:req.body.telephoneDestination,

        emailClient:req.body.emailClient,

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
        idCreateur:req.user.user.id,

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

        dateNumber: sommeDate,
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
    
    const {error}=validateClientCommande(req.body)
   // console.log(error.details[0].message)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})

    const nbr = await Commande.count({});
    const num = nbr + 1;
   
    let dateCurrent = req.body.dateCurrent;
    let timeCurrent = req.body.timeCurrent;
    let dateTimeCurrent = req.body.dateTimeCurrent;
    
    let dateLivraison =  req.body.date;
    let year = Number(dateLivraison.substring(0,4))
    let mois = Number(dateLivraison.substring(5,7))
    let day = Number(dateLivraison.substring(8,10))  
    
    let moisCal = mois + 10
    let sommeDate = year * 10000 + moisCal * 100 + day

    let heureCal = req.body.heure + 10
    sommeDate = sommeDate * 10000 + heureCal * 100 + req.body.minute;

    const commande=new Commande({
        etat:req.body.etat,
        
        colis:req.body.colis,

        commentaires:[],
        
        nomSansClient:req.body.nomSansClient,
        telephoneSansClient:req.body.telephoneSansClient,

        nomDestination:req.body.nomDestination,
        telephoneDestination:req.body.telephoneDestination,
       
        emailClient:req.body.emailClient,

        typeCamion:req.body.typeCamion,
        
        detailsCourse:req.body.detailsCourse,
        etageDepart:req.body.etageDepart,
        etageArrive:req.body.etageArrive,
       
        heureFin:req.body.heureFin,
        minuteFin:req.body.minuteFin,
        creneaux:req.body.creneaux,

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
        
        dateNumber: sommeDate,
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

    let clientVerifier = User.find({id:req.user.user.id})
    if(clientVerifier.length == 0){
        res.status(400).send({status:false})
    }

    console.log(req.body)

    const {error}=validateClientCommande(req.body)
   //console.log(error.details[0].message)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
    let dateCurrent = dateFormat(new Date(), "yyyy-mm-dd HH:MM");


    let dateLivraison =  req.body.date;
    let year = Number(dateLivraison.substring(0,4))
    let mois = Number(dateLivraison.substring(5,7))
    let day = Number(dateLivraison.substring(8,10))  
    
    let moisCal = mois + 10
    let sommeDate = year * 10000 + moisCal * 100 + day

    let heureCal = req.body.heure + 10
    sommeDate = sommeDate * 10000 + heureCal * 100 + req.body.minute;

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

            dateNumber: sommeDate,
            date:req.body.date,
           
            heure:req.body.heure,
            minute:req.body.minute,
            etat:req.body.etat, 
            isOpenAdmin:0,
            isOpenClient:1,
            updatedDate:dateCurrent,

            raisonAnnulation :req.body.raisonAnnulation,
            detailsAnnulation :req.body.detailsAnnulation,

            tempsMunitation:req.body.tempsMunitation,

        })

    return res.send({status:true,resultat:result})
    
})

router.post('/ajouterCommentaires', verifytoken, async(req,res)=>{

    
    let clientVerifier = User.find({id:req.user.user.id})
    if(clientVerifier.length == 0){
        res.status(400).send({status:false})
    }
  
    const {error}=validateCommentaires(req.body)
    //console.log(error.details[0].message)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
  
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
  
    let clientVerifier = User.find({id:req.user.user.id})
    if(clientVerifier.length == 0){
        res.status(400).send({status:false})
    }
   
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
   
    const nbrClient = await User.count({role:"client"});
   
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
        const nbrEnAttentConfirmation = await Commande.count({etat:req.body.etatEnAttentConfirmation, client:id});
        const nbrEnAttentLivraison = await Commande.count({etat:req.body.etatEnAttentLivraison, client:id});
        const nbrComplete = await Commande.count({etat:req.body.etatComplete, client:id});
        const nbrLivraisonNow = await Commande.count({etat:req.body.etatEnAttentLivraison, date:req.body.dateNow, client:id});
        const nbrLivraisonAnnuler = await Commande.count({etat:req.body.etatAnnuler, client:id});
        resultat = { nbrLivraisonAnnuler:nbrLivraisonAnnuler, nbrEnAttentConfirmation:nbrEnAttentConfirmation, nbrEnAttentLivraison:nbrEnAttentLivraison, nbrComplete:nbrComplete ,nbrLivraisonNow:nbrLivraisonNow}
        return res.send({status:true,resultat:resultat})
    
    }else{
        id=req.user.user.id
        const nbrEnAttentConfirmation = await Commande.count({etat:req.body.etatEnAttentConfirmation, idCreateur:id});
        const nbrEnAttentLivraison = await Commande.count({etat:req.body.etatEnAttentLivraison, idCreateur:id});
        const nbrComplete = await Commande.count({etat:req.body.etatComplete, idCreateur:id});
        const nbrLivraisonNow = await Commande.count({etat:req.body.etatEnAttentLivraison, date:req.body.dateNow, idCreateur:id});
        const nbrLivraisonAnnuler = await Commande.count({etat:req.body.etatAnnuler, idCreateur:id});
        resultat = { nbrLivraisonAnnuler:nbrLivraisonAnnuler, nbrEnAttentConfirmation:nbrEnAttentConfirmation, nbrEnAttentLivraison:nbrEnAttentLivraison, nbrComplete:nbrComplete ,nbrLivraisonNow:nbrLivraisonNow}
        return res.send({status:true,resultat:resultat})

    }
    
  
   
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
            dateNumber: 1 
        }
    };

    let filter = []
    let filterGlobal = {}

    let filterEtat = [];
    if(req.body.etatAnnuler != ""){
        filterEtat.push({"etat":req.body.etatAnnuler})
    }

    if(req.body.etatEnAttentLivraison != ""){
        filterEtat.push({"etat":req.body.etatEnAttentLivraison})
    }

    if(req.body.etatCompleter != ""){
        filterEtat.push({"etat":req.body.etatCompleter})
    }

    if(filterEtat.length > 1){
        filter.push({$or :filterEtat})
    }if(filterEtat.length == 1){
        filter.push(filterEtat[0])
    }

    if(req.body.dateLivraisonDebut != ""){
        
        let dateLivraison =  req.body.dateLivraisonDebut;
        let year = Number(dateLivraison.substring(0,4))
        let mois = Number(dateLivraison.substring(5,7))
        let day = Number(dateLivraison.substring(8,10))  
        
        let moisCal = mois + 10
        let sommeDate = year * 10000 + moisCal * 100 + day
    
        sommeDate = sommeDate * 10000;


        filter.push({"dateNumber":{$gte:sommeDate}})
    }

    if(req.body.dateLivraisonFin != ""){

        let dateLivraison =  req.body.dateLivraisonFin;
        let year = Number(dateLivraison.substring(0,4))
        let mois = Number(dateLivraison.substring(5,7))
        let day = Number(dateLivraison.substring(8,10))  
        
        let moisCal = mois + 10
        let sommeDate = year * 10000 + moisCal * 100 + day
    
        sommeDate = sommeDate * 10000 + 9999;
     
        filter.push({"dateNumber":{$lte:sommeDate}})
    }

    if(req.body.dateCreation != ""){
        filter.push({"createdDate":req.body.dateCreation})
    }
    

    if(req.user.user.role == "admin"){
  
        if(req.body.numClient != 0){
            filter.push({"numClient":Number(req.body.numClient)})
        }

        if(filter.length > 1){
            filterGlobal = {$and:filter}
        }else if(filter.length == 1){
            filterGlobal=filter[0]
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
  
        filter.push({"idCreateur":req.user.user.id})
        
        if(filter.length > 1){
            filterGlobal = {$and:filter}
        }else{
            filterGlobal = {"idCreateur":req.user.user.id}
        }

    }
    
    const result=await Commande.paginate(filterGlobal, options)
    return res.send({status:true,resultat:result})
})



router.post('/commandesToday', verifytoken, async(req,res)=>{

    
   
    const {error}=validateRequestCommandes(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
   
    const options = {
        page: req.body.page,
        limit: Number(req.body.limitPage),
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            dateNumber: 1 
        }
    };

    let filter = []
    let filterGlobal = {}

    let filterEtat = [];
    if(req.body.etatAnnuler != ""){
        filterEtat.push({"etat":req.body.etatAnnuler})
    }

    if(req.body.etatEnAttentLivraison != ""){
        filterEtat.push({"etat":req.body.etatEnAttentLivraison})
    }

    if(req.body.etatCompleter != ""){
        filterEtat.push({"etat":req.body.etatCompleter})
    }

    if(filterEtat.length > 1){
        filter.push({$or :filterEtat})
    }if(filterEtat.length == 1){
        filter.push(filterEtat[0])
    }

    if(req.body.dateLivraisonDebut != ""){
        
        filter.push({"date":req.body.dateLivraisonDebut})
    }

  
    if(req.body.dateCreation != ""){
        filter.push({"createdDate":req.body.dateCreation})
    }
    

    if(req.user.user.role == "admin"){
  
        if(req.body.numClient != 0){
            filter.push({"numClient":Number(req.body.numClient)})
        }

        if(filter.length > 1){
            filterGlobal = {$and:filter}
        }else if(filter.length == 1){
            filterGlobal=filter[0]
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
  
        filter.push({"idCreateur":req.user.user.id})
        
        if(filter.length > 1){
            filterGlobal = {$and:filter}
        }else{
            filterGlobal = {"idCreateur":req.user.user.id}
        }

    }
    
    const result=await Commande.paginate(filterGlobal, options)
    return res.send({status:true,resultat:result})
})


router.get('/getCommande/:id', verifytoken, async(req,res)=>{
    const result=await Commande.findOne({_id:req.params.id})
    return res.send({status:true,resultat:result})
})


router.post('/newsCommandes', verifytoken, async(req,res)=>{
   
    
    const options = {
        page: 1,
        limit: 1000,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            dateNumber: 1 
        }
    };

    
    if(req.user.user.role == "admin"){
        filterGlobal = {"isOpenAdmin":1}
    }else if(req.user.user.role == "client"){
        filterGlobal = {"client":req.user.user.id, "isOpenClient":1}
    }else{
        filterGlobal = {"idCreateur":req.user.user.id, "isOpenClient":1}
    }

   
    const result=await Commande.paginate(filterGlobal, options)
    

    return res.send({status:true,resultat:result})

})


router.post('/desactivatenewsCommandesAdmin', verifytoken, async(req,res)=>{
   
    
    const options = {
        page: 1,
        limit: 1000,
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:{
            dateNumber: 1 
        }
    };

    
    if(req.user.user.role == "admin"){
        filterGlobal = {"isOpenAdmin":1}
    }else if(req.user.user.role == "client"){
        filterGlobal = {"client":req.user.user.id, "isOpenClient":1}
    }else{
        filterGlobal = {"idCreateur":req.user.user.id, "isOpenClient":1}
    }

   
    const result=await Commande.paginate(filterGlobal, options)

    
    for(let i = 0; i < result.docs.length; i++){
        console.log(result.docs[i]._id)
        await Commande.findByIdAndUpdate(result.docs[i]._id, {isOpenAdmin:0})
    }

    return res.send({status:true})

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
            dateNumber: 1 
        }
    };
  
    if(req.user.user.role != "admin") return res.status(400).send({status:false})
    
    const commandes = await Commande.paginate({client:req.body.idClient},options)

    const client = await User.findOne({_id:req.body.idClient})

    client.password = ""

    return res.send({status:true, commandes:commandes, client:client})
    
})





router.post('/changeIsOpen', verifytoken, async(req,res)=>{
  
    
    let clientVerifier = User.find({id:req.user.user.id})
    if(clientVerifier.length == 0){
        res.status(400).send({status:false})
    }
    
    if(req.user.user.role == "admin"){
        await Commande.findByIdAndUpdate(req.body.idCommande,{isOpenAdmin:0})
    }else{
        await Commande.findByIdAndUpdate(req.body.idCommande,{isOpenClient:0})
    }
    
    return res.send({status:true})
    
})

router.post('/supprimerCommande/:commande', verifytoken, async(req,res)=>{

    
    if(req.user.user.role != "admin"){
      return res.send({status:false})
    }

    console.log(req.params.commande)

    await Commande.findOneAndDelete({_id:req.params.commande})
        
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
