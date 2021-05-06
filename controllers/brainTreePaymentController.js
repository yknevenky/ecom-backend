require("dotenv").config();
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.merchantId,
    publicKey: process.env.publicKey,
    privateKey: process.env.privateKey,
  });


exports.getToken = (req, res) => {
    gateway.clientToken.generate({
      }, (err, response) => {
        if(err){
            return res.status(500).send(err)
        }else{
            return res.send(response)
        }
      });
}

exports.processPayment = (req, res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              return res.status(500).json(err)
          }else{
              return res.json(result)
          }
      });
}