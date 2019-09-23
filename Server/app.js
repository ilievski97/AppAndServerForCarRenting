const express = require('express');
const loki = require("lokijs");
var ids = require('short-id');
var bodyParser = require("body-parser");
var cors = require('cors');
let multer = require('multer');
var fs = require('fs');
const https = require('https');

const app = express();
app.use(bodyParser.json());
app.use(cors());



//database creation
var db = new loki("database.db");

// creating separate collections for users and cars
var users = db.addCollection("users");
var cars = db.addCollection("cars");






var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./Images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_"  + file.originalname);
    }
});


 var upload = multer({
    storage: Storage
}).single('file');



//models
class User {
    constructor(fullname,email,password,address) {
      this.pID = ids.generate();
      this.fullname = fullname;
      this.email = email;
      this.password = password;
      this.address = address;
      this.rsa;
    }
    
}

class Car {
  constructor(model,imageUrl,location,startDate,endDate,year,description,km,price,email) {
    this.id = ids.generate();
    this.email = email;
    this.model = model;
    this.imageUrl = "https://51.75.76.50:3030/Images/" + imageUrl;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
    this.year = year;
    this.description = description;
    this.km = km;
    this.price = price;
    
    }
}


//demo
cars.insert(new Car("mercedes","car.jpg","skopje","07.15.27","07.15.27","626","sczdvfb","213",500,"test@gmail.com"));
users.insert(new User( "Stole ", 'test@gmail.com', "1234567890",  "Strumica" ));


app.get('/', (req, res) => {
    
    res.send('An alligator approaches!');
});




app.use('/Images', express.static('./Images'))

app.post('/upload', upload, (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      res.json({'realUrl': file.fieldname + "_"  + file.originalname});
    
})


app.post('/registerUser', (req, res) => {
    console.log(req.body);
    users.insert(new User(req.body.fullname , req.body.email, req.body.password, "no address"));
    res.json('registered');
});



app.post('/loginUser', (req, res) => {
   
    let result = users.find({'email': req.body.email , 'password' : req.body.password});
    console.log(result) ;
    if(result.length > 0){
        res.json( {'pID' : result[0].pID, 'isLogged' : "logged", 'user': result[0] });
    }
    res.json('logged');
});

app.post('/registerCar', (req, res) => {
    console.log(req.body);
    cars.insert(new Car(req.body.car.model,req.body.url, req.body.car.location,req.body.car.startDate,req.body.car.endDate,req.body.car.year,req.body.car.description,">20.000",50));
    res.json('updated');
});





app.post('/getlogedUser', (req, res) => {
    
    let result = users.find({'pID': req.body.pID });
    if(result[0]){
        res.json(result[0]);
    }
    res.json('error');
});



app.post('/editUser', (req, res) => {
    
    let result = users.find({'pID': req.body.pID });
    let User = result[0];
    console.log(result[0].fullname);

  
    if(!(typeof(req.body.email)  === 'undefined')){
        console.log(req.body.email);
        User.email = req.body.email;
      
      
    }

    if(!(typeof(req.body.password) === 'undefined')){
        console.log('1');
        console.log(req.body.password);
        User.password = req.body.password;
        
       
    }

    if(!(typeof(req.body.address) === 'undefined')){
        console.log('2');
        console.log(req.body.address);
        User.address = req.body.address;
        
        
    }

    if(!(typeof(req.body.fullname) === 'undefined')){
        User.fullname = req.body.fullname;
        
       
    }
   
   users.update(User);
   let result2 = users.find({'pID': req.body.pID });
    //console.log(result2[0]);

    res.json(result2[0]);
});


app.get('/allCars', (req, res) => {
    
    res.json(cars.find());
});

app.get("/queryCars/:location", (req, res) => {
    console.log(req.params.location);
    console.log(cars.find({'location': req.params.location }));
    if(req.params.location.length > 1){
        res.json(cars.find({'location': req.params.location }));
    }else{
        res.json(cars.find());
    }
   
});

app.get("/buyCars/:carId", (req, res) => {
    console.log(req.params.carId);
    cars.chain().find({ 'id' : req.params.carId }).remove();
    res.json(cars.find());
});

//adding SSL certificate
https.createServer({
    key: fs.readFileSync('./key3.pem'),
    cert: fs.readFileSync('./cert3.pem'),
    passphrase: 'test'
}, app)
.listen(3030);


