const {Tarif, validateTarif} =require('../Models/tarifsModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');



router.post('/newTarif', verifytoken, async(req,res)=>{
    
    if(req.user.user.role != "admin" ) return res.status(400).send({status:false})

    const {error}=validateTarif(req.body)
    if(error) return res.status(400).send({status:false,message:error.details[0].message})
    
    const tarif=new Tarif({
        categorie:"",
        sousCategories:[]
    },)

    await tarif.save()

    await Tarif.deleteMany();

    for(let i =0; i < req.body.tarif.length; i++){
        let tarif=new Tarif({
            categorie:req.body.tarif[i].categorie,
            sousCategories:req.body.tarif[i].sousCategories
        },)
    
        await tarif.save()
    }
    
    return res.send({status:true})
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



router.get('/Tarifs', async(req,res)=>{
  
    const result=await Tarif.find({})
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

module.exports.routerTarifs=router