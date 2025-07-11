import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login({ setIsLoggedIn, setCurrentUser, ...props }) {
  const [isLoggedIn, setLocalIsLoggedIn] = useState(false);
  const [currentUser, setLocalCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('login');
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    profilePhoto: null,
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ email: '' });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    if (!user) return '';
    
    // First try displayName
    if (user.displayName && user.displayName.trim()) {
      return user.displayName;
    }
    
    // If no displayName, try to extract name from email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Convert email username to proper name (e.g., "rajeshkumar75" -> "Rajesh Kumar")
      return emailName
        .replace(/[0-9]/g, '') // Remove numbers
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim() || emailName; // Fallback to original email name if empty
    }
    
    return 'User';
  };


  // Persist login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userObj = {
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL || '',
          displayName: user.displayName || '',
          phoneNumber: user.phoneNumber || '',
          providerId: user.providerId || '',
        };
        setLocalCurrentUser(userObj);
        setLocalIsLoggedIn(true);
        if (setIsLoggedIn) setIsLoggedIn(true);
        if (setCurrentUser) setCurrentUser(userObj);
      } else {
        setLocalIsLoggedIn(false);
        setLocalCurrentUser(null);
        if (setIsLoggedIn) setIsLoggedIn(false);
        if (setCurrentUser) setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [setIsLoggedIn, setCurrentUser]);



  // Login handler with email verification check
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        await signOut(auth);
        alert("Please verify your email before logging in. Check your inbox for a verification link.");
        return;
      }
      const userObj = {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL || '',
        displayName: user.displayName || '',
        phoneNumber: user.phoneNumber || '',
        providerId: user.providerId || '',
      };
      setLocalCurrentUser(userObj);
      setLocalIsLoggedIn(true);
      if (setIsLoggedIn) setIsLoggedIn(true);
      if (setCurrentUser) setCurrentUser(userObj);
      alert(`Welcome back, ${getUserDisplayName(user)}!`);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  // Helper to setup invisible reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
    }
  };

  // Send OTP handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setSendingOtp(true);
    if (!registerForm.mobile || !/^\+\d{10,15}$/.test(registerForm.mobile)) {
      setRegisterError("Please enter a valid mobile number with country code, e.g. +919999999999");
      setSendingOtp(false);
      return;
    }
    console.log("auth instance:", auth); // Debug line
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, registerForm.mobile, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error) {
      setRegisterError("Failed to send OTP: " + error.message);
    }
    setSendingOtp(false);
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setRegisterError("");
    if (!otp) {
      setRegisterError("Please enter the OTP sent to your mobile number.");
      return;
    }
    try {
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
    } catch (error) {
      setRegisterError("Invalid OTP. Please try again.");
    }
  };

  // Registration handler with email verification
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    if (!registerForm.fullName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setRegisterError("Please fill in all required fields.");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }
    if (!registerForm.agree) {
      setRegisterError("You must agree to the Terms & Conditions.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email, registerForm.password);
      const user = userCredential.user;

      let photoURL = "";
      if (registerForm.profilePhoto) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, registerForm.profilePhoto);
        photoURL = await getDownloadURL(photoRef);
      }
      
      // Update user profile with display name and photo
      await updateProfile(user, { 
        displayName: registerForm.fullName,
        photoURL: photoURL || user.photoURL 
      });

      await setDoc(doc(db, 'users', user.uid), {
        fullName: registerForm.fullName,
        email: registerForm.email,
        profilePhoto: photoURL,
        createdAt: new Date().toISOString()
      });
      await sendEmailVerification(user);
      setRegisterSuccess('Registration successful! Please check your email to verify your account before logging in.');
      setRegisterForm({
        fullName: '',
        email: '',
        profilePhoto: null,
        password: '',
        confirmPassword: '',
        agree: false
      });
      setActiveTab('login');
    } catch (error) {
      setRegisterError('Registration failed: ' + error.message);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    
    if (!forgotPasswordForm.email) {
      setForgotPasswordError('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotPasswordForm.email);
      setForgotPasswordSuccess('Password reset email sent! Please check your inbox and follow the instructions.');
      setForgotPasswordForm({ email: '' });
    } catch (error) {
      setForgotPasswordError('Failed to send password reset email: ' + error.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setLocalIsLoggedIn(false);
    setLocalCurrentUser(null);
    setLoginForm({ email: '', password: '' });
    if (setIsLoggedIn) setIsLoggedIn(false);
    if (setCurrentUser) setCurrentUser(null);
  };

  if (isLoggedIn) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          padding: '2rem',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '40px 8px 40px 8px',
          position: 'relative',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}>
          <div style={{
            background: 'transparent',
            padding: '2rem',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 102,
            width: '100%',
            maxWidth: 700,
            textAlign: 'center',
          }}>
            <h1 style={{ color: '#222', fontSize: '2rem', marginBottom: '1rem' }}>🎉 Welcome Back!</h1>
            <p style={{ 
              color: '#28a745', 
              fontSize: '1.1rem', 
              marginBottom: '2rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
              fontWeight: 'bold'
            }}>
              You are successfully logged in as: <strong>{getUserDisplayName(currentUser)}</strong>
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ 
                color: '#28a745', 
                marginBottom: '1rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                fontWeight: 'bold'
              }}>
                You can now access the Upload Portal to share family photos and videos.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.href = '/upload-portal'}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                📤 Go to Upload Portal
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '40px 8px 40px 8px',
        position: 'relative',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <div style={{
          background: 'transparent',
          padding: '2rem',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 102,
          width: '100%',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h1 style={{ position: 'relative', zIndex: 102, color: '#222', fontSize: '2rem', marginBottom: '1rem', textAlign: 'left', width: '100%' }}>Login / Registration</h1>
          <p style={{ position: 'relative', zIndex: 102, color: '#000', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'left', width: '100%' }}>
            Secure family login to upload and manage photos and videos from our ancestral house.
          </p>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 101 }}>
            <button
              onClick={() => setActiveTab('login')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: 8,
                background: activeTab === 'login' ? '#007bff' : 'transparent',
                color: activeTab === 'login' ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: activeTab === 'login' ? 'bold' : 'normal',
                position: 'relative', zIndex: 102
              }}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: 8,
                background: activeTab === 'register' ? '#007bff' : 'transparent',
                color: activeTab === 'register' ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: activeTab === 'register' ? 'bold' : 'normal',
                position: 'relative', zIndex: 102
              }}
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab('forgot-password')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: 8,
                background: activeTab === 'forgot-password' ? '#007bff' : 'transparent',
                color: activeTab === 'forgot-password' ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: activeTab === 'forgot-password' ? 'bold' : 'normal',
                position: 'relative', zIndex: 102
              }}
            >
              Forgot Password
            </button>
          </div>

          {/* Login Tab */}
          {activeTab === 'login' && (
            <div style={{ background: 'transparent', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', position: 'relative', zIndex: 101 }}>
              <h2 style={{ color: '#333', fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'left', width: '100%', padding: '0 1rem' }}>👨‍👩‍👧‍👦 Family Login</h2>
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 102, padding: '0 1rem' }}>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label htmlFor="login-email" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Family Email *</label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your family email"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label htmlFor="login-password" style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Password *</label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{
                  position: 'relative', zIndex: 105,
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  Login to Family Portal
                </button>
              </form>
            </div>
          )}

          {/* Registration Tab */}
          {activeTab === 'register' && (
            <div style={{ background: 'transparent', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', position: 'relative', zIndex: 101 }}>
              <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem', padding: '0 1rem' }}>📝 Register</h2>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 102, padding: '0 1rem' }}>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={registerForm.fullName}
                    onChange={e => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={e => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setRegisterForm(prev => ({ ...prev, profilePhoto: file }));
                      }
                    }}
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                  />
                  <small style={{ color: '#666', fontSize: '0.8rem' }}>Optional: Upload a profile photo</small>
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Password *</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={registerForm.password}
                      onChange={e => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem 2.5rem 0.75rem 0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                    />
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 106 }}
                      tabIndex={0}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Confirm Password *</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={registerForm.confirmPassword}
                      onChange={e => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      style={{ position: 'relative', zIndex: 105, padding: '0.75rem 2.5rem 0.75rem 0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                    />
                    <span
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 106 }}
                      tabIndex={0}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={registerForm.agree}
                    onChange={e => setRegisterForm(prev => ({ ...prev, agree: e.target.checked }))}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <label htmlFor="agree-terms" style={{ position: 'relative', zIndex: 104, fontSize: '0.9rem' }}>
                    I agree to the Terms & Conditions *
                  </label>
                </div>
                <button type="submit" style={{
                  position: 'relative', zIndex: 105,
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  Register
                </button>
                <div id="recaptcha-container"></div>
                {registerError && <div style={{ color: 'red', marginTop: '1rem', position: 'relative', zIndex: 105 }}>{registerError}</div>}
                {registerSuccess && <div style={{ color: 'green', marginTop: '1rem', position: 'relative', zIndex: 105 }}>{registerSuccess}</div>}
              </form>
            </div>
          )}

          {/* Forgot Password Tab */}
          {activeTab === 'forgot-password' && (
            <div style={{ background: 'transparent', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', position: 'relative', zIndex: 101 }}>
              <h2 style={{ position: 'relative', zIndex: 102, color: '#333', fontSize: '1.5rem', marginBottom: '1rem', padding: '0 1rem' }}>🔑 Forgot Password</h2>
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 102, padding: '0 1rem' }}>
                <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 103, width: '100%' }}>
                  <label style={{ position: 'relative', zIndex: 104, display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', textAlign: 'left', width: '100%' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={forgotPasswordForm.email}
                    onChange={e => setForgotPasswordForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    style={{ position: 'relative', zIndex: 105, padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, width: '100%', textAlign: 'left', boxSizing: 'border-box' }}
                  />
                </div>
                <button type="submit" style={{
                  position: 'relative', zIndex: 105,
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  Send Password Reset Link
                </button>
                {forgotPasswordError && <div style={{ color: 'red', marginTop: '1rem', position: 'relative', zIndex: 105 }}>{forgotPasswordError}</div>}
                {forgotPasswordSuccess && <div style={{ color: 'green', marginTop: '1rem', position: 'relative', zIndex: 105 }}>{forgotPasswordSuccess}</div>}
                <div style={{ marginTop: '1rem', position: 'relative', zIndex: 105 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    style={{
                      background: 'transparent',
                      color: '#007bff',
                      border: '1px solid #007bff',
                      padding: '0.5rem 1rem',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textDecoration: 'none'
                    }}
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem 0', 
        marginTop: 'calc(2rem - 5px)'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.5)',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <footer style={{ color: 'rgb(0,0,0)', fontSize: '0.9rem', margin: 0, fontWeight: 600, textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}>
            © 2025 The Moothedath Ancestral House. All rights reserved. | Preserving family heritage and memories for generations to come.
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login; 