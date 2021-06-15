const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema

const schemaTarifs=mongoose.Schema({
    

        kmSixm:{type:Number, default:0},
        kmDouzem:{type:Number, default:0},
        kmVentem:{type:Number, default:0},
        timeSupplementaire:{type:Number, default:0},
        coliSuppelmentaire:{type:Number, default:0},
        poidsSupplementaire:{type:Number, default:0},
        distanceSupplementaire:{type:Number, default:0},
        kmSixmTtc:{type:Number, default:0},
        kmDouzemTtc:{type:Number, default:0},
        kmVentemTtc:{type:Number, default:0},
        timeSupplementaireTtc:{type:Number, default:0},
        coliSuppelmentaireTtc:{type:Number, default:0},
        poidsSupplementaireTtc:{type:Number, default:0},
        distanceSupplementaireTtc:{type:Number, default:0},
        jours:[{
           date:{type:String, defaul:""},
        }],

  
},
{ timestamps: true }
)

schemaTarifs.plugin(mongoosePaginate);

schemaTarifs.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Tarifs = mongoose.model('Tarifs',schemaTarifs)


function validateTarif(Tarifs){

    let itemJour = Joi.object().keys({
        date:Joi.string().allow(""),
    })
      
    let schema = Joi.object({
      
        kmSixm:Joi.number().allow('', null),
        kmDouzem:Joi.number().allow('', null),
        kmVentem:Joi.number().allow('', null),
        timeSupplementaire:Joi.number().allow('', null),
        coliSuppelmentaire:Joi.number().allow('', null),
        poidsSupplementaire:Joi.number().allow('', null),
        distanceSupplementaire:Joi.number().allow('', null),
        kmSixmTtc:Joi.number().allow('', null),
        kmDouzemTtc:Joi.number().allow('', null),
        kmVentemTtc:Joi.number().allow('', null),
        timeSupplementaireTtc:Joi.number().allow('', null),
        coliSuppelmentaireTtc:Joi.number().allow('', null),
        poidsSupplementaireTtc:Joi.number().allow('', null),
        distanceSupplementaireTtc:Joi.number().allow('', null),
        jours:Joi.array().items(itemJour),
        
    })
      
    return schema.validate(Tarifs)
}



module.exports.Tarifs=Tarifs
module.exports.validateTarif=validateTarif
