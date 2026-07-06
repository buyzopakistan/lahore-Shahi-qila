import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBEWI50WaNhS-_Ey7BJxcGwBT5Bn0Jr38c",
  authDomain: "lahore-shahi-qila.firebaseapp.com",
  databaseURL: "https://lahore-shahi-qila-default-rtdb.firebaseio.com/",
  projectId: "lahore-shahi-qila",
  storageBucket: "lahore-shahi-qila.firebasestorage.app",
  messagingSenderId: "922836751486",
  appId: "1:922836751486:web:d320cbfad69fd3c7ab742f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
