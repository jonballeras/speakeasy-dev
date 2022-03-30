
const addProductToCart_Request = async (variantID,quantity,cartID) => {
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
            mutation cartLinesAdd($lines: [CartLineInput!]!, $cartId: ID!) {
              cartLinesAdd(lines: $lines, cartId: $cartId) {
                cart {
                  id
                  estimatedCost {
                    subtotalAmount {
                      amount
                      currencyCode
                    }
                  }
                  lines(first:100) {
                    edges {
                      node {
                        id
                        estimatedCost{
                          subtotalAmount{
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
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
          "lines": [
            {
              "merchandiseId": variantID,
              "quantity": parseInt(quantity)
            }
          ],
          "cartId": cartID
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
  return data?.data || false
}

const updateProductToCart_Request = async (variantID,quantity,cartID) => {
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
          mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
              cart {
                id
                estimatedCost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                }
                lines(first:100) {
                  edges {
                    node {
                      id
                      estimatedCost{
                        subtotalAmount{
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
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
          "lines": 
            {
              "id": variantID,
              "quantity": parseInt(quantity)
            }
          ,
          "cartId": cartID
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
    return data?.data || false
}

const getProductVarient = async (handleName, SKU) => {
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
            query {
                product(handle:"${handleName}") {
                
                    handle
                    variants(first:100) {
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
    const variants = data.data.product.variants.edges
    const correctVariant = variants.filter((variant) => {
        return variant.node.sku === SKU
    })
    return correctVariant[0]?.node?.id
}




const add_item_to_cart = async (SKU, handleName) => {

  const cartID = getCookie("cartID")
  const quantity = document.getElementsByName("quantity")[0].value
  const variantID = await getProductVarient(handleName, SKU)
  addProductToCart_Request(variantID,quantity,cartID)
  
}

