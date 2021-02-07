const express = require('express') 
const app = express() 
var ejs = require('ejs')
var cors = require('cors')
var localStorage = require('localStorage')
var stripe = require('stripe')('sk_test_51IHrU3APmv9etn05skZsqk4yS5AoAVir3f5zZqHCH8Jy0AqfMf77HelD7thKyXXlF7YDEYx2Qo8ITIOpUK8sICC600tkSfAgQY')
const port = 3000 
var YOUR_DOMAIN = 'http://localhost:3000'


app.use(cors())
app.set('view engine', 'ejs')

app.get('/', (req, res) => { 
		res.render('index', { title: 'Hello World' }) 
}) 

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/failed',
  });
  res.json({ id: session.id });
	localStorage.setItem('id',session.id)
});


app.get('/success', async (req, res) => {
	if(localStorage.getItem('id')) {
	const session = await stripe.checkout.sessions.retrieve(localStorage.getItem('id'));
	localStorage.setItem('id',null)
	if(session.payment_status == 'paid') {
		res.send('Thanks For Buying')
	} else {
		res.send('Something Went Wrong')
	}
	} else {
		res.send('Please Initiate a Payment')
	}
})

app.get('/failed', (req,res) => {
	res.send('Failed')
})


app.listen(port, () => { 
		console.log(`Example app listening at http://localhost:${port}`) 
})