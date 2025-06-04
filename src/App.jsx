
// App.jsx
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);

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
    } catch (err) {
      alert(err.message);
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      alert("Account created. You can now log in.");
      setShowRegister(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent.");
      setShowReset(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = () => {
    signOut(auth);
    setCart([]);
  };

  const checkout = async () => {
    if (!user || cart.length === 0) return;
    await addDoc(collection(db, "orders"), {
      user: user.email,
      items: cart,
      timestamp: Date.now(),
    });
    alert("Order placed!");
    setCart([]);
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Login</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
        <button onClick={() => setShowRegister(true)}>Register</button>
        <button onClick={() => setShowReset(true)}>Forgot Password?</button>

        {showRegister && (
          <div>
            <h2>Register</h2>
            <input
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={register}>Create Account</button>
          </div>
        )}

        {showReset && (
          <div>
            <h2>Reset Password</h2>
            <button onClick={resetPassword}>Send Reset Email</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Wings and Petals</h1>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>

      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - {p.price}
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <h2>Your Cart</h2>
      <ul>
        {cart.map((item, i) => (
          <li key={i}>{item.name} - {item.price}</li>
        ))}
      </ul>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}
