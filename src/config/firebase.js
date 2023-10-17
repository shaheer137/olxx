import { initializeApp } from "firebase/app"
import { getAuth , createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "firebase/auth"
import { getFirestore ,collection, addDoc,getDocs, doc } from "firebase/firestore"
import { getStorage,ref ,uploadBytes,getDownloadURL  } from "firebase/storage"
import {  getDoc } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCP8X3u0OB4iVGuAt1aXkhKgcvD4KnBXvY",
  authDomain: "olx-project-e4794.firebaseapp.com",
  projectId: "olx-project-e4794",
  storageBucket: "olx-project-e4794.appspot.com",
  messagingSenderId: "176946362190",
  appId: "1:176946362190:web:72e7663126900afa86101f"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)


async function register(email,password,firstName,lastName){
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const docRef = await addDoc(collection(db, "users"), {
      firstName:firstName ,
      lastName: lastName,
      Email: email
    });
    alert('Successfully Registered')
  } catch (e) {
    alert(e.message)
  }
}

function login(email,password){
   return signInWithEmailAndPassword(auth, email, password)
}

async function postAd(title,description,price,file){
  try {
     const url = await uploadImage(file)
     await addDoc(collection(db, "ads"), {
       title,
       description ,
       price,
       imageUrl:url
    });
    alert('Ad posted successfully')
  } catch (e) {
    alert(e.message)
  }
}

async function uploadImage(file){
  try{
  const storageRef = ref(storage, 'ads/'+ file.name);
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url}catch(e){
    alert(e.message)
  }
}

 async function getAds(){
  const querySnapshot = await getDocs(collection(db, "ads"));
  const ads = []
 querySnapshot.forEach((doc) => {
  const data = doc.data()
  data.id = doc.id
  ads.push(data)
});
return ads
}

async function detail(id){
  const docRef = doc(db, "ads", id );
  try {
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
        const ads = docSnap.data()
    } else {
        console.log("Document does not exist")
    }
    return docSnap.data()
} catch(error) {
    console.log(error)
}
 }

export {register,login,postAd,getAds,detail}
