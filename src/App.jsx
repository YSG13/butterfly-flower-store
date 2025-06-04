import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [sisterProducts, setSisterProducts] = useState([]);
  const [sisterName, setSisterName] = useState("");
  const [sisterImage, setSisterImage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    };

    const fetchSisterProducts = async () => {
      const snapshot = await getDocs(collection(db, "sister-products"));
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSisterProducts(items);
    };

    fetchProducts();
    fetchSisterProducts();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item) => setCart([...cart, item]);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Sign-up failed: " + error.message);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
    } catch (error) {
      alert("Reset failed: " + error.message);
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

  const handleAddSisterProduct = async (e) => {
    e.preventDefault();
    if (!sisterName || !sisterImage) return;
    await addDoc(collection(db, "sister-products"), {
      name: sisterName,
      image: sisterImage,
    });
    setSisterName("");
    setSisterImage("");
    const snapshot = await getDocs(collection(db, "sister-products"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSisterProducts(items);
  };

  const t = (en, ar, ku) => (lang === "ar" ? ar : lang === "ku" ? ku : en);

  if (!user)
    return (
      <div style={{ padding: 20 }}>
        <h1>{isSignUp ? t("Sign Up", "انشاء حساب", "خۆتومارکردن") : t("Login", "تسجيل الدخول", "چوونەژوورەوە")}</h1>
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
        <button onClick={isSignUp ? signup : login}>{isSignUp ? t("Sign Up", "انشاء", "تومارکردن") : t("Login", "دخول", "چوونەژوورەوە")}</button>
        <button onClick={resetPassword}>{t("Forgot Password", "نسيت كلمة السر؟", "وشەی نهێنیت لەبیرچوو؟")}</button>
        <br />
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? t("Have an account? Login", "لديك حساب؟ دخول", "هەژمارت هەیە؟ چوونەژوورەوە") : t("Don't have an account? Sign Up", "ليس لديك حساب؟ انشاء", "هەژمارت نییە؟ تومارکردن")}
        </button>
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

      <h2>{t("With Resin", "بداخل الريزن", "لەگەڵ رەیزن")}</h2>
      <ul>
        {products.filter(p => p.category === "resin").map((p) => (
          <li key={p.id}>{p.name} - {p.price} <button onClick={() => addToCart(p)}>{t("Add", "أضف", "زێدەبکە")}</button></li>
        ))}
      </ul>

      <h2>{t("Without Resin", "بدون الريزن", "بێ رەیزن")}</h2>
      <ul>
        {products.filter(p => p.category === "no-resin").map((p) => (
          <li key={p.id}>{p.name} - {p.price} <button onClick={() => addToCart(p)}>{t("Add", "أضف", "زێدەبکە")}</button></li>
        ))}
      </ul>

      <h2>{t("Cart", "السلة", "سەبەتە")}</h2>
      <ul>
        {cart.map((p, i) => (
          <li key={i}>{p.name} - {p.price}</li>
        ))}
      </ul>

      <button onClick={checkout}>{t("Checkout", "ادفع", "پارەدان")}</button>

      {user.email === "yaro.talabani@gmail.com" && (
        <div className="sisters-collection">
          <h2>Sister’s Collection (Private)</h2>
          <form onSubmit={handleAddSisterProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={sisterName}
              onChange={(e) => setSisterName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={sisterImage}
              onChange={(e) => setSisterImage(e.target.value)}
              required
            />
            <button type="submit">Add Product</button>
          </form>
          <div className="sister-products">
            {sisterProducts.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.image} alt={p.name} />
                <h4>{p.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
