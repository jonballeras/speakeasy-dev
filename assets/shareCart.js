const checkCartExpiration = async (cartID) => {
  const result = await fetch(
    "https://certor.myshopify.com/api/2022-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          "c4a175a451ef9a51834f51a6a3c3d208",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
        { 
          cart(id:"${cartID}") {
            id
          }
        }
      `
      }),
    }
  );
  const data = await result.json();
  return data
}

const createCarte = async () => {

  const result = await fetch(
    "https://certor.myshopify.com/api/2022-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          "c4a175a451ef9a51834f51a6a3c3d208",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation cartCreate  {
          cartCreate {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              code
              field
              message
            }
          }
        }
      `
      }),
    }
  );
  const data = await result.json();
  console.log(data.data.cartCreate.cart.id);
  return data.data.cartCreate.cart.id
}

const getProductsCart = async (cartID) => {
  const result = await fetch(
    "https://certor.myshopify.com/api/2022-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          "c4a175a451ef9a51834f51a6a3c3d208",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
        { 
          cart(id:"${cartID}") {
          id
          lines(first:10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                  id
                  sku
                }
              }
            }
          }
        }
        }
      }
      `
      }),
    }
  );
  const data = await result.json();
  return data?.data?.cart?.lines?.edges
}

const updateCart = async (items, cartID) => {
  const result = await fetch(
    "https://certor.myshopify.com/api/2022-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          "c4a175a451ef9a51834f51a6a3c3d208",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
            }
            userErrors {
              code
              field
              message
            }
          }
        }
      `,
      variables: {
        cartId: cartID,
        lines: items,
        
      },
      }),
    }
  );
  const data = await result.json();
  if (!data?.data){
    // console.log( data)
  }else{
    setCookie("cartID", cartID, 14);
  }
  return data
}

const getUserId = async () => {
  const response = await fetch("https://api.ipify.org/?format=json");
  const result = await response.json();
  const userId = result.ip.replaceAll(".", "");
  return userId;
};

const creatProductList = async (cartData) => {
  let productList = []
  cartData.data.cart.lines.edges.map((item) => {
    productList.push({
      
      "merchandiseId": item.node.merchandise.id,
      "quantity": parseInt(item.node.quantity)
    })
  })
  return productList
}
const filterTwoReference = (arr1, arr2) => {
  let res = [];
  res = arr1.filter(el => {
    return !arr2.find(element => {
      return element.id === el.id;
        });
    });
    return res;
  }


const checkFirebaseDatabase = async (userIp, uid) => {
  const messagesRef = firebase.database().ref("users/" + userIp + "/" + uid);

  messagesRef
    .once("value")
    .then(async (snapshot) => {
      
      if (snapshot.exists()) {
        const cart = snapshot.val();
        // firabaseCartID = cart id comes from firebase endpoint
        const firabaseCartID = cart.cartID

        // cookieCartID = cart id that stored in Cookies  
        const cookieCartID = getCookie("cartID")

        if (!cookieCartID){

          // if cookiesCartID is emty then save Global cart ID on browser cookies
          // but before that we need to see if Global cart not expired 
          const checkCart = await checkCartExpiration(firabaseCartID)
          if (checkCart?.data?.cart?.id){
            setCookie("cartID", firabaseCartID, 14);
          } else {
            // then global cart expired so we will create new cart and 
            // add it to firebase and browser cookies  
            createCarte().then((cartId) => {
              setCookie("cartID", cartId, 14)
              messagesRef.set({
                cartID: cartId
              })
            })
          }
          
        } else if (firabaseCartID !== cookieCartID) {

          // if Gobal cart Id  and cartID of cookies browser not same 
          // then fetch all products of cookieCartID and add them to Global cart 

          //  fetch all product from cookieCartID
          const localCartsProducts = await getProductsCart(cookieCartID)

          if (localCartsProducts?.data?.cart){

            // if cookieCartID not expired yet 
            // get all products of Global cart  
            const globalCartsProducts = await getProductsCart(firabaseCartID)

            if (globalCartsProducts?.data?.cart){
              
              // if Global Cart not expired and localcart not expired then 
              // check if local cart's items  in global cart then update global cart 
              // if not on global cart then add it to global cart 

              const localCartProductsList = await creatProductList(localCartsProducts)
              const globalCartProductsList = await creatProductList(globalCartsProducts)
              // get products from local cart that not appear in global cart 
              const productMustAdded =  filterTwoReference(localCartProductsList,globalCartProductsList)
              // update global cart
              updateCart(productMustAdded, firabaseCartID)
              // set global cart in cookies
              setCookie("cartID", firabaseCartID, 14);

            } else {

              // if Global cart has expired 
              // create new one and save it on firebase and on browser cookies 
              createCarte().then((cartId) => {
                setCookie("cartID", cartId, 14)
                messagesRef.set({
                  cartID: cartId
                })
              })              

            }
          } else {
            // if cookieCartID expired we need test if the global cart not expired , 
            // if not expred then save the global cart on browser cookies 
            // if expired then create new cart and save it on firebase and coolies 

            const checkCart = await checkCartExpiration(firabaseCartID)
            if (checkCart?.data?.cart?.id){
              setCookie("cartID", firabaseCartID, 14);
            } else {
              // then global cart expired so we will create new cart and 
              // add it to firebase and browser cookies  
              createCarte().then((cartId) => {
                setCookie("cartID", cartId, 14)
                messagesRef.set({
                  cartID: cartId 
                })
              })
            }

          }
        }   

      } else {

        // if Cookies contain a cartId then get it and send it with firebase endpoint 
        if (getCookie("cartID")) {
          messagesRef.set({
            cartID: getCookie("cartID")
          })
        } else {
          // if not create shopify Cart and send it with firebase endpoint
          createCarte().then((cartId) => {
            setCookie("cartID", cartId, 14)
            messagesRef.set({
              cartID: cartId
            })
          })
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const userAuth = async () => {
  const userIpAddress = await getUserId();

  if (userIpAddress !== localStorage.getItem('userIpAdress')) {
    //change the userIpAddress of localstorage with currently user ip address
    localStorage.setItem("userIpAdress", userIpAddress)
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;

      checkFirebaseDatabase(userIpAddress, uid);
      // ...
    } else {
      var email = "imed@example.com";
      var password = "23061998qwerty";
      // [START auth_signup_password]
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          var uid = user.uid;

          checkFirebaseDatabase(userIpAddress, uid);
          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage)
        });
    }
  })

};



