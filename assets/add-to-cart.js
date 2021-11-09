// window.addEventListener("message", (event) => {
//   Do we trust the sender of this message?  (might be
//   different from what we originally opened, for example).
//   console.log(event.origin)
//   const itemsId = event.data
//   console.log(itemsId)

//   event.source is popup
// }, false);

// function addToCart(id){
// 	jQuery.post('/cart/add.js', {
//       items: [
//         {
//           quantity: 1,
//           id: id,
//         }
//       ]
//     });
// }

// itemsId.forEach(addToCart);



// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgV93lM_N0QIbo0Wuq1Hhk98_tdkeB7Hs",
  authDomain: "shopify-share-cart.firebaseapp.com",
  databaseURL: "https://shopify-share-cart-default-rtdb.firebaseio.com",
  projectId: "shopify-share-cart",
  storageBucket: "shopify-share-cart.appspot.com",
  messagingSenderId: "745836433963",
  appId: "1:745836433963:web:d83c54123db2b48fb7906e",
  measurementId: "G-F6N33X2HFB",
};

// Initialize Firebase
var productID 
firebase.initializeApp(firebaseConfig);
var messagesRef = firebase.database().ref('imed');
messagesRef.once('value').then((snapshot) => {
  productID =  snapshot.val()
  console.log(productID)

  // jQuery.getJSON('/products/ginja9-750-ml.js', function(product) {
  //   console.log(product);
  // } );
  
  let formData = {
    'items': [{
     'id': 41044278706375,
     'quantity': 2
     }]
   };
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
});

