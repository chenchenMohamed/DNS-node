const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaTarif=mongoose.Schema({
    
    sousCategories:[{
        titre:{type:String,default: 0},
        valeur:{type:Number,default: 0},
    }],
    
    categorie:{type:String,default: ""},
},
{ timestamps: true }
)

schemaTarif.plugin(mongoosePaginate);

schemaTarif.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Tarif = mongoose.model('Tarif',schemaTarif)


function validateTarif(Tarif){
    
    let sousitem = Joi.object().keys({
        titre:Joi.string().allow(""),
        valeur:Joi.number().allow(""),
    })

    let item = Joi.object().keys({
        sousCategories:Joi.array().items(sousitem),
        categorie:Joi.string().allow(""),
    })
      
    let schema = Joi.object({
        tarif:Joi.array().items(item),
    })
      
    return schema.validate(Tarif)
}



module.exports.Tarif=Tarif
module.exports.validateTarif=validateTarif
