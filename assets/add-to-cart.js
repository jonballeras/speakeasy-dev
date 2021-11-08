const itemsId = JSON.parse(window.localStorage.getItem("speak-easy:shopify:cart")).items ;


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

itemsId.forEach(addToCart);