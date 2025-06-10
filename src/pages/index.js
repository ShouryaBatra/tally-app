import { useAuth } from "../contexts/AuthContext";
import Auth from "../components/Auth";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { currentUser } = useAuth();

  return <div>{currentUser ? <Dashboard /> : <Auth />}</div>;
}
