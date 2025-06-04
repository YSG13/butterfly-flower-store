import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🦋 Butterfly & Flower Store</h1>

      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map(p => (
            <li key={p.id} style={{ marginBottom: 10 }}>
              <strong>{p.name}</strong> - ${p.price}<br />
              <em>{p.description}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
