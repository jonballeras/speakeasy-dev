if (document.location.href === "https://tucci-limited.myshopify.com/cart") {
    document.getElementsByName("updates[]").forEach(element => {
        element.addEventListener("change", (ele) => {
            console.log("hi")
            // ajax change quantity 
        })
    })
    

}

const cartID = getCookie("cartID") 

const increaseCartsProducts = async (localVariantId,handleName ,SKUvalue,itemIndex, globalProduct = false) => {
    if (globalProduct) {

    } else {
        // get variant id of the product on certor store 
        const globalVariantID = await getProductVarient(handleName,SKUvalue)
        // add Product To global Cart
        const data = await addProductToCart_Request(globalVariantID,1,cartID )

        // display CartTotalAmount of the cart
        const CartTotalAmount =  data?.cartLinesAdd?.cart?.estimatedCost?.subtotalAmount?.amount
        const CartTotalAmountCurrency =  data?.cartLinesAdd?.cart?.estimatedCost?.subtotalAmount?.currencyCode
        document.getElementsByClassName("totals__subtotal-value")[0].innerText = "$" + CartTotalAmount + " " + CartTotalAmountCurrency

        // update Product's quantity in local Cart
        const response = await addLineLocalCart(localVariantId, 1)
        // update Line Price on website  
        const lineItem = response.items.find((item) => {return item.sku === SKUvalue})
        const finalLinePrice =`$${lineItem.final_line_price/100}`
        const cartItemDiv = document.getElementById(`CartItem-${itemIndex}`)
        cartItemDiv.querySelector("#original_line_price").innerText = finalLinePrice

        
        document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText = 
        parseInt(document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText) + 1
    }
    
}

const decreaseCartsProducts = async (element, localVariantId ,SKUvalue ,itemIndex=false , globalProduct=false ) => {
    
    if (globalProduct){

    }else {
        const quantity = parseInt(element.nextElementSibling.value) - 1
        // get Cart Line id of the product on certor store 
        const data = await getProductsCart(cartID)
    
        const globalCartLineID = data.find((variant) => {
            return variant.node.merchandise.sku === SKUvalue
        })
    
        // display CartTotalAmount of the cart 
        const cartData = await updateProductToCart_Request(globalCartLineID.node.id, quantity, cartID)
        const CartTotalAmount = cartData?.cartLinesUpdate?.cart?.estimatedCost?.subtotalAmount?.amount
        const CartTotalAmountCurrency = cartData?.cartLinesUpdate?.cart?.estimatedCost?.subtotalAmount?.currencyCode
        document.getElementsByClassName("totals__subtotal-value")[0].innerText = "$" + CartTotalAmount + " " + CartTotalAmountCurrency
    
        // update Product's quantity in local Cart
        const response = await updateLocalCart(localVariantId, quantity)
        const lineItem = response.items.find((item) => { return item.sku === SKUvalue })
        const finalLinePrice = `$${lineItem.final_line_price / 100}`
        const cartItemDiv = document.getElementById(`CartItem-${itemIndex}`)
        cartItemDiv.querySelector("#original_line_price").innerText = finalLinePrice

        console.log(response.item_count)
        document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText = response.item_count
    }
    
}

const removeCartsProducts = async (localVariantId, SKUvalue, itemIndex=false, globalProduct=false ) => {
    console.log("removeCartsProducts .....")

    if (globalProduct){

    } else {
        const cartID = cartID
        // get Cart Line id of the product on certor store 
        const data = await getProductsCart(cartID)
        
        const globalCartLineID = data.find((variant) => {
            return variant.node.merchandise.sku === SKUvalue
        })
        console.log(globalCartLineID)
        // add Product To global Cart
        const cartData = await updateProductToCart_Request(globalCartLineID.node.id,0, cartID)
        const cartItemDiv = document.getElementById(`CartItem-${itemIndex}`)
        cartItemDiv.style.display = "none"
        const CartTotalAmount =  cartData?.cartLinesUpdate?.cart?.estimatedCost?.subtotalAmount?.amount
        const CartTotalAmountCurrency =  cartData?.cartLinesUpdate?.cart?.estimatedCost?.subtotalAmount?.currencyCode
        document.getElementsByClassName("totals__subtotal-value")[0].innerText = "$" + CartTotalAmount + " " + CartTotalAmountCurrency

        // update Product's quantity in local Cart
        response = await updateLocalCart(localVariantId, 0)
        document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText = response.item_count

    }
    
  }
