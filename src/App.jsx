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
  const sisterEmail = ""; // Add her email here later

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
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">
          {isSignup ? t("Sign Up", "تسجيل", "خۆتۆمارکردن") : t("Login", "تسجيل الدخول", "چوونەژوورەوە")}
        </h1>
        <input
          className="border rounded p-2 mb-2"
          type="email"
          placeholder={t("Email", "البريد الالكتروني", "ئیمەیڵ")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded p-2 mb-2"
          type="password"
          placeholder={t("Password", "كلمة السر", "وشەی نهێنی")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="space-x-2">
          <button className="bg-pink-500 text-white px-4 py-2 rounded" onClick={isSignup ? signup : login}>
            {isSignup ? t("Sign Up", "تسجيل", "خۆتۆمارکردن") : t("Login", "دخول", "چوونەژوورەوە")}
          </button>
          <button className="text-sm text-blue-500 underline" onClick={resetPassword}>
            {t("Forgot Password?", "نسيت كلمة المرور؟", "وشەی نهێنی لەبیر کردووە؟")}
          </button>
          <button className="text-sm text-gray-600 underline" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? t("Switch to Login", "الذهاب لتسجيل الدخول", "بگۆڕە بۆ چوونەژوورەوە") : t("Create new account", "إنشاء حساب جديد", "دروستکردنی هەژمار")}
          </button>
        </div>
        <div className="mt-4 space-x-2">
          <button onClick={() => setLang("en")}>English</button>
          <button onClick={() => setLang("ar")}>العربية</button>
          <button onClick={() => setLang("ku")}>کوردی</button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🦋 Butterfly & Flower Store</h1>
        <div className="space-x-4">
          <span>{user.email}</span>
          <button className="bg-red-400 text-white px-3 py-1 rounded" onClick={logout}>
            {t("Logout", "تسجيل الخروج", "دەرچوون")}
          </button>
        </div>
      </header>

      {(isAdmin || isSister) && (
        <div className="mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={addProduct}>
            {t("Add Product", "أضف منتج", "زیادکردنی بەرهەم")}
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">{t("Products", "المنتجات", "کەلوپەل")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-medium">{p.name}</h3>
            <p className="mb-2">{p.price}</p>
            <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => addToCart(p)}>
              {t("Add", "أضف", "زێدەبکە")}
            </button>
            {(isAdmin || isSister) && (
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteProduct(p.id)}>
                {t("Delete", "حذف", "سڕینەوە")}
              </button>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">{t("Cart", "السلة", "سەبەتە")}</h2>
      <ul className="list-disc ml-5">
        {cart.map((p, i) => (
          <li key={i}>{p.name} - {p.price}</li>
        ))}
      </ul>

      <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded" onClick={checkout}>
        {t("Checkout", "ادفع", "پارەدان")}
      </button>
    </div>
  );
}