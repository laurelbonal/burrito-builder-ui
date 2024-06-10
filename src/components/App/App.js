import { useEffect, useState } from "react";
import "./App.css";
import { getOrders, addOrder } from "../../apiCalls";
import Orders from "../../components/Orders/Orders";
import OrderForm from "../../components/OrderForm/OrderForm";

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data.orders))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const handleAddOrder = (newOrder) => {
    addOrder(newOrder)
      .then((order) => setOrders([...orders, order]))
      .catch((err) => console.error("Error adding order:", err));
  };

  return (
    <main className="App">
      <header>
        <h1>Burrito Builder</h1>
        <OrderForm addOrder={handleAddOrder} />
      </header>

      <Orders orders={orders} />
    </main>
  );
}

export default App;