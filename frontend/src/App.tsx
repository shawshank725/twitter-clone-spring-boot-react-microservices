import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "@pages/LandingPage";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import HomePage from "@pages/HomePage";
import ProfilePage from "@pages/ProfilePage";
import SettingsPage from "@pages/SettingsPage";
import Layout from "@pages/Layout";
import ProtectedRoute from "@pages/ProtectedRoute";
import { useAuth } from "@context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getUserByUsername } from "@api/service/UserService";
import type { DecodedObject } from "@/types/DecodedObject";
import PublicRoute from "@pages/PublicRoute";
import ConnectionPage from "@pages/ConnectionPage";
import PostViewerPage from "@pages/PostViewerPage";
import BookmarksPage from "@pages/BookmarksPage";
import NotificationPage from "@pages/NotificationPage";
import { connectSocket} from "@socket/SocketClient";
import subscribeToNotifications from "@socket/SocketClient";
import SearchPage from "@pages/SearchPage";
import QuoteRetweetPage from "./pages/QuoteRetweetPage";


function App() {
  
  const {authUser, setAuthUser, setIsLoggedIn, setIsLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  async function fetchUserDetails(username: string) {
    try {
      const { data } = await getUserByUsername(username);
      if (data) {
        setAuthUser(data);
        setIsLoggedIn(true);
        return true;
      }
      throw new Error("No user data found");
    } catch (error) {
      console.error("Error fetching user details:", error);
      localStorage.removeItem("authToken");
      setAuthUser(null);
      setIsLoggedIn(false);
      return false;
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      // if token is not present redirect to auth page.
      if (!token){
        setAuthUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
        if (!["/auth", "/login", "/register"].includes(pathname)) {
          navigate("/auth", { replace: true });
        }
        return;
      }

      //if token is present then do something
      try {
        // decode the token
        const decoded: DecodedObject = jwtDecode(token);
        const { sub: username, exp } = decoded;
        const nowTime = Date.now() /1000;

        // if expiration of the token is done
        if (exp < nowTime) {
          console.log("Token expired");
          localStorage.removeItem("authToken");
          setAuthUser(null);
          setIsLoggedIn(false);
          setIsLoading(false);
          navigate("/auth", {replace: true});
          return;
        }

        // if token is not yet expired
        else {
          
          const timeUntilExpiry = (exp - nowTime) * 1000;
          const timeout = setTimeout(()=> {
            console.log("token timeout occured");
            localStorage.removeItem("authToken");
            setAuthUser(null);
            setIsLoggedIn(false);
            setIsLoading(false);
            navigate("/auth", {replace: true});
            return;
          }, timeUntilExpiry);

          if (pathname === "/"){
            navigate("/home", {replace: true});
          }

          // fetch user details if the expiration is not done
          const userFetched = await fetchUserDetails(username);
          setIsLoading(false);

          // check if user is fetched or not
          if (!userFetched){
            console.log("failed to fetch user details");
            navigate("/auth", {replace: true});
          }          
          return ()=> clearTimeout(timeout);
        }
      }
      catch (error ){
        console.log("error decoding the token");
        localStorage.removeItem("authToken");
        setAuthUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
        navigate("/auth", { replace: true });
      }
    }
    checkAuth();

  }, [navigate, setAuthUser, setIsLoggedIn, setIsLoading, pathname]);

  useEffect(()=> {
    if (authUser) {
      connectSocket(() => {
        console.log(`Subscribing to notifications for user ID: ${authUser.id}`);
        subscribeToNotifications(authUser.id);
      });
    } else {
      console.log("No authUser or token, skipping WebSocket connection");
    }
  }, [authUser]);

  return (
    <Routes>
      <Route path="/auth" element={ <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route  path="/login"  element={  <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route  path="/register"  element={  <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route  path="/"  element={ <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<HomePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path=":username" element={<ProfilePage />} />
        <Route path=":username/:connectionType" element={<ConnectionPage />} />
        <Route path="post/:postId" element={<PostViewerPage />} />
        <Route path="post/:postId/quotePosts" element={<QuoteRetweetPage />} />
        <Route path="bookmarks" element={<BookmarksPage />} />
        <Route path="notifications" element={<NotificationPage />} />
        <Route path="search" element={<SearchPage />} />

      </Route>
    </Routes>
  );
}

export default App;