/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        
        //const result = await contract.evaluateTransaction('readData',"key1");
        //console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        //let result = await contract.evaluateTransaction('readData',"p1");
        //let result = await contract.evaluateTransaction('queryPatientsByDiagnosis',"cancer");
        //console.log(result);
        //result = result.toString('utf-8')
        //console.log(result)

        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

async function getpatientbydiagnosis(diagnosis){
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    console.log("Querying by the diagnosis :",diagnosis)
    let result = await contract.evaluateTransaction('queryPatientsByDiagnosis',diagnosis);
    //console.log(result);
    result = result.toString('utf-8')
    console.log(result)
    console.log("Result is showing from query webservice function")
    return result
    
}


async function writeblockdata(user,key, purchaseOrder){
try {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    //console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(user);
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    
   

    console.log("Writing block....")
    
    console.log("Purchase order :",purchaseOrder['PRNo'])

    let result = await contract.submitTransaction("writeJsonData",key, JSON.stringify(purchaseOrder));
    result = result.toString('utf-8')
    result = JSON.parse(result)
    
    console.log('Transaction has been submitted');
   
    await gateway.disconnect();
    
    return result
    
} catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

async function updateBlock(key, user, pofield, pofieldvalue){
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        //console.log(`Wallet path: ${walletPath}`);
    
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user);
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
    
        // Get the contract from the network.
        const contract = network.getContract('fabcar');
        
        
        // Get the Procurement order block
        let assetJSON = await contract.evaluateTransaction('readData',key);
        
        
        // Checking if the Procurement order exists with queried key
        if (assetJSON==0) {
            
            //console.log("Inside if codeblock....")
            return 0;
        }

        // string transformation of binary data
        assetJSON = assetJSON.toString('utf-8')
        assetJSON = JSON.parse(assetJSON)
        
        // Update specific field of the order
        switch (pofield) {
            case "Id":
                    assetJSON.Id = pofieldvalue;
                    break;
            case "PRNo":
                    assetJSON.PRNo = pofieldvalue;
                    break;
            case "PRPurpose":
                    assetJSON.PRPurpose = pofieldvalue;
                    break;
            case "PRRequestedBy":
                    assetJSON.PRRequestedBy = pofieldvalue;
                    break;
            case "PRRequestDate":
                    assetJSON.PRRequestDate = pofieldvalue;
                    break;
            case "PRApprovedBy":
                    assetJSON.PRApprovedBy = pofieldvalue;
                    break;
            case "PRApprovedDate":
                    assetJSON.PRApprovedDate = pofieldvalue;
                    break;
            case "PRStatus":
                    assetJSON.PRStatus = pofieldvalue; 
                    break;
            case "ItemId":
                    assetJSON.ItemId = pofieldvalue;
                    break;
            case "EstimatedCost":
                    assetJSON.EstimatedCost = pofieldvalue;
                    break;
            case "EstimatedAmount":
                    assetJSON.EstimatedAmount = pofieldvalue;
                    break;
            case "EstimatedTotalCost":
                    assetJSON.EstimatedTotalCost = pofieldvalue;    
                    break;
            case "PONo":
                    assetJSON.PONo = pofieldvalue;
                    break;
            case "OrderedQuantity":
                    assetJSON.OrderedQuantity = pofieldvalue; 
                    break;
            case "OrderedItemCost":
                    assetJSON.OrderedItemCost = pofieldvalue;
                    break;
            case "OrderedTotalCost":
                    assetJSON.OrderedTotalCost = pofieldvalue;
                    break;
            case "OrderDate":
                    assetJSON.OrderDate = pofieldvalue;    
                    break;
            case "SupplierId":
                    assetJSON.SupplierId = pofieldvalue;
                    break;
            case "SupplierAddress":
                    assetJSON.SupplierAddress = pofieldvalue; 
                    break;
            case "PORequestedBy":
                    assetJSON.PORequestedBy = pofieldvalue;
                    break;
            case "POReqContact": 
                    assetJSON.POReqContact = pofieldvalue;
                    break;
            case "PORequestedDate":
                    assetJSON.PORequestedDate = pofieldvalue;
                    break;
            case "POApprovedBy":
                    assetJSON.POApprovedBy = pofieldvalue;
                    break;
            case "POApprovedDate":
                    assetJSON.POApprovedDate = pofieldvalue;
                    break;
            case "POStatus":
                    assetJSON.POStatus = pofieldvalue;
                    break;
            case "DeliveryAddress":
                    assetJSON.DeliveryAddress = pofieldvalue;        
                    break;
            case "DeliveryDate":
                    assetJSON.DeliveryDate = pofieldvalue;        
                    break;
            default:
                break;
        }
        
        //Write the updated order in database  
        let result = await contract.submitTransaction("writeJsonData",key, JSON.stringify(assetJSON));
        result = result.toString('utf-8')
        result = JSON.parse(result)
        
        console.log('Transaction has been submitted');
       
        await gateway.disconnect();
        
        return result
        
    } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

async function getblockbykey(key){
    try{
        // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    
    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    
    console.log("Querying by the key in query.js:",key)
    
    let result = await contract.evaluateTransaction('readData',key);
        
    return result
    }
    catch(error){
        console.error(`Failed to retrieve transactions: ${error}`);
        process.exit(1);
    }
}

async function getblocks(){
    try{
        // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    
    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    
    console.log("Querying all blocks in query.js")
    
    let result = await contract.evaluateTransaction('getAllData');
        
    return result
    }
    catch(error){
        console.error(`Failed to retrieve blocks: ${error}`);
        process.exit(1);
    }
}

<<<<<<< Updated upstream
async function writeVendorQuotation(key, vendorQuotation){
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        //console.log(`Wallet path: ${walletPath}`);
    
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
    
        // Get the contract from the network.
        const contract = network.getContract('fabcar');
        
       
    
        console.log("Writing block....")
        
        console.log("Vendor Quotation :",vendorQuotation['QuoteId'])
    
        let result = await contract.submitTransaction("writeVerdorQuote",key, JSON.stringify(vendorQuotation));
        result = result.toString('utf-8')
        result = JSON.parse(result)
        
        console.log('Transaction has been submitted');
       
        await gateway.disconnect();
        
        return result
        
    } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

async function getQuoteByKey(key){
    try{
        // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    
    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    
    console.log("Querying by the key in query.js:",key)
    
    let result = await contract.evaluateTransaction('readVendorQuote',key);
        
    return result
    }
    catch(error){
        console.error(`Failed to retrieve transactions: ${error}`);
        process.exit(1);
    }
}
=======
async function registeruser(username){
        try{
>>>>>>> Stashed changes

        let user = username;

        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(user);
        if (userIdentity) {
                console.log('An identity for the user already exists in the wallet');
                return 0;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return 1;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
                affiliation: 'org1.department1',
                enrollmentID: user,
                role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
                enrollmentID: user,
                enrollmentSecret: secret
        });
        const x509Identity = {
                credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
        };
        await wallet.put(user, x509Identity);
        console.log('Successfully registered and imported it into the wallet for user : ',user);
        return 200;
        }
        catch(error){
                console.error(`Failed to register user : ${error}`);
                return 2;
            
        }
}

module.exports = {
    getpatientbydiagnosis : getpatientbydiagnosis,
    writeblockdata : writeblockdata,
    getblockbykey : getblockbykey,
    getblocks : getblocks,
<<<<<<< Updated upstream
    getQuoteByKey : getQuoteByKey,
    writeVendorQuotation : writeVendorQuotation
=======
    updateBlock : updateBlock,
    registeruser : registeruser
>>>>>>> Stashed changes

}
main();
