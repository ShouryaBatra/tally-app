import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  doc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  increment,
  runTransaction,
} from "firebase/firestore";
import { db } from "../config/firebase";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to user own count
    const userDoc = doc(db, "users", currentUser.uid);
    const unsubscribeUser = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        setUserCount(doc.data().count || 0);
      }
    });

    // Listen to all users for total count
    const usersQuery = query(collection(db, "users"), orderBy("count", "desc"));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      let total = 0;

      snapshot.forEach((doc) => {
        const userData = doc.data();
        total += userData.count || 0;
      });

      setTotalCount(total);
    });

    return () => {
      unsubscribeUser();
      unsubscribeUsers();
    };
  }, [currentUser]);

  const handleIncrement = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        count: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing count:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (!currentUser || loading || userCount <= 0) return;

    setLoading(true);
    try {
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        count: increment(-1),
      });
    } catch (error) {
      console.error("Error decrementing count:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Data Tally</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {currentUser?.displayName || currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Total Count Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Total Team Count
            </h2>
            <div className="text-6xl font-bold text-indigo-600 mb-4">
              {totalCount.toLocaleString()}
            </div>
            <p className="text-gray-500">Data points collected by everyone</p>
          </div>

          {/* User Count Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Your Count
            </h2>
            <div className="text-6xl font-bold text-green-600 mb-4">
              {userCount.toLocaleString()}
            </div>
            <p className="text-gray-500">Data points you&apos;ve collected</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleIncrement}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transform transition-all hover:scale-105 active:scale-95"
          >
            + Add One
          </button>
          <button
            onClick={handleDecrement}
            disabled={loading || userCount <= 0}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transform transition-all hover:scale-105 active:scale-95"
          >
            - Remove One
          </button>
        </div>
      </main>
    </div>
  );
}
