import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
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
  const [isSignup, setIsSignup] = useState(false);

  const adminEmail = "Yousify.talabani2012@gmail.com";
  const addOnlyEmail = ""; // Add your sister's email here later

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

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  const resetPassword = async () => {
    if (!email) return alert("Enter your email first");
    await sendPasswordResetEmail(auth, email);
    alert("Reset email sent");
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

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(products.filter((p) => p.id !== id));
  };

  const t = (en, ar, ku) => (lang === "ar" ? ar : lang === "ku" ? ku : en);

  if (!user)
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
        <h1>Wings and Petals 🦋🌸</h1>
        <h2>{t("Login", "تسجيل الدخول", "چوونەژوورەوە")}</h2>
        <input
          type="email"
          placeholder={t("Email", "البريد الالكتروني", "ئیمەیڵ")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder={t("Password", "كلمة السر", "وشەی نهێنی")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button onClick={isSignup ? signup : login}>
          {isSignup ? t("Sign Up", "إنشاء حساب", "خۆتۆمارکردن") : t("Login", "دخول", "چوونەژوورەوە")}
        </button>
        <p style={{ cursor: "pointer", color: "blue" }} onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? t("Already have an account? Login", "لديك حساب؟ سجل الدخول", "هەژمارت هەیە؟ بچۆ ژوورەوە") : t("New? Sign up", "جديد؟ أنشئ حساب", "تازەیت؟ خۆتۆمار بکە")}
        </p>
        <p style={{ cursor: "pointer", color: "green" }} onClick={resetPassword}>
          {t("Forgot Password?", "نسيت كلمة السر؟", "وشەی نهێنیت لەبیرچووە؟")}
        </p>
        <br />
        <button onClick={() => setLang("en")}>English</button>
        <button onClick={() => setLang("ar")}>العربية</button>
        <button onClick={() => setLang("ku")}>کوردی</button>
      </div>
    );

  const isAdmin = user.email === adminEmail;
  const canAddOnly = user.email === addOnlyEmail;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🌸 Wings and Petals 🦋</h1>
      <p style={{ textAlign: "center" }}>{t("Welcome", "أهلاً", "بەخێربێیت")}, {user.email}</p>
      <button onClick={logout}>{t("Logout", "تسجيل الخروج", "دەرچوون")}</button>

      <h2>{t("Products", "المنتجات", "کەلوپەل")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 10 }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p>{p.price}</p>
            <button onClick={() => addToCart(p)}>{t("Add to Cart", "أضف إلى السلة", "زێدە بکە")}</button>
            {(isAdmin || canAddOnly) && (
              <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: 10, color: "red" }}>X</button>
            )}
          </div>
        ))}
      </div>

      <h2>{t("Cart", "السلة", "سەبەتە")}</h2>
      <ul>
        {cart.map((p, i) => (
          <li key={i}>{p.name} - {p.price}</li>
        ))}
      </ul>

      <button onClick={checkout}>{t("Checkout", "ادفع", "پارەدان")}</button>

      {(isAdmin || canAddOnly) && (
        <div style={{ marginTop: 30 }}>
          <h3>{t("Add New Product", "أضف منتج جديد", "کەلوپەلی نوێ زێدە بکە")}</h3>
          <AddProductForm db={db} setProducts={setProducts} />
        </div>
      )}
    </div>
  );
}

function AddProductForm({ db, setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const addProduct = async () => {
    const docRef = await addDoc(collection(db, "products"), {
      name,
      price,
      description,
    });
    setProducts((prev) => [...prev, { id: docRef.id, name, price, description }]);
    setName("");
    setPrice("");
    setDescription("");
  };

  return (
    <div>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} /><br />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}
