import React, { useState, useEffect } from "react";
import { Products, Navbar, Cart, Checkout } from "./components";
import { commerce } from "./lib/commerce";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    console.log(data, "fetcjProducts");
    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
    //    console.log(commerce.cart.retrieve(), "cart retieve");
  };

  const handleAddToCart = async (productId, quantity) => {
    const { cart } = await commerce.cart.add(productId, quantity);
    // console.log(item.cart, "item cart");
    setCart(cart);
  };
  const handleUpdateQuantity = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });
    // console.log(item.cart, "item cart");
    setCart(cart);
  };
  const handleRemoveFromCart = async (productId) => {
    const { cart } = await commerce.cart.remove(productId);
    // console.log(item.cart, "item cart");
    setCart(cart);
  };
  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();
    // console.log(item.cart, "item cart");
    setCart(cart);
  };

  const refreshCart = async () => {
    console.log(cart.total_items, "total_items-1");
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
    console.log(cart.total_items, "total_items-2");
    // debugger;
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );
      setOrder(incomingOrder);
      console.log("handleCaptureCheckout");
      refreshCart();
    } catch (error) {
      console.log("handleCaptureCheckout-1");
      refreshCart();
      setErrorMessage(error);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);
  console.log(cart, products, "cart commerce");
  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path="/cart">
            <Cart
              cart={cart}
              handleUpdateQuantity={handleUpdateQuantity}
              handleRemoveFromCart={handleRemoveFromCart}
              handleEmptyCart={handleEmptyCart}
            />
          </Route>
          <Route exact path="/checkout">
            <Checkout
              cart={cart}
              handleCaptureCheckout={handleCaptureCheckout}
              order={order}
              error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
