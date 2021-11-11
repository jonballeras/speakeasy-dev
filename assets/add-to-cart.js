
const getUserId = async () => {
  const response = await fetch('https://api.ipify.org/?format=json')
  const result = await response.json() 
  const userId = result.ip
  return userId
}

const changeUpdateField = (messagesRef, handleName, userId) => {
  messagesRef.set({
    handle: handleName,
    update: true,
    userid: userId
  })
}

const firebaseConfig = () => {
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
  firebase.initializeApp(firebaseConfig);
  
}


const addToCart = async () => { 
  firebaseConfig()
  const userId = await getUserId();
  const messagesRef = firebase.database().ref("users/" + userId.replaceAll(".",""));
  messagesRef
    .once("value")
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const productID = snapshot.val();
        if (productID.userid === userId){
          if (!productID.update){
            changeUpdateField(messagesRef,productID.handle, productID.userid)
            console.log(true)
            console.log(productID.handle);
            jQuery.getJSON(`/products/${productID.handle}.js`, (product) => {
              console.log(product.variants[0].id);
              let formData = {
                items: [
                  {
                    id: product.variants[0].id,
                    quantity: 2,
                  },
                ],
              };
              fetch("/cart/add.js", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });
            });
          }
        }
        
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

addToCart()

console.log(routes.cart_url)

