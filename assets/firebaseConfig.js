const firebaseConfig = () => {
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
  };
firebaseConfig();