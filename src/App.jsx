// src/App.jsx
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    loadProducts();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Hello Butterfly 🦋</h1>
      <p>If you're seeing this, it's working!</p>

      <h2>🌸 Products from Firestore:</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <strong>{product.name}</strong> — {product.price} IQD
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
