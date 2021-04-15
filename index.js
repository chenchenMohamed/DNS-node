const express=require("express")
const app=express()
const bodyParser=require('body-parser')
const mongoose=require("mongoose")

const { routerUser } = require("./Routes/userRoute")
const { routerCommande } = require("./Routes/commandeRoute")
const { routerContact } = require("./Routes/contactRoute")
const {routerServerMail} = require("./Routes/serverMail")



const cors=require('cors')


mongoose.connect("mongodb://localhost/shopBD",{ useUnifiedTopology: true,useNewUrlParser: true })
.then(console.log("connected to mongodb"))
.catch(err=>console.log(err))

/*mongoose.connect("mongodb+srv://cluster0.jfk75.mongodb.net/test",{ useUnifiedTopology: true,useNewUrlParser: true , username: "JR-Test", password: "test" })
.then(console.log("connected to mongodb"))
.catch(err=>console.log(err))
*/

app.use(express.json())

app.use(cors())

app.use('/user',routerUser)
app.use('/commande',routerCommande)
app.use('/contact',routerContact)
app.use('/email',routerServerMail)


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('uploads'));
app.use(express.static('sliderAccueil'));

app.use('/uploads', express.static(__dirname + '/uploads/'));
app.use('/sliderAccueil', express.static(__dirname + '/sliderAccueil/'));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("server conected to port 3000")
})
