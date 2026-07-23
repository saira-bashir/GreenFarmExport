import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { useTranslation } from 'react-i18next';

function Auth() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdminLogin: false
  });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'sahrabashir228@gmail.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (isLogin) {
        // Login Logic
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        const enteredEmail = formData.email.trim().toLowerCase();

        if (formData.isAdminLogin) {
          if (enteredEmail === ADMIN_EMAIL) {
            alert('Welcome Admin!');
            navigate('/admin');
          } else {
            setErrorMsg('Access Denied: This email does not have administrator privileges.');
          }
        } else {
          if (enteredEmail === ADMIN_EMAIL) {
            alert('Welcome Admin! Redirecting to dashboard...');
            navigate('/admin');
          } else {
            alert(`Welcome back, ${user.email}! Logged in successfully.`);
            navigate('/'); 
          }
        }
      } else {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // 🌟 Update Firebase Auth Profile with Name
        await updateProfile(user, {
          displayName: formData.name
        });

        const enteredEmail = formData.email.trim().toLowerCase();
        const role = enteredEmail === ADMIN_EMAIL ? 'admin' : 'buyer';

        // Firestore mein user data save karna
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          role: role,
          createdAt: new Date()
        });

        alert(`Account created successfully for ${formData.name}!`);
        setIsLogin(true); 
      }
    } catch (error) {
      console.error("Auth Error:", error.message);
      setErrorMsg(error.message); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border">
        
        <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
          {isLogin ? t('welcomeBack', 'Welcome Back') : t('createAccount', 'Create an Account')}
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {isLogin ? t('accessDashboard', 'Access your Green Farm Export dashboard') : t('joinNetwork', 'Join our global B2B trade network')}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium text-sm">{t('fullNameLabel', 'Full Name / Company Name')}</label>
              <input 
                type="text" 
                required 
                className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g. John Traders"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium text-sm">{t('emailLabel', 'Email Address')}</label>
            <input 
              type="email" 
              required 
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">{t('passwordLabel', 'Password')}</label>
            <input 
              type="password" 
              required 
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {isLogin && (
            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="adminCheck"
                className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-600 cursor-pointer"
                checked={formData.isAdminLogin}
                onChange={(e) => setFormData({...formData, isAdminLogin: e.target.checked})}
              />
              <label htmlFor="adminCheck" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Login as Administrator (Admin Panel)
              </label>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition"
          >
            {isLogin ? t('loginBtn', 'Login') : t('signUpBtn', 'Sign Up')}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          {isLogin ? (
            <p>
              {t('noAccountPrompt', "Don't have an account?")}{' '}
              <button 
                type="button"
                onClick={() => setIsLogin(false)} 
                className="text-green-700 font-bold hover:underline"
              >
                {t('signUpBtn', 'Sign Up')}
              </button>
            </p>
          ) : (
            <p>
              {t('hasAccountPrompt', 'Already have an account?')}{' '}
              <button 
                type="button"
                onClick={() => setIsLogin(true)} 
                className="text-green-700 font-bold hover:underline"
              >
                {t('loginBtn', 'Login')}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Auth;