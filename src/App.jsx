import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => doc.data());
      setProducts(data);
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>🦋 Butterfly & Flower Store</h1>
      <ul>
        {products.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> – {item.price} IQD
          </li>
        ))}
      </ul>
    </div>
  );
}
