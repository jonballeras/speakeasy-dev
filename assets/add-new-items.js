$.ajax({
  url: 'https://speak-easy-dev.myshopify.com/api/2021-10/graphql.json',
  type: 'POST',
  headers: {
  	"X-Shopify-Storefront-Access-Token": "1a83e16bed23e5a02c54024f170205dc",
    "Content-Type": "application/json",
  },
  data: {
    json: {
    	query: `{
            products(first:5) {
                edges {
                    node {
                        id
                        title
                    }
                }
            }
}`}
  },
  success: function (result) {
    console.log(JSON.stringify(result));
  },
})