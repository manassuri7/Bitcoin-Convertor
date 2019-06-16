//npm init then npm install express body-parser and then npm install request for fetching external API to express server
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");    
});

app.post("/",function(req,res){
   //console.log(req.body.crypto);
    var crypto=req.body.crypto;//to store the crytocurrency
    var fiat=req.body.fiat;//to store the fiat currency
    var amount=req.body.amount;//to store the amount entered by user for currency convertor
    //var baseURL="https://apiv2.bitcoinaverage.com/indices/global/ticker/";
    //var finalURL=baseURL+crypto+fiat;//through this we change the url according to the user's inputs for currency and fiat currency
    var options={//for currency convertor we pass options in request
//below url taken from bitcoin average,after ? starts the parameters  need to be passed in qs and seperated by &
       // GET https://apiv2.bitcoinaverage.com/convert/{symbol_set}?from={source_cur}&to={target_cur}&amount={amount}
        
       url:"https://apiv2.bitcoinaverage.com/convert/global",//price-conversion API
        method:"GET",
        qs:{//querystring
            from:crypto,
            to:fiat,
            amount:amount
        }

    };
   // request(finalURL,function(error,response,body)
    request(options,function(error,response,body){

    //request("https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCUSD",function(error,response,body){
        //these 3 things error,response and body will be sent back to us once we 
        //make a request to this url, BTCUSD at last is the cascading of BTC     and USD that we pass in values in html
    // console.log(response.statusCode);//this statusCode 200 ok means everything has succeeded
     //console.log(body); //to get the data

     var data=JSON.parse(body);//to convert JSON data to a JS object
     //var price=data.last;//gives the data associated with the key last in JSON body
     //var price=data.averages.week;//gets into average, then inside average goes to week
     var price=data.price;//as in new JSON price is inside price
     //console.log(price);
     
     //var currentDate=data.display_timestamp;//This current Date is for older url
     var currentDate=data.time;//the JSON we get now after passing options has time and not display_timestamp
     res.write("<p>The current date is "+currentDate+"</p>");//to send multiple things we use write()
     //res.write("<h1>"+" The current price of "+crypto+" is " + price + fiat +"</h1>");
     res.write("<h1>"+amount+crypto+" is currently worth " + price + fiat +"</h1>");
     res.send();
     //res.send("<h1>"+" The current price of "+crypto+" is " + price + fiat +"</h1>");//prints the price and shows us on screen
     //we use this send method whenever we want to paste something in web server from our express/local server
     //we can only use res.send only once to send data, if we want to send more than once we need to use res.write()
   });
});
app.listen(3000,function(){
    console.log("server is running on port 3000");
});