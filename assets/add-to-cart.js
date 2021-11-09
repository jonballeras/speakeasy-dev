
window.addEventListener("message", (event) => {
  // Do we trust the sender of this message?  (might be
  // different from what we originally opened, for example).
  if (event.origin !== "https://tuccilimited.myshopify.com")
    
  const itemsId = event.data
  console.log(itemsId)
  // event.source is popup
}, false);  




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



//itemsId.forEach(addToCart);