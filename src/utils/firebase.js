// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBG3atIMWLpINWBrKKY1a9iYVcq7XBsrUc",
    authDomain: "kenji-codelab.firebaseapp.com",
    projectId: "kenji-codelab",
    storageBucket: "kenji-codelab.firebasestorage.app",
    messagingSenderId: "94796299090",
    appId: "1:94796299090:web:c8eab40ae090b8fb65988b",
    measurementId: "G-WN9B4XN435",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 新しいオフラインキャッシュの設定を使う: persistentLocalCache
initializeFirestore(app, {
    localCache: persistentLocalCache(/* ここにオプションを渡すことも可能 */),
});

// 以降は getFirestore で Firestore インスタンスを取得
export const db = getFirestore(app);
