import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCDYfrEjdakAZMLXuOv3wZxqLThY9XNhmg",
  authDomain: "vue-todo-app-d4c1d.firebaseapp.com",
  databaseURL: "https://vue-todo-app-d4c1d-default-rtdb.firebaseio.com",
  projectId: "vue-todo-app-d4c1d",
  storageBucket: "vue-todo-app-d4c1d.appspot.com",
  messagingSenderId: "145371674090",
  appId: "1:145371674090:web:2951ded83c65f9083b2e93",
  measurementId: "G-VZVVEJ6289",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db };