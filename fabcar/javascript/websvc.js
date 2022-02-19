const exp = require('constants')
const express = require('express')

var app = express()
var query = require('./query.js')
const port = 3000

app.use(express.json())


app.get('/',(req,res)=>{

    res.send('You have successfully called a get webservice')
})


app.post('/queryws',(req,res)=>{

    
    let first = req.body['first'];
  
    console.log("Diagnosis in post req :")
    
    console.log(first);
    
    result = query.getpatientbydiagnosis(first)
    console.log(result)

    res.json({"Patient list": result})
    
})

app.post('/updatews',(req,res)=>{

    let user = req.body['user'];
    let key = req.body['key'];
    let pofield = req.body['pofield'];
    let pofieldvalue = req.body['pofieldvalue'];
  
    console.log(key);
    
    (async () => {
        let result = await query.updateBlock(key,user,pofield,pofieldvalue)
        
        if (result == 0)
        {
            res.json({"Prcourement order does not exist with key ID": key})

        }
        else
        {
            res.json({"Updated": result})
        }
        
      })();
    //res.send('Update submitted successfully')
})
    

app.post('/writews',(req,res)=>{

    var user = req.body['user'];
    var key = req.body['Id'];
    var purchaseOrder = {
        "Id"                : req.body['Id'],
        "PRNo"              : req.body['PRNo'],
        "PRRequestedBy"     : req.body['PRRequestedBy'],
        "PRRequestDate"     : req.body['PRRequestDate'],
        "PRApprovedBy"      : req.body['PRApprovedBy'],
        "PRApprovedDate"    : req.body['PRApprovedDate'],
        "PRStatus"          : req.body['PRStatus'],
        "ItemId"            : req.body['ItemId'],
        "VendorEstdCost": req.body['VendorEstdCost'],
        "PREstdQuantity"   : req.body['PREstdQuantity'],
        "VendorEstdTotalCost": req.body['VendorEstdTotalCost'],
        "VendorQuotedate": req.body['VendorQuotedate'],
        "PONo"              : req.body['PONo'],
        "OrderedQuantity"   : req.body['OrderedQuantity'],
        "OrderedItemCost"   : req.body['OrderedItemCost'],
        "OrderedTotalCost"  : req.body['OrderedTotalCost'],
        "OrderDate"         : req.body['OrderDate'],
        "SupplierId"        : req.body['SupplierId'],
        "SupplierAddress"   : req.body['SupplierAddress'],
        "PORequestedBy"     : req.body['PORequestedBy'],
        "POReqContact"      : req.body['POReqContact'],
        "PORequestedDate"   : req.body['PORequestedDate'],
        "POApprovedBy"      : req.body['POApprovedBy'],
        "POApprovedDate"    : req.body['POApprovedDate'],
        "POStatus"          : req.body['POStatus'],
        "DeliveryAddress"   : req.body['DeliveryAddress'],
        "DeliveryDate"      : req.body['DeliveryDate'],
        "DeliveredDate"     :req.body['DeliveredDate'],
        "GenStatus"     :req.body['GenStatus']
    };

    (async () => {
        let result = await query.writeblockdata(user,key,purchaseOrder)
        
        res.json({"Purchase Order submitted successfully": result})
        
      })();

})

app.post('/queryblock',(req,res)=>{
    
    let key = req.body['key'];
   
    console.log("Purchase order of key ID :",key);

    (async () => {
        let result = await query.getblockbykey(key)
        result = result.toString('utf-8')
        result = JSON.parse(result)
        
        res.json({"PurchaseOrder": result})
        
      })();
})


app.post('/registeruser',(req,res)=>{
    
    let username = req.body['username'];
  
    (async () => { 
        let result = await query.registeruser(username)
                
        switch(result)
        {
            case 0:
                res.send("An identity for the user already exists in the wallet") 
                break;
            case 1:
                res.send('An identity for the admin user "admin" does not exist in the wallet. Run the enrollAdmin.js application before retrying') 
                break;
            case 2:
                res.json({'Failed to register user :':username}) 
                break;
            case 200:
                res.json({"Successfully registered and imported it into the wallet for user : ":username}) 
        }
    })();
})

app.post('/removeuser',(req,res)=>{
    
    let requester = req.body['requester'];
    let username = req.body['username'];

    (async () => { 
        let result = await query.removeuser(requester,username)
                
        switch(result)
        {
            case 0:
                res.send("Identity does not exist for the requested user to be removed ") 
                break;
            case 1:
                res.send('Remove request cannot br processed as admin identity does not exist in the wallet for requester user:')

                break;
            case 2:
                res.send('Remove request cannot br processed as request was not sent from admin user')

                break;
            case 3:
                res.json({'Failed to remove user :':username}) 
                break;
            case 200:
                res.json({"Now Successfully removed from the wallet for user: ":username}) 
        }
    })();
})



app.get('/getblocks',(req,res)=>{

    (async () => {
        let result = await query.getblocks()
        result = result.toString('utf-8')
        result = JSON.parse(result)
        
        res.json({"AllData": result})
        
      })();

})

app.post('/writeVendorQuotation',(req,res)=>{

    var key = req.body['QuoteId'];
    var quotation = {
        "BlockFor" : "quotation",
        "QuoteId" : req.body['QuoteId'],
        "PRId" : req.body['PRId'],
        "Quotations" : req.body['Quotations'],
        "ProductIds" : req.body['ProductIds'],
        "Remarks" : req.body['Remarks'],
        "QuoteBy" : req.body['QuoteBy'],
        "QuoteDate" : req.body['QuoteDate'],
        "Status" : req.body['Status']
    };

    (async () => {
        let result = await query.writeVendorQuotation(key,quotation)
        
        res.json({"Quotation submitted successfully": result})
        
      })();

})

app.post('/getVendorQuotation',(req,res)=>{
    
    let key = req.body['key'];
   
    console.log("Quotation of key ID :",key);

    (async () => {
        let result = await query.getQuoteByKey(key)
        result = result.toString('utf-8')
        result = JSON.parse(result)
        
        res.json({"VendorQuotes": result})
        
      })();

})



app.listen(port,()=>{console.log("This application is running on the port no :",port)})
