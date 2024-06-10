import { useState } from "react";

function OrderForm({ addOrder }) {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (name && ingredients.length > 1) {
      const newOrder = { name, ingredients };
      addOrder(newOrder);
      clearInputs();
    }
  }

  function clearInputs() {
    setName("");
    setIngredients([]);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function addIngredient(e) {
    e.preventDefault();
    setIngredients([...ingredients, e.target.name]);
  }

  const possibleIngredients = [
    "beans",
    "steak",
    "carnitas",
    "sofritas",
    "lettuce",
    "queso fresco",
    "pico de gallo",
    "hot sauce",
    "guacamole",
    "jalapenos",
    "cilantro",
    "sour cream",
  ];
  const ingredientButtons = possibleIngredients.map((ingredient) => {
    return (
      <button
        key={ingredient}
        name={ingredient}
        onClick={(e) => addIngredient(e)}
      >
        {ingredient}
      </button>
    );
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={(e) => handleNameChange(e)}
      />

      {ingredientButtons}

      <p>Order: {ingredients.join(", ") || "Nothing selected"}</p>

      <button type="submit" disabled={!name || ingredients.length < 2}>
        Submit Order
      </button>
    </form>
  );
}

export default OrderForm;