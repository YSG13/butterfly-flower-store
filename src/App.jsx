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
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

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
const storage = getStorage(app);

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lang, setLang] = useState("en");

  const [sisterName, setSisterName] = useState("");
  const [sisterImage, setSisterImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleSisterAdd = async () => {
    if (!sisterImage || !sisterName) return alert("Enter name and choose an image");
    setUploading(true);

    const imageRef = ref(storage, `sisters_collection/${sisterImage.name}`);
    await uploadBytes(imageRef, sisterImage);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, "sisters_collection"), {
      name: sisterName,
      imageUrl,
      addedBy: auth.currentUser?.email || "unknown",
      timestamp: Date.now(),
    });

    setSisterName("");
    setSisterImage(null);
    setUploading(false);
    alert("Added to Sister's Collection!");
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

  return (
    <div style={{ padding: 20 }}>
      <h1>{t("Welcome", "أهلاً", "بەخێربێیت")}, {user.email}</h1>
      <button onClick={logout}>{t("Logout", "تسجيل الخروج", "دەرچوون")}</button>

      <h2>{t("Products", "المنتجات", "کەلوپەل")}</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - {p.price}
            <button onClick={() => addToCart(p)}>{t("Add", "أضف", "زێدەبکە")}</button>
          </li>
        ))}
      </ul>

      <h2>{t("Cart", "السلة", "سەبەتە")}</h2>
      <ul>
        {cart.map((p, i) => (
          <li key={i}>{p.name} - {p.price}</li>
        ))}
      </ul>

      <button onClick={checkout}>{t("Checkout", "ادفع", "پارەدان")}</button>

      {user.email === "SISTER_EMAIL_HERE" && (
        <div>
          <h2>Sister's Collection - Add Product</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={sisterName}
            onChange={(e) => setSisterName(e.target.value)}
          />
          <br />
          <input type="file" onChange={(e) => setSisterImage(e.target.files[0])} />
          <br />
          <button onClick={handleSisterAdd} disabled={uploading}>
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </div>
      )}
    </div>
  );
}
