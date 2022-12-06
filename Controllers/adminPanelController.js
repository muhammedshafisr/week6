const { render } = require("ejs");
const { ObjectId } = require("mongodb");
var {connectToDb,getDb} = require('../config/connection')

let db;
connectToDb(() =>{
    db = getDb()
})

    //admin entry
const adminLogin = (req , res) =>{
    if(req.session.adminloggedIn){
        let displayproduct = []
        db.collection('products')
        .find()
        .forEach(productname => displayproduct.push(productname))
        .then(() => {
        res.render('adminPanel',{title:'Admin',products:displayproduct})
        }).catch(() =>{
            console.log('error in getting products in to adminpanel')
        })  
     }else{
        console.log("req rejected"); 
        res.render('adminLogin' ,{title:'Admin Login'})
    }
};

    // adminpanel 

const adminpage = (req ,res) =>{
    if(req.session.adminloggedIn){
        let displayproduct = []
        db.collection('products')
        .find()
        .forEach(productname => displayproduct.push(productname))
        .then(() => {
        res.render('/adminPanel')
        }).catch(() =>{
            console.log('error in getting products in to adminpanel')
        })  
     }else{
        console.log("req rejected"); 
        res.render('adminLogin' ,{title:'Admin Login'})
    }
    };

    // admin validation 

const adminValidation = (req ,res) => {

    
let emails,usernames,passwords

    console.log('validating admin login');

    if(req.body.username==""||req.body.email==""||req.body.password==""){

        console.log('input box empty');
        res.render('adminLogin',{title:'Admin Login',password:'Input box cannot be empty'})
    }else if (req.body.email) {
        emails = req.body.email
        passwords = req.body.password
        usernames = req.body.username
        db.collection('admin')
        .findOne({email:emails})
        .then((ress) => {
        let data = ress
        let usercheck = data.username
        let emailcheck = data.email
        let passchech=data.password
        console.log(usercheck,emailcheck,passchech)
        console.log(emails,passwords,usernames)
        // if admin
        if (usercheck==usernames||emailcheck==emails||passwords ==passchech) {
            let displayproduct = []
            db.collection('products')
            .find()
            .forEach(productname => displayproduct.push(productname))
            .then(() => {
                req.session.adminloggedIn=true;
            res.render('adminPanel',{title:'Home' ,products:displayproduct})
            }).catch(() =>{
                console('error in getting products in to adminpanel')
            })

        }else if(usercheck!=usernames){
            res.render('adminLogin',{title:'Admin Login',username:"username is incorrect"}) 
        }else if(emailcheck!=emails){
            res.render('adminLogin',{title:'Admin Login',email:"email is incorrect"}) 
        }
        else {
            res.render('adminLogin' ,{title:'Admin Login',password:"password is incorrect"})}
            
        })
        .catch((rej) =>{
            console.log("user doesn't exist")
            res.render('adminLogin' ,{title:'Admin Login',password:"Admin does'not exists"})
        })
    }
    }


//adding products

const getaddProducts = (req ,res) => {
    res.render('addproducts',{title:'Admin | Add products' ,})
}
    // post method add products

const addProducts = (req ,res) => {
    let product = req.body.productname
    let img = req.body.image
    let des = req.body.description
    console.log(product,img,des)
    db.collection('products')
    .insertOne({productname:product ,image:img ,description:des})
    .then((resolve) => {
        res.render('addproducts',{title:'Admin | Add product' ,value:"success"})
    })
    .catch(() => {
        res.status(500).json({error:'could not fetch data from the server'})
    })
}

    // products
    const products = (req ,res) => {
        // console.log(displayproduct)
        let displayproduct = []
            db.collection('products')
            .find()
            .forEach(productname => displayproduct.push(productname))
            .then(() => {
            res.render('adminPanel',{title:'Admin | product' ,products:displayproduct})
            }).catch(() =>{
                console('error in getting products in to adminpanel')
            })
    }
    


    // userdata
let users;
const userData = (req ,res) => {
     users = []
    db.collection('users')
    .find()
    .sort()
    .forEach(firstname => users.push(firstname))
    .then(()=>{
        res.render('usersList',{data:users ,title:'Admin | Userlist' ,})
    })
    .catch(()=>{
        res.status(500).json({error:'could not fetch'})
    })
}

// delete user

const deleteUser = (req ,res) => {
    let id =req.url.slice(1)
       db.collection('users')
       .deleteOne({_id:ObjectId(id)})
       .then(() => {
           res.redirect('/userdata')
       })
       .catch(()=>{
           res.status(500).json({error:'could not fetch'})
       })
       
   }
   


    // useredit starting 


const useredit=(req,res)=>{
    let id =req.url.slice(19)

    db.collection('users')
    .findOne({_id:ObjectId(id)})
    .then((resolve) =>{
        res.render('useredit',{title:'Admin | Edit user' ,data:resolve})
    })
    .catch(() => {
        res.status(500).json({error:'could not fetch'})
    })

}


// user edit confirm 

const usereditConfirm = (req ,res) => {
    let id =req.url.slice(23)
    
    // getting user data 
    let data = db.collection('users')
    .findOne({_id:ObjectId(id)})
    .then((resolve) =>resolve)
    .catch(() => {
        res.status(500).json({error:'could not fetch'})
    })

    // updating the data 
    let firstnames = req.body.firstname
    let lastnames = req.body.lastname
    let emails = req.body.email
    let passwords = req.body.password
    db.collection('users')
    .updateOne({_id:ObjectId(id)},{$set: {firstname:firstnames , lastname:lastnames ,email:emails , password:passwords}})
    .then((resolve) => {
        // data is a promise so we can do like this 

        data.then((data) => {
            res.render('useredit',{title:'Admin | Edit user' ,value:'success',data:data})
        })
        .catch(() => {
            res.status(500).json({error:'could not fetch'})
        })
    })
    .catch(() => {
        res.status(500).json({error:'could not fetch'})
    })
}


//addmin

const admin_addproduct = (req ,res) => {
    res.redirect('/products')
}
const admin_userData = (req ,res) => {
    res.redirect('/userdata')
}



        // adminLogout 
const logOut = (req ,res) => {

    console.log('session deleted','loggedout');
    req.session.adminloggedIn=false;
    res.redirect('/admin')
    };


module.exports = {
    adminpage,
    adminLogin,
    userData,
    adminValidation,
    addProducts,
    products,
    deleteUser,
    logOut,
    useredit,
    usereditConfirm, 
    getaddProducts,
    admin_addproduct,
    admin_userData
}