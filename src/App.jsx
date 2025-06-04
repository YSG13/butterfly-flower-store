import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBT-reYLtGQycKsHl-xl0KQ9aGNGjJlaDU",
  authDomain: "butterfly-flower-store.firebaseapp.com",
  projectId: "butterfly-flower-store",
  storageBucket: "butterfly-flower-store.appspot.com",
  messagingSenderId: "949088048906",
  appId: "1:949088048906:web:e5aadf1f518844d6860cf3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lang, setLang] = useState("en");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", type: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };
    fetchProducts();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCart([]);
  };

  const checkout = async () => {
    if (!user) return;
    await addDoc(collection(db, "orders"), {
      user: user.email,
      items: cart,
      timestamp: Date.now(),
    });
    alert("Order placed!");
    setCart([]);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.type) return;
    await addDoc(collection(db, "products"), newProduct);
    setNewProduct({ name: "", price: "", type: "" });
    alert("Product added.");
  };

  const t = (en, ar, ku) => (lang === "ar" ? ar : lang === "ku" ? ku : en);

  if (!user)
    return (
      <div style={{ padding: 20 }}>
        <h1>{t("Login", "تسجيل الدخول", "چوونەژوورەوە")}</h1>
        <input
          type="email"
          placeholder={t("Email", "البريد الالكتروني", "ئیمەیڵ")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder={t("Password", "كلمة السر", "وشەی نهێنی")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={login}>{t("Login", "دخول", "چوونەژوورەوە")}</button>
        <br />
        <button onClick={() => setLang("en")}>English</button>
        <button onClick={() => setLang("ar")}>العربية</button>
        <button onClick={() => setLang("ku")}>کوردی</button>
      </div>
    );

  const isSister = user.email === "yaro.talabani@gmail.com";

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 32 }}>Wings and Petals</h1>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>

      {isSister && (
        <div style={{ marginTop: 40, background: "#ffe0f0", padding: 20, borderRadius: 10 }}>
          <h2>Sister's Collection - Add Product</h2>
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <select
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="resin">With Resin</option>
            <option value="no-resin">Without Resin</option>
          </select>
          <button onClick={handleAddProduct}>Add Product</button>
        </div>
      )}

      <h2>Products</h2>

      <div style={{ marginBottom: 30 }}>
        <h3>With Resin</h3>
        {products.filter(p => p.type === "resin").map((p) => (
          <div key={p.id} style={{ background: "#f3f3f3", margin: 10, padding: 10, borderRadius: 10 }}>
            <strong>{p.name}</strong><br />
            Price: {p.price}<br />
            Type: {p.type}<br />
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}

        <h3>Without Resin</h3>
        {products.filter(p => p.type === "no-resin").map((p) => (
          <div key={p.id} style={{ background: "#e6f9ff", margin: 10, padding: 10, borderRadius: 10 }}>
            <strong>{p.name}</strong><br />
            Price: {p.price}<br />
            Type: {p.type}<br />
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Your Cart</h2>
      <ul>
        {cart.map((p, i) => (
          <li key={i}>{p.name} - {p.price}</li>
        ))}
      </ul>

      <button onClick={checkout}>Checkout</button>
    </div>
  );
}
