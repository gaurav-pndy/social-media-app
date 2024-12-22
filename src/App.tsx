import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./pages/PrivateRoute";

const App = () => {
  return (
    <div className="md:px-52">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes for unauthenticated users */}

            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />

            {/* Protected Routes for authenticated users */}

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Default Route  */}

            <Route path="/" element={<Auth />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
