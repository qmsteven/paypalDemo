var express = require('express');
var router = express.Router();
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox',
  'client_id': 'AQjbDEnbhyigK_0H4wc_ehW2WEw8BR2ital2NI2bTQdNW7vrU_OLIm4-lWZhsshuaQWPVqg4Q-r9pP8C',
  'client_secret': 'EDiNkKwOE3F7NPpJkrRBKa8lGn3vXa5TyGrXNClbf7epbC4nx__hvwbcTxbmxwdBHisQYDQegCCIw817'
});

//Email sb-heimh15107193@personal.example.com
//Password NF;W7Iy$


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PayPal Integration Demo' });
});


router.post('/payTheInvisibleKingdom', function(req, res,next) {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "The Invisible Kingdom",
                "sku": "001",
                "price": "18.99",
                "currency": "CAD",
                "quantity": 1

              }]
            },
            "amount": {
                "currency": "CAD",
                "total": "18.99"
            },
            "description": "book"
        }]
     };
     
     paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              res.redirect(payment.links[i].href);
            }
          }
      }
  });
});
     
router.get('/success', function(req, res,next)  {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "CAD",
            "total": "18.99"
        }
    }]
  };

paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {

  if (error) {
    console.log(error.response);
    throw error;
} else {
    console.log(JSON.stringify(payment));
    res.render('success', { title: 'Transaction successful' });
  }
});
});

router.get('/cancel', function(req, res,next){
res.render('cancel', { title: 'Transaction canceled' });
});



module.exports = router;
