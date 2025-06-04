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
  const sisterEmail = ""; // <- Add her email here later

  const isAdmin = user?.email === adminEmail;
  const isSister = user?.email === sisterEmail;

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
    if (!email) return alert("Enter your email first.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (error) {
      alert("Error: " + error.message);
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
    const name = prompt("Product name?");
    const price = prompt("Product price?");
    if (name && price) {
      await addDoc(collection(db, "products"), { name, price });
      alert("Product added");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    alert("Product deleted");
  };

  const t = (en, ar, ku) => (lang === "ar" ? ar : lang === "ku" ? ku : en);

  if (!user)
    return (
      <div style={{ padding: 20 }}>
        <h1>{isSignup ? t("Sign Up", "تسجيل", "خۆتۆمارکردن") : t("Login", "تسجيل الدخول", "چوونەژوورەوە")}</h1>
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
        <button onClick={isSignup ? signup : login}>
          {isSignup ? t("Sign Up", "تسجيل", "خۆتۆمارکردن") : t("Login", "دخول", "چوونەژوورەوە")}
        </button>
        <button onClick={resetPassword}>{t("Forgot Password?", "نسيت كلمة المرور؟", "وشەی نهێنی لەبیر کردووە؟")}</button>
        <br />
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? t("Switch to Login", "الذهاب لتسجيل الدخول", "بگۆڕە بۆ چوونەژوورەوە") : t("Create new account", "إنشاء حساب جديد", "دروستکردنی هەژمار")}
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

      {(isAdmin || isSister) && (
        <button onClick={addProduct}>{t("Add Product", "أضف منتج", "زیادکردنی بەرهەم")}</button>
      )}

      <h2>{t("Products", "المنتجات", "کەلوپەل")}</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - {p.price}
            <button onClick={() => addToCart(p)}>{t("Add", "أضف", "زێدەبکە")}</button>
            {(isAdmin || isSister) && (
              <button onClick={() => deleteProduct(p.id)}>{t("Delete", "حذف", "سڕینەوە")}</button>
            )}
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
    </div>
  );
}
