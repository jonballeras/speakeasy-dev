
const fetchTucciCart = async () => {
  const itemsData = []
  const result = await fetch(
    "/cart.js",
    {
      method: "GET",
    }
  );
  const data = await result.json()
  // console.log(data)
  data.items.forEach((item, index) => {

    itemsData.push(item.sku)
    itemsData.push(item.variant_id)
    itemsData.push(item.quantity)
    itemsData.push(index)
  })
  return itemsData
}


const updateLocalCart = async (product_id, product_quantity) => {

  let formData = {
    id: `${product_id}`,
    quantity: product_quantity
  };
  const request = await fetch("/cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const response = await request.json()
  return response
}

const addLineLocalCart = async (product_id, quantity) => {
  let formData = {
    items: [
      {
        id: product_id,
        quantity: quantity,
      },
    ],
  };
  const request = await fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const response = await request.json()
  return response
}

const getVariantIdlocalStore = async (handleName, SKU) => {

  const result = await fetch(
    "https://tucci-limited.myshopify.com/api/2022-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          "de1032854f8ed7747efa0ba9d8a63d12",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
        query {
            product(handle:"${handleName}") {
                id
                handle
                variants(first:10) {
                  edges {
                    node {
                      sku
                      id
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
  const variants = data?.data?.product?.variants?.edges
  const correctVariant = variants?.find((variant) => {
    return variant.node.sku === SKU
  }) || false

  return correctVariant?.node?.id || false

}


const display_cart_items = async () => {

  let checkoutURL
  let CartTotalAmount
  const CartID = getCookie("cartID");

  const productsCart = async () => {
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
              cart(id:"${CartID}") {
                id
                checkoutUrl
                lines(first:100) {
                edges {
                  node {
                    id
                    quantity
                    estimatedCost {
                      subtotalAmount {
                        amount
                        currencyCode
                      }
                    }
                    merchandise {
                      ... on ProductVariant {
                        id
                        sku
                        image{
                          url
                        }
                        priceV2{
                          amount
                        }
                        product{
                          vendor
                          title
                          handle
                        }
                        selectedOptions{
                          name
                          value
                        }
                      }
                    }
                  }
                }
              }
              estimatedCost {
                subtotalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        `,
        }),
      }
    );
    const data = await result.json();
    checkoutURL = data?.data?.cart?.checkoutUrl || "/"
    CartTotalAmount = `${data?.data?.cart?.estimatedCost?.subtotalAmount?.amount} ${data?.data?.cart?.estimatedCost?.subtotalAmount?.currencyCode}`
    document.getElementsByClassName("totals__subtotal-value")[0].innerText = "$" + CartTotalAmount
    return data?.data?.cart?.lines?.edges || false
  };

  const cartsItemDomElemts = async (item, localVariantId = false) => {
    document.getElementsByClassName("cart__warnings")[0].style.display = "none"
    document.getElementsByClassName("cart__footer")[0].style.display = "flex"
    document.getElementsByClassName("title-wrapper-with-link")[0].style.display = "flex"
    document.getElementById("cart").style.display = "block"
    document.getElementById("checkout").disabled = false;

    const cartItemsDiv = document.getElementsByTagName("tbody")[0];
    const cartItemDiv = document.getElementById("cart-item").cloneNode(true);

    cartItemDiv.style.display = "table-row";

    cartItemDiv.querySelector(".cart-item__image").src = item.node.merchandise.image.url;
    cartItemDiv.querySelector(".cart-item__name").innerText = item.node.merchandise.product.title;
    cartItemDiv.querySelector("#product-price").innerText = `$${item.node.merchandise.priceV2.amount}`;
    const optionDiv = cartItemDiv.querySelector("#product-option")
    item.node.merchandise.selectedOptions.forEach((option) => {
      const nameDiv = document.createElement("dt")
      const valueDiv = document.createElement("dd")
      nameDiv.innerHTML = option.name + ": "
      valueDiv.innerHTML = option.value
      optionDiv.appendChild(nameDiv)
      optionDiv.appendChild(valueDiv)
    })

    cartItemDiv.querySelector(".quantity__input").value = item.node.quantity;
    cartItemDiv.querySelector("#original_line_price").innerText = `$${item.node.merchandise.priceV2.amount * item.node.quantity}`;
    // document.getElementsByClassName("totals__subtotal-value")[0].innerText = "$" + CartTotalAmount
    cartItemsDiv.appendChild(cartItemDiv);

    // decrease item quantity 
    cartItemDiv.querySelector(".quantity__input").previousElementSibling.addEventListener("click", async () => {
      const data = await updateProductToCart_Request(item.node.id, item.node.quantity - 1, getCookie("cartID"))
      const updatedItem = data.cartLinesUpdate.cart.lines.edges.find(element => {
        return element.node.id === item.node.id
      });


      document.getElementsByClassName("totals__subtotal-value")[0].innerText =
        "$" + data.cartLinesUpdate.cart.estimatedCost.subtotalAmount.amount +
        " " + data.cartLinesUpdate.cart.estimatedCost.subtotalAmount.currencyCode

      cartItemDiv.querySelector("#original_line_price").innerText = "$" + updatedItem.node.estimatedCost.subtotalAmount.amount

      // update item quantity from local cart if this cart from Tucci store 
      localVariantId && updateLocalCart(localVariantId, parseInt(cartItemDiv.querySelector(".quantity__input").value))

      // update cart icone count 
      document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText =
        parseInt(document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText) - 1
    })


    // increase item quantity 
    cartItemDiv.querySelector(".quantity__input").nextElementSibling.addEventListener("click", async () => {

      const data = await addProductToCart_Request(item.node.merchandise.id, 1, getCookie("cartID"))
      const updatedItem = data.cartLinesAdd.cart.lines.edges.find(element => {
        return element.node.id === item.node.id
      });

      document.getElementsByClassName("totals__subtotal-value")[0].innerText =
        "$" + data.cartLinesAdd.cart.estimatedCost.subtotalAmount.amount +
        " " + data.cartLinesAdd.cart.estimatedCost.subtotalAmount.currencyCode

      cartItemDiv.querySelector("#original_line_price").innerText = "$" + updatedItem.node.estimatedCost.subtotalAmount.amount
      // increase product from local cart if this cart from Tucci store 
      localVariantId && addLineLocalCart(localVariantId, 1)

      // update cart icone count 
      document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText =
        parseInt(document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText) + 1
    })

    // remove item 
    cartItemDiv.querySelector("cart-remove-button").addEventListener("click", async () => {
      const data = await updateProductToCart_Request(item.node.id, 0, getCookie("cartID"))

      document.getElementsByClassName("totals__subtotal-value")[0].innerText =
        "$" + data.cartLinesUpdate.cart.estimatedCost.subtotalAmount.amount +
        " " + data.cartLinesUpdate.cart.estimatedCost.subtotalAmount.currencyCode

      cartItemDiv.style.display = "none"
      // remove product from local cart if this cart from Tucci store 
      localVariantId && updateLocalCart(localVariantId, 0)

      document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText =
        parseInt(document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText) - item.node.quantity
    })

  }

  const localCartProducts = await fetchTucciCart()
  const globalCartsItems = await productsCart() || []


  globalCartsItems.forEach(async (item) => {

    if (item.node.merchandise.product.vendor !== "Tucci") {
      cartsItemDomElemts(item)
    } else {
      const product_sku = item.node.merchandise.sku

      if (localCartProducts.includes(product_sku)) {
        const localCartProductSKUIndex = localCartProducts.indexOf(product_sku)
        if (localCartProducts[localCartProductSKUIndex + 2] !== item.node.quantity) {

          const cartItemDiv = document.getElementById(`CartItem-${(localCartProducts[localCartProductSKUIndex + 3]) + 1}`)
          cartItemDiv.querySelector(".quantity__input").value = item.node.quantity;
          cartItemDiv.querySelector("#original_line_price").innerText = "$" + item.node.estimatedCost.subtotalAmount.amount;

          updateLocalCart(localCartProducts[localCartProductSKUIndex + 1], item.node.quantity)
        }
        localCartProducts.splice(localCartProductSKUIndex, 4)
      } else {
        let localProductVariantID = await getVariantIdlocalStore(item.node.merchandise.product.handle, product_sku)
        console.log("localProductVariantID = " + localProductVariantID)
        localProductVariantID = atob(localProductVariantID).split("/").pop()
        addLineLocalCart(localProductVariantID, item.node.quantity)

        cartsItemDomElemts(item, localProductVariantID)

      }
    }

  })
  // after this loop ended if localCartProducts array not empty then 
  // remove product from local cart with the variants in localCartProducts arr 

  for (let index = 1; index < localCartProducts.length; index += 4) {

    updateLocalCart(localCartProducts[index], 0)
    const cartItemDiv = document.getElementById(`CartItem-${localCartProducts[index + 2] + 1}`)
    cartItemDiv.style.display = "none"
  }

  document.querySelectorAll('.cart__checkout-button')[0].addEventListener("click", (e) => {
    e.preventDefault()
    window.location.replace(checkoutURL)
  })


}
// display_cart_items()






