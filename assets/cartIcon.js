


const getCartItemsCount = async (cartID) => {
  let count = 0
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
            lines(first:100) {
              edges {
                node {
                  id
                  quantity
                
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
  data?.data?.cart?.lines?.edges?.forEach(element => {
      count = count + element?.node?.quantity
  });
  document.getElementsByClassName("cart-count-bubble")[0].children[0].innerText = count
  return data
}

// getCartItemsCount(getCookie("cartID"))