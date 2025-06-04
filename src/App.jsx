import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8F6F2] font-sans">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/fib-payment" element={<FibPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/sister-upload" element={<SisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Header() {
  return (
    <div className="bg-purple-700 text-white px-4 py-2 flex justify-between items-center">
      <Link to="/home" className="text-xl font-bold">WINGS&PETELS</Link>
      <div className="space-x-4">
        <span>🔍</span>
        <Link to="/cart">🛒</Link>
        <span>👤</span>
      </div>
    </div>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen">
      <div className="p-8 w-full md:w-1/2">
        <h1 className="text-2xl font-bold mb-4">LOGIN</h1>
        <input type="email" placeholder="Username or email address" className="w-full p-2 border border-gray-400 mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border border-gray-400 mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => navigate('/home')} className="w-full bg-[#D6452E] text-white py-2 font-bold">LOG IN</button>
        <div className="text-sm text-right mt-2 text-[#D6452E] cursor-pointer">Lost your password?</div>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
        </div>
      </div>
      <div className="p-8 w-full md:w-1/2">
        <h1 className="text-2xl font-bold mb-4">REGISTER</h1>
        <p className="mb-4 text-sm">Registering allows you to access order status and history.</p>
        <button className="bg-gray-200 text-black font-bold py-2 px-4">REGISTER</button>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <Header />
      <div className="text-center my-4 space-x-4">
        <button className="font-bold">flowers</button>
        <button className="font-bold">butterfly's</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border h-40 flex items-center justify-center font-bold text-lg">product</div>
        ))}
      </div>
    </div>
  );
}

function CartPage() {
  const cartEmpty = true;
  return (
    <div>
      <Header />
      <div className="text-center mt-20 text-2xl font-bold">
        {cartEmpty ? 'cart is empty' : 'cart items here'}
        <p className="text-sm mt-2">go back to home</p>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold mb-6">checkout</h1>
        <div className="border h-48 w-3/4 mx-auto mb-6 flex items-center justify-center">items</div>
        <div className="flex justify-center space-x-4">
          <button onClick={() => navigate('/fib-payment')} className="bg-black text-white px-4 py-2">FIB</button>
          <button onClick={() => navigate('/confirmation')} className="bg-black text-white px-4 py-2">cash on delevery</button>
        </div>
      </div>
    </div>
  );
}

function FibPage() {
  return (
    <div>
      <Header />
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold mb-4">FIB payment method</h1>
        <p>please send money to —</p>
      </div>
    </div>
  );
}

function ConfirmationPage() {
  return (
    <div>
      <Header />
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">your order is place will get to you in 1–7 day</h1>
        <p className="mt-6">thank you for ordering</p>
      </div>
    </div>
  );
}

function SisterPage() {
  return (
    <div>
      <Header />
      <div className="text-center mt-12 space-y-4">
        <input type="text" placeholder="name" className="p-2 border w-1/2" /><br />
        <input type="text" placeholder="price" className="p-2 border w-1/2" /><br />
        <select className="p-2 border w-1/2">
          <option value="">select category</option>
          <option value="resin">resin</option>
          <option value="no resin">no resin</option>
        </select><br />
        <div className="flex justify-center">
          <img src="/camera-icon.png" alt="camera" className="w-24 h-24" />
        </div>
      </div>
    </div>
  );
}
