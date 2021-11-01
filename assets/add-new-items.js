const data = `{
  products(first:5) {
    edges {
      node {
        id
        title
      }
    }
  }
}`

fetch({
  url: 'https://speak-easy-dev.myshopify.com/api/2021-10/graphql.json',
  type: 'POST',
  headers: {
  	"X-Shopify-Storefront-Access-Token": "1a83e16bed23e5a02c54024f170205dc",
    "Content-Type": "application/json",
  },
  Accept: "application/json",
  body: JSON.stringify({
    query: data
  })
})
//.then(r => r.json())
//.then(data => console.log('data returned:', data));