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

app.post('/writews',(req,res)=>{

    var key = req.body['Id'];
    var purchaseOrder = {
        "Id"                : req.body['Id'],
        "PRNo"              : req.body['PRNo'],
        "PRPurpose"         : req.body['PRPurpose'],
        "PRRequestedBy"     : req.body['PRRequestedBy'],
        "PRRequestDate"     : req.body['PRRequestDate'],
        "PRApprovedBy"      : req.body['PRApprovedBy'],
        "PRApprovedDate"    : req.body['PRApprovedDate'],
        "PRStatus"          : req.body['PRStatus'],
        "ItemId"            : req.body['ItemId'],
        "EstimatedCost"     : req.body['EstimatedCost'],
        "EstimatedAmount"   : req.body['EstimatedAmount'],
        "EstimatedTotalCost": req.body['EstimatedTotalCost'],
        "PONo"              : req.body['PONo'],
        "OrderedQuantity"   : req.body['OrderedQuantity'],
        "OrderedItemCost"   : req.body['OrderedItemCost'],
        "OrderedTotalCost"  : req.body['OrderedTotalCost'],
        "OrderDate"         : req.body['OrderDate'],
        "SupplierId"        : req.body['SupplierId'],
        "SupplierAddress"   : req.body['SupplierAddress'],
        "PORequestedBy"     : req.body['PORequestedBy'],
        "PORequestedDate"   : req.body['PORequestedDate'],
        "POApprovedBy"      : req.body['POApprovedBy'],
        "POApprovedDate"    : req.body['POApprovedDate'],
        "POStatus"          : req.body['POStatus'],
        "DeliveryDate"      : req.body['DeliveryDate']
    };

    (async () => {
        let result = await query.writeblockdata(key,purchaseOrder)
        
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

app.get('/getblocks',(req,res)=>{

    (async () => {
        let result = await query.getblocks()
        result = result.toString('utf-8')
        result = JSON.parse(result)
        
        res.json({"AllData": result})
        
      })();

})


app.listen(port,()=>{console.log("This application is running on the port no :",port)})
