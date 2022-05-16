const express = require("express");
const app = express();
const port = 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

var Joi = require("joi")

const validationMiddleware = (req, res, next)=>{
    const schema = Joi.object().keys({
        name:Joi.string().required(),
        password:Joi.string().required(),
        search:Joi.string().optional(),
        category:Joi.string().optional().valid("car","bike"),
        amount:Joi.number().optional().integer().min(1).max(100),
        age:Joi.number().when("name",{is:"test",then:Joi.required(),otherwise:Joi.optional()}),
        item:Joi.object().keys({
            id:Joi.string().required(),
            name:Joi.string().required()
        }).optional(),
        items:Joi.array().items().optional(),
        confirmpassword:Joi.string().required().valid(Joi.ref("password")),
        email:Joi.string().email({
            minDomainSegments:2,
            tlds:{allow:["com","in"]}
        }).optional(),
        fullname:Joi.string(),
        lastname:Joi.string(),
        customname:Joi.string().custom((value,msj)=>{
            if(value=="test"){
                return msj.message("Not allowed")
            }
            return true
        })
    }).unknown(false).xor("fullname","lastname")

    const {error} = schema.validate(req.body, {abortEarly: false})
    if(error){
        const{details} = error
        res.status(200).json({error:details})
    }else{
        next();
    }
}

app.post("/add-user", validationMiddleware, async (req, res) =>{
    let result = {
        id: 12,
        name: 'Test Demo'
    }
    res.status(200).json(req.body)
})

app.listen(port, () =>{
    console.log(`App is listening at http://localhost:${port}`)
})