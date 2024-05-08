import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc,
} from "firebase/firestore";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBP6ayPJYPF2uc_dj-vxTI7ZvP6H4VtnBY",
    authDomain: "learning-firebase-9-3e578.firebaseapp.com",
    projectId: "learning-firebase-9-3e578",
    storageBucket: "learning-firebase-9-3e578.appspot.com",
    messagingSenderId: "535623706689",
    appId: "1:535623706689:web:fc92d9dc6936d0f698fec0",
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// queries

// conditional queries whereby it returns the docs with the author titled "patrick rothfuss"
// const q = query(colRef, where("author", "==", "patrick rothfuss"));

// ordering the docs
const q = query(colRef, orderBy("createdAt"));

// // get collection data
// getDocs(colRef)
//     .then((snapshot) => {
//         let books = [];
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id });
//         });
//         console.log(books);
//     })
//     .catch((err) => err.message);

// get real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
});

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp(),
    }).then(() => {
        addBookForm.reset();
    });
});

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", deleteBookForm.id.value);

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset();
        })
        .catch((err) => err.message);
});

// fetching a single document (& realtime)
const docRef = doc(db, "books", "XhO3aPlN6iEAoAgB07An");

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
});

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", updateForm.id.value);

    updateDoc(docRef, {
        title: "updated title",
    })
        .then(() => updateForm.reset())
        .catch((err) => err.message);
});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log("user created:", cred.user);
            signupForm.reset();
        })
        .catch((err) => {
            console.log(err.message);
        });
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
    signOut(auth)
        // .then(() => console.log("User signed out"))
        .catch((err) => err.message);
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log("User logged in", cred.user);
        })
        .catch((err) => console.log(err.message));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log("User status changed: ", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
    console.log("Unscubscribing...");
    unsubAuth();
    unsubCol();
    unsubDoc();
});
