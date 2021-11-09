const getItemsId = async () => {
	const itemsId = await JSON.parse(window.localStorage.getItem("speak-easy:shopify:cartItems")) ;	
  	return itemsId
} 



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

const itemsId = getItemsId();
console.log(itemsId)
//itemsId.forEach(addToCart);