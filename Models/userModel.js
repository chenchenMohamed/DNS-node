const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const schemaUser=mongoose.Schema({
    
       nom: {type: String, default: ""},
       num: {type:Number,default: 0},
       password: {type: String, default: ""},
      
       email: {type: String, default: "", unique: true},
       username:{type: String, default: "username", unique: true},

       adresse: {type: String, default: " "},
       lat: {type: Number, default: 0},
       lng: {type: Number, default: 0},
      
       telephone: {type: String, default: ""},
       carteIdentite: {type: String, default: " "},
       
       entreprise: {type: String, default: " "},
       numChef: {type: String, default: " "},
       chef: {type: String, default: ""},
       
       role: {type: String, default: "client"},
       type: {type: String, default: "Particulier"},
       codeForgotPassword: {type: String, default: ""},
       
       isActive: {type: Number, default: 1},
    },
    {
         timestamps: true 
    },
)

schemaUser.plugin(mongoosePaginate);

  schemaUser.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


const User=mongoose.model('User',schemaUser)


function validateUser(user){

    
    const schema=Joi.object({
    
        nom: Joi.string().allow('', null),
        carteIdentite: Joi.string().allow('', null),
        telephone: Joi.string().allow('', null),
        adresse: Joi.string().allow('', null),
      
        lat: Joi.number().allow('', null),
        lng: Joi.number().allow('', null),
        
        username: Joi.string().allow('', null),
        entreprise: Joi.string().allow('', null),
        numChef: Joi.string().allow('', null),
      
        email: Joi.string().email(),
        password: Joi.string().allow('', null),
        type: Joi.string().allow('', null),
   
    })

    return schema.validate(user)
}

function validateUpdateUser(user){

    
    const schema1 = Joi.object({
        
        nom: Joi.string().allow('', null),
        telephone: Joi.string().allow('', null),
        adresse: Joi.string().allow('', null),
        
        lat: Joi.number().allow('', null),
        lng: Joi.number().allow('', null),
        
        
        carteIdentite: Joi.string().allow('', null),
        entreprise: Joi.string().allow('', null),
      
        email: Joi.string().email(),
        password: Joi.string().allow('', null),
        newEmail: Joi.string().email().allow('', null),
        newPassword: Joi.string().allow('', null),

        username:Joi.string().allow('', null),
        
    })

    return schema1.validate(user)
}


function validateLogin(login){

    const schema2 = Joi.object({
        email:Joi.string().required(),
        password:Joi.string().min(6).required()
    })

    return schema2.validate(login)
}

function validateModifierMotPasse(request){

    const schema2 = Joi.object({
        email:Joi.string().required(),
        baseUrl:Joi.string().min(6).required()
    })

    return schema2.validate(request)
}

function validateNewPassowrd(request){

    const schema2 = Joi.object({
        code:Joi.string().min(6).required(),
        newPassword:Joi.string().min(6).required()
    })

    return schema2.validate(request)
}



module.exports.User=User
module.exports.validateLogin=validateLogin
module.exports.validateUser=validateUser
module.exports.validateModifierMotPasse=validateModifierMotPasse
module.exports.validateNewPassowrd=validateNewPassowrd
module.exports.validateUpdateUser=validateUpdateUser

