const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaCommande=mongoose.Schema({
    
    colis:[{
        poids:{type:Number,default: 0},
        hauteur:{type:Number,default: 0},
        largeur:{type:Number,default: 0},
        longueur:{type:Number,default: 0},
        nbr:{type:Number,default: 0},
    }],
    
    adresseDepart:{type:String,default: ""},
    adresseArrive:{type:String,default: ""},
    distance:{type:Number,default: 0},
    etageDepart:{type:String,default: ""},
    etageArrive:{type:String,default: ""},
    detailsCourse:{type:String, default: ""},
    
    date:{type:String,default: ""},
    
    heure:{type:String,default: "0"},
    minute:{type:String,default: "0"},
    heureFin:{type:String,default: "0"},
    minuteFin:{type:String,default: "0"},
    creneaux:{type:String,default: "0"},

    client:{type:String,default: "0"},
    etat:{type:String,required:true},
    num:{type:Number,required:true},
    numClient:{type:Number,default: 0},
    
    facture:[{
        titre:{type:String,required:true},
        valeur:{type:Number,default: 0},
    }],
    
    isOpenAdmin:{type:Number,default: 0},
    isOpenClient:{type:Number,default: 0},
    createdDate:{type:String,default: ""},
    createdTime:{type:String,default: ""},
    updatedDate:{type:String,default: ""},
    
},
{ timestamps: true }
)

schemaCommande.plugin(mongoosePaginate);

schemaCommande.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Commande = mongoose.model('Commande',schemaCommande)


function validateClientCommande(commande){
    
    let item = Joi.object().keys({
        poids:Joi.number().required(),
        largeur:Joi.number().required(),
        hauteur:Joi.number().required(),
        longueur:Joi.number().required(),
        nbr:Joi.number().required(),
    })
      
    let schema = Joi.object({
        colis:Joi.array().items(item),

        adresseDepart:Joi.string().required(),
        adresseArrive:Joi.string().required(),
        distance:Joi.number().required(),
        etageDepart:Joi.string().required(),
        etageArrive:Joi.string().required(),
        datailsCourse:Joi.number().required(),

        date:Joi.string().required(),

        heure:Joi.number().required(),
        minute:Joi.number().required(),
        heureFin:Joi.number().required(),
        minuteFin:Joi.number().required(),
        creneaux:Joi.number().required(),
        
        etat:Joi.string().required(),
    })
   
    return schema.validate(commande)
}

function validateAdminCommande(commande){

    let item = Joi.object().keys({
        poids:Joi.number().required(),
        largeur:Joi.number().required(),
        hauteur:Joi.number().required(),
        longueur:Joi.number().required(),
    })

    let itemFacture = Joi.object().keys({
        titre:Joi.string()  .required(),
        valeur:Joi.number().required(),
    })
      
    let schema = Joi.object({
        colis:Joi.array().items(item),
        facture:Joi.array().items(itemFacture),
      
        adresseDepart:Joi.string().required(),
        adresseArrive:Joi.string().required(),
        distance:Joi.number().required(),
        etageDepart:Joi.string().required(),
        etageArrive:Joi.string().required(),
        datailsCourse:Joi.number().required(),

        date:Joi.string().required(),

        heure:Joi.number().required(),
        minute:Joi.number().required(),
        heureFin:Joi.number().required(),
        minuteFin:Joi.number().required(),
        creneaux:Joi.number().required(),
        
        etat:Joi.string().required(),
    })
      
    return schema.validate(commande)
}

function validateRequestCommandes(commande){

    let schema = Joi.object({
        etat:Joi.string().allow(""),
        dateLivraison:Joi.string().allow(""),
        dateCreation:Joi.string().allow(""),
        numClient:Joi.number().allow(""),
        limitPage:Joi.number().allow(""),
        page:Joi.number().allow(""),
    })
      
    return schema.validate(commande)
}

module.exports.Commande=Commande
module.exports.validateClientCommande=validateClientCommande
module.exports.validateAdminCommande = validateAdminCommande
module.exports.validateRequestCommandes = validateRequestCommandes

