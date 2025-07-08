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
} from "firebase/firestore";
import { db } from "../config/firebase";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [userPromptCount, setUserPromptCount] = useState(0);
  const [userGradedCount, setUserGradedCount] = useState(0);
  const [totalPromptCount, setTotalPromptCount] = useState(0);
  const [totalGradedCount, setTotalGradedCount] = useState(0);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [loadingGraded, setLoadingGraded] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to user own promptCount and gradedCount
    const userDoc = doc(db, "users", currentUser.uid);
    const unsubscribeUser = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        setUserPromptCount(doc.data().promptCount || 0);
        setUserGradedCount(doc.data().gradedCount || 0);
      }
    });

    // Listen to all users for total promptCount and gradedCount
    const usersQuery = query(
      collection(db, "users"),
      orderBy("promptCount", "desc")
    );
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      let totalPrompt = 0;
      let totalGraded = 0;
      snapshot.forEach((doc) => {
        const userData = doc.data();
        totalPrompt += userData.promptCount || 0;
        totalGraded += userData.gradedCount || 0;
      });
      setTotalPromptCount(totalPrompt);
      setTotalGradedCount(totalGraded);
    });

    return () => {
      unsubscribeUser();
      unsubscribeUsers();
    };
  }, [currentUser]);

  // Prompt Count Handlers
  const handleIncrementPrompt = async () => {
    if (!currentUser || loadingPrompt) return;
    setLoadingPrompt(true);
    try {
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        promptCount: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing promptCount:", error);
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleDecrementPrompt = async () => {
    if (!currentUser || loadingPrompt || userPromptCount <= 0) return;
    setLoadingPrompt(true);
    try {
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        promptCount: increment(-1),
      });
    } catch (error) {
      console.error("Error decrementing promptCount:", error);
    } finally {
      setLoadingPrompt(false);
    }
  };

  // Graded Count Handlers
  const handleIncrementGraded = async () => {
    if (!currentUser || loadingGraded) return;
    setLoadingGraded(true);
    try {
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        gradedCount: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing gradedCount:", error);
    } finally {
      setLoadingGraded(false);
    }
  };

  const handleDecrementGraded = async () => {
    if (!currentUser || loadingGraded || userGradedCount <= 0) return;
    setLoadingGraded(true);
    try {
      const userDoc = doc(db, "users", currentUser.uid);
      await updateDoc(userDoc, {
        gradedCount: increment(-1),
      });
    } catch (error) {
      console.error("Error decrementing gradedCount:", error);
    } finally {
      setLoadingGraded(false);
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
          {/* Total Prompt Count Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Total Prompt Count
            </h2>
            <div className="text-6xl font-bold text-indigo-600 mb-4">
              {totalPromptCount.toLocaleString()}
            </div>
            <p className="text-gray-500">Prompts collected by everyone</p>
          </div>

          {/* Total Graded Count Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Total Graded Count
            </h2>
            <div className="text-6xl font-bold text-indigo-600 mb-4">
              {totalGradedCount.toLocaleString()}
            </div>
            <p className="text-gray-500">Graded prompts by everyone</p>
          </div>

          {/* User Prompt Count Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Your Prompt Count
            </h2>
            <div className="text-6xl font-bold text-green-600 mb-4">
              {userPromptCount.toLocaleString()}
            </div>
            <p className="text-gray-500">Prompts you&apos;ve collected</p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleIncrementPrompt}
                disabled={loadingPrompt}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 active:scale-95"
              >
                + Add One
              </button>
              <button
                onClick={handleDecrementPrompt}
                disabled={loadingPrompt || userPromptCount <= 0}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 active:scale-95"
              >
                - Remove One
              </button>
            </div>
          </div>

          {/* User Graded Count Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Your Graded Count
            </h2>
            <div className="text-6xl font-bold text-green-600 mb-4">
              {userGradedCount.toLocaleString()}
            </div>
            <p className="text-gray-500">Prompts you&apos;ve graded</p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleIncrementGraded}
                disabled={loadingGraded}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 active:scale-95"
              >
                + Add One
              </button>
              <button
                onClick={handleDecrementGraded}
                disabled={loadingGraded || userGradedCount <= 0}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105 active:scale-95"
              >
                - Remove One
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
