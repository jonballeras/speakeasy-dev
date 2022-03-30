const mainFunction = async () => {
    await userAuth()
    getCartItemsCount(getCookie("cartID"))
    if (document.location.href === "https://tucci-limited.myshopify.com/cart") {
        display_cart_items()
    }
    
}
mainFunction()
