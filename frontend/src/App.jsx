import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Layout & pages
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import UpdatePassword from "./pages/UpdatePassword";
import Logout from "./pages/Logout";
import ProtectedRoute from "./pages/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";
import { getCurrentUser } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Uygulama ilk yüklendiğinde mevcut kullanıcıyı kontrol et
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public */}
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="logout" element={<Logout />} />

          {/* Protected */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="update-password"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-posts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
