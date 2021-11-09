
const itemsId = await JSON.parse(window.localStorage.getItem("speak-easy:shopify:cartItems")) ;	
  




function addToCart(id){
	jQuery.post('/cart/add.js', {
      items: [
        {
          quantity: 1,
          id: id,
        }
      ]
    });
}


console.log(itemsId)
//itemsId.forEach(addToCart);