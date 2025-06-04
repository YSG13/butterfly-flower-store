import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "products");
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => doc.data());
      setProducts(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Hello Butterfly 🦋</h1>
      <ul>
        {products.map((p, i) => (
          <li key={i}>{p.name} - {p.price}</li>
        ))}
      </ul>
    </div>
  );
}
