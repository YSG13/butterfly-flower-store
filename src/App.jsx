import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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

const adminEmail = "Yousify.talabani2012@gmail.com";
const productContributorEmails = [adminEmail]; // add your sister's email when ready

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lang, setLang] = useState("en");
  const [isSignup, setIsSignup] = useState(false);

  const t = (en, ar, ku) => (lang === "ar" ? ar : lang === "ku" ? ku : en);

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
      alert("Signup failed: " + error.message);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
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

  const addProduct = async () => {
    const name = prompt("Product name:");
    const price = prompt("Price:");
    const type = prompt("Type (Resin/Regular):");
    if (name && price && type) {
      await addDoc(collection(db, "products"), { name, price, type });
      alert("Product added!");
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(products.filter(p => p.id !== id));
  };

  const canDelete = user && user.email === adminEmail;
  const canAdd = user && productContributorEmails.includes(user.email);

  if (!user)
    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
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
        <button onClick={isSignup ? signup : login}>{isSignup ? t("Sign Up", "اشتراك", "خۆتۆمارکردن") : t("Login", "دخول", "چوونەژوورەوە")}</button>
        <button onClick={resetPassword}>{t("Forgot Password?", "هل نسيت كلمة المرور؟", "وشەی نهێنی لەبیرچوە؟")}</button>
        <br />
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? t("Have an account? Login", "عندك حساب؟ سجل دخول", "هەژمارت هەیە؟ بچۆ ژوورەوە") : t("No account? Sign up", "ما عندك حساب؟ اشترك", "هەژمار نیە؟ خۆتۆماربکە")}
        </button>
        <br /><br />
        <button onClick={() => setLang("en")}>English</button>
        <button onClick={() => setLang("ar")}>العربية</button>
        <button onClick={() => setLang("ku")}>کوردی</button>
      </div>
    );

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32 }}>{t("Wings and Petals", "أجنحة وبتلات", "باڵ و گۆڵ")}</h1>
      <p>{t("Welcome", "أهلاً", "بەخێربێیت")}, {user.email}</p>
      <button onClick={logout}>{t("Logout", "تسجيل الخروج", "دەرچوون")}</button>

      {canAdd && <button onClick={addProduct} style={{ marginLeft: 10 }}>{t("Add Product", "أضف منتج", "زێدەکردنی بەرهەم")}</button>}

      <h2>{t("Products", "المنتجات", "کەلوپەل")}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {products.map((p) => (
          <div key={p.id} style={{ padding: 20, boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: 10 }}>
            <h3>{p.name}</h3>
            <p>{t("Price", "السعر", "نرخ")}: {p.price}</p>
            <p>{t("Type", "النوع", "جۆر")}: {p.type}</p>
            <button onClick={() => addToCart(p)}>{t("Add to Cart", "أضف إلى السلة", "زیادکردن بۆ سەبەتە")}</button>
            {canDelete && <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: 10 }}>{t("Delete", "حذف", "سڕینەوە")}</button>}
          </div>
        ))}
      </div>

      <h2>{t("Your Cart", "السلة", "سەبەتە")}</h2>
      <ul>
        {cart.map((p, i) => (
          <li key={i}>{p.name} - {p.price}</li>
        ))}
      </ul>

      <button onClick={checkout} style={{ marginTop: 10 }}>{t("Checkout", "ادفع", "پارەدان")}</button>
    </div>
  );
}
