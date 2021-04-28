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
    
    typeCamion:{type:String,default: ""},
   
    date:{type:String,default: ""},
    
    telephone:{type:String,default: ""},
    
    heure:{type:Number,default: "0"},
    minute:{type:Number,default: "0"},
    heureFin:{type:Number,default: "0"},
    minuteFin:{type:Number,default: "0"},
    creneaux:{type:String   ,default: "0"},

    client:{type:String,default: "0"},
    etat:{type:String,required:true},
    num:{type:Number,required:true},
    numClient:{type:Number,default: 0},
    
    facture:[{
        titre:{type:String,required:true},
        valeur:{type:Number,default: 0},
    }],

    commentaires:[{
        nom:{type:String,default: ""},
        message:{type:String,default: ""},
        isAdmin:{type:String,default: "0"},
        dateCommentaire:{type:String,default: ""},
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
        poids:Joi.number().allow(""),
        largeur:Joi.number().allow(""),
        hauteur:Joi.number().allow(""),
        longueur:Joi.number().allow(""),
        nbr:Joi.number().allow(""),
    })
      
    let itemFacture = Joi.object().keys({
        titre:Joi.string().allow(""),
        valeur:Joi.number().allow(""),
    })

        
    let schema = Joi.object({
        colis:Joi.array().items(item),
        facture:Joi.array().items(itemFacture),
    
        typeCamion:Joi.string().allow(""),
       
        adresseDepart:Joi.string().allow(""),
        adresseArrive:Joi.string().allow(""),
        distance:Joi.number().allow(""),
        etageDepart:Joi.string().allow(""),
        etageArrive:Joi.string().allow(""),
        detailsCourse:Joi.string().allow(""),

        date:Joi.string().allow(""),

        heure:Joi.number().allow(""),
        minute:Joi.number().allow(""),
        heureFin:Joi.number().allow(""),
        minuteFin:Joi.number().allow(""),
        creneaux:Joi.string().allow(""),
        
        etat:Joi.string().allow(""),
    })
   
    return schema.validate(commande)
}

function validateCommentaires(commande){
    let schema = Joi.object({
        idCommande:Joi.string() .allow(""),
        commentaire:Joi.string() .allow("")
    })
   
    return schema.validate(commande)
}


function validateAdminCommande(commande){

    let item = Joi.object().keys({
        poids:Joi.number().allow(""),
        largeur:Joi.number().allow(""),
        hauteur:Joi.number().allow(""),
        longueur:Joi.number().allow(""),
    })

    let itemFacture = Joi.object().keys({
        titre:Joi.string()  .allow(""),
        valeur:Joi.number().allow(""),
    })
      
   
      
    let schema = Joi.object({
        colis:Joi.array().items(item),
        facture:Joi.array().items(itemFacture),
   
        typeCamion:Joi.string().allow(""),
       
        adresseDepart:Joi.string().allow(""),
        adresseArrive:Joi.string().allow(""),
        distance:Joi.number().allow(""),
        etageDepart:Joi.string().allow(""),
        etageArrive:Joi.string().allow(""),
        detailsCourse:Joi.string().allow(""),

        date:Joi.string().allow(""),

        heure:Joi.number().allow(""),
        minute:Joi.number().allow(""),
        heureFin:Joi.number().allow(""),
        minuteFin:Joi.number().allow(""),
        creneaux:Joi.string().allow(""),
        
        etat:Joi.string().allow("")
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

function validateCommandeSansClient(commande){

    let schema = Joi.object({
        adresseDepart:Joi.string().allow(""),
        adresseArrive:Joi.string().allow(""),
        etageDepart:Joi.string().allow(""),
        etageArrive:Joi.string().allow(""),
        
        typeCamion:Joi.string().allow(""),
       
        detailsCourse:Joi.string().allow(""),

        date:Joi.string().allow(""),

        telephone:Joi.string().allow(""),

        heure:Joi.number().allow(""),
        minute:Joi.number().allow(""),
        heureFin:Joi.number().allow(""),
        minuteFin:Joi.number().allow(""),
        creneaux:Joi.string().allow(""),
        
        etat:Joi.string().allow("")
    })
      
    return schema.validate(commande)
}

function validateStatistiqueAdmin(commande){

    let schema = Joi.object({
        etatEnAttentDevis:Joi.string().allow(""),
        etatEnAttentConfirmation:Joi.string().allow(""),
        etatEnAttentLivraison:Joi.string().allow(""),
        etatComplete:Joi.string().allow(""),
        etatAnnuler:Joi.string().allow(""),
        dateNow:Joi.string().allow(""),
    })
      
    return schema.validate(commande)
}

module.exports.Commande=Commande
module.exports.validateClientCommande=validateClientCommande
module.exports.validateAdminCommande = validateAdminCommande
module.exports.validateRequestCommandes = validateRequestCommandes
module.exports.validateCommentaires = validateCommentaires
module.exports.validateCommandeSansClient=validateCommandeSansClient
module.exports.validateStatistiqueAdmin=validateStatistiqueAdmin