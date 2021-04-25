import Commerce from '@chec/commerce.js'

export  const commerce = new Commerce(process.env.REACT_APP_PUBLIC_KEY,true);

// commerce.products.list().then((product) => console.log(product,"commerce.js"));