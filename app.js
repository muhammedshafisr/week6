const express = require('express');
const app = express();
const session = require('express-session');
app.set('view engine' ,'ejs');
const indexRouter = require('./routs/indexRouts')
const {connectToDb , getDb} = require('./config/connection');

// static file
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//db connection
let db;
connectToDb((err) =>{
   
    if(!err){   
    console.log('Database connected')
    app.listen(3007, () =>{
        console.log('listening for req')
    })
    db = getDb()
    }
})


//session age
app.use(session({ secret: "MTK", resave: true, saveUninitialized: true, cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } }));

// app.use((req ,res) => {

//     res.download('./abc.txt', (err) =>{
//         if(err){
//             console.log('hello hello')
//         }
//     })
// })

//preventer
app.use( function(req,res,next){
     res.set('cache-control','no-cache , no-store,must-revalidate,max-stale=0,post-check=0,pre-checked=0');
     next();
   });
  
//routs
app.use(indexRouter);

// 404 page
app.use((req ,res) =>{
    console.log('not found !!')
    res.status(404).render('404',{title:'404 Notfound'});
})

module.exports = db