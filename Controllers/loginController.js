const { render } = require("ejs");
var {connectToDb,getDb} = require('../config/connection')
const {ObjectId} = require('mongodb')

let db;
connectToDb(() =>{
    db = getDb()
})

var a,b;

const home = (req ,res) => {
    
    console.log("req for login to home page");
    if(req.session.userloggedIn){
        let displayproduct = []
        db.collection('products')
        .find()
        .forEach(productname => displayproduct.push(productname))
        .then(() => {
        res.render('home',{title:'Home',user:a,displayproduct,b:b})
        }).catch(() =>{
            console('error in getting products in to adminpanel')
        })  
     }else{
        let displayproduct = []
        n=null
        db.collection('products')
        .find()
        .forEach(productname => displayproduct.push(productname))
        .then(() => {
        res.render('home',{title:'Home',user:n,displayproduct})
        }).catch(() =>{
            console('error in getting products in to adminpanel')
        })  
    }
}

const reqforHome = (req ,res) =>{
    console.log("req for login to home page");
    if(req.session.userloggedIn){
        let displayproduct = []
        db.collection('products')
        .find()
        .forEach(productname => displayproduct.push(productname))
        .then(() => {
        res.render('home',{title:'Home',user:a,displayproduct,b:b})
        }).catch(() =>{
            console('error in getting products in to adminpanel')
        })  
     }else{
        console.log("req rejected"); 
        res.render('login' ,{title:'Login'})
    }

};

// login validation starting

let passwords,emails
const checkingforLogin =(req ,res)=>{
    console.log('validating login');
    console.log(req.params)
    if(req.body.email==""||req.body.pass==""){

        console.log('input box empty');
        res.render('login',{pass:'Input box cannot be empty',title:'Login'})
    }else if (req.body.email) {
        passwords = req.body.pass
        emails = req.body.email
        
        db.collection('users')
        .findOne({email:emails})
        .then((ress) => {
           let data = ress
        a =ress.firstname
        b = ress.lastname
        let passchech=data.password
        if (passwords ==passchech) {
            req.session.userloggedIn=true;
            let displayproduct = []
            db.collection('products')
            .find()
            .forEach(productname => displayproduct.push(productname))
            .then(() => {
            res.redirect('/home')
            }).catch(() =>{
                console('error in getting products in to adminpanel')
            })  
        }
        else {res.render('login',{pass:'Please check your password',title:'Login'})}
            
        })
        .catch((rej) =>{
            console.log("user doesn't exist")
            res.render('login',{email:"user doesn't exists",title:'Login'})
        })
    }
    }

const logout = (req ,res) => {

    console.log('session deleted','loggedout');
    req.session.userloggedIn=false;
    
    res.render('login',{title:'Login'})
    };



module.exports = {
    checkingforLogin,
    reqforHome,
    logout,
    home
}