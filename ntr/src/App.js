/*Imports */
import './App.css';
import {Link, Routes, BrowserRouter, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db, auth } from './config/firebase';
import { addDoc, getDocs, query, where, collection, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import Cookies from 'js-cookie';

/*Main */
export default function App() {
  return (
   <BrowserRouter>
     <main>
      <div className='header'>
       Familie Ntrikos
      </div>
      {Cookies.get('loggedIN') === 'true' && (
        <Link to='/ToDoListe'>
         <button>
          To Do Liste
         </button>
        </Link>
      )}
      
      <Link to='/'>
       <button>
         Startseite
       </button>
      </Link>
     </main>
     <Routes>
      <Route path='/' element={<Startseite/>}/>
      <Route path='/ToDoListe' element={<ToDoListe/>}/>
     </Routes>
    </BrowserRouter> 
  );
}

/*Startseite */
function Startseite() {
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[Cusername, setCUsername] = useState('');
  const[Cpassword, setCPassword] = useState('');
  const[sehenR, setSehenR] = useState(false);
  const[sehen, setSehen] = useState(false);
  let typeR; 
  let type; 

  if (sehenR === true) {
    typeR = 'text';
  }
  else {
    typeR = 'password';
  }


  if (sehen === true) {
    type = 'text';
  }
  else {
    type = 'password';
  }


  const login = async() => {
    try {
      Cookies.set('loggedIN', true, {expires: 14});
      Cookies.set('username', username, {expires: 7});
      await signInWithEmailAndPassword(auth, username, password);
      alert('Erfolgreich eingeloggt!');
      window.location.reload();

    }catch(e) {
      alert('Error' + e);
    }
  };

  const register = async() => {
    try {
      Cookies.set('loggedIN', true, {expires: 14});
      Cookies.set('username', Cusername, {expires: 7});
      await createUserWithEmailAndPassword(auth, Cusername, Cpassword);
      alert('Erfolgreich registriert!');
      window.location.reload();

    }catch(e) {
      alert('Error' + e);
    }
  };

  const logOut = () => {
    Cookies.remove('loggedIN');
    Cookies.remove('username');
    window.location.reload();
  };


  
 
  return (
    <div>
      Startseite
    {Cookies.get('loggedIN') === 'true' ? (
      <>
      <br/>
        Willkommen {Cookies.get('username')}!
      <br/>

        <button onClick={logOut}>
          Ausloggen
        </button>
      </>
    ) : (
      <>
       <div className='login'>
        Login
        <label>E-Mail:</label>
        <input type='text' placeholder='E-Mail.' onChange={(e) => setUsername(e.target.value)}/>
        <label>Passwort:</label>
        <input type={type} placeholder='Passwort.' onChange={(e) => setPassword(e.target.value)}/>
        {sehen === true ? (
         <span onClick={() => setSehen(!sehen)}>Sehen</span>
        ): (
          <span onClick={() => setSehen(!sehen)}> Nicht Sehen</span>
        )}
        <button onClick={login}>Einloggen</button>
      </div>
      <br/>
      <div className='register'>
        Registrierung
        <label>Geben Sie eine E-Mail an:</label>
        <input type='text' placeholder='Angegebene E-Mail.' onChange={(e) => setCUsername(e.target.value)}/>
        <label>Erstelle ein Passwort:</label>
        <input type={typeR} placeholder='Erstelltes Passwort.' onChange={(e) => setCPassword(e.target.value)}/>
        {sehenR === true ? (
         <span onClick={() => setSehenR(!sehenR)}>Sehen</span>
        ): (
          <span onClick={() => setSehenR(!sehenR)}> Nicht Sehen</span>
        )}
        <button onClick={register}>Registrieren</button>
      </div>
      </>
    )}
   </div>
  );
}

/*To Do Liste */
function ToDoListe() {
  const[toDo, setToDo] = useState('');
  const[toDos, setToDos] = useState([]);
  const[edit,setEdit] = useState(false);
  const[editToDo, setEditToDo] = useState('');
  let username = Cookies.get('username') || null;

 const AddToDo = async() => {
   if(toDo.trim() !== '') {
    try {
     await addDoc(collection(db, 'toDoListe'), {
       aufgabe: toDo || null,
       email: username || null
     });
     alert('Aufgabe erfolgreich hinzugefügt!');
     fetchToDos();
    }catch(e) {
     alert('Error'+ e)
    }
  } 
 };

 const fetchToDos = async() => {
  try {
    const q = query(collection(db, 'toDoListe'), where('email', '==', username));
    const querySnapshot = await getDocs(q);

    const datas = querySnapshot.docs.map((doc) => doc.data()); 

    setToDos(datas);
  } catch(e) {
    console.log(e);
  }
 }

 

 

  useEffect(() => {
    fetchToDos();
});
  return (
   <div className='toDoListe'>
    <div className='ContentToDoListe'>
      To Do Liste
      <span>Schreibe hier deine Aufgabe rein:</span>
      <input type='text' onChange={(e) => setToDo(e.target.value)} placeholder='Aufgabe.'/>
      <button onClick={AddToDo}>
        Hinzufügen
      </button>
      <ul>
      {toDos.map((task, index) => (
       <li key={index}>
       {edit ? (
        <>
         <input type='text' placeholder={task.aufgabe} onChange={(e) => setEditToDo(e.target.value) }/>
        </>
       ): (
       <>
        {task.aufgabe}
       </>
      )}
   
    <button
      onClick={async () => {
        try {
          const q = query(
            collection(db, 'toDoListe'),
            where('email', '==', username),
            where('aufgabe', '==', task.aufgabe)
          );

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async (docSnapshot) => {
            const docRef = doc(db, "toDoListe", docSnapshot.id);
            await deleteDoc(docRef);
          });
          alert('Gelöscht');
          await fetchToDos(); 
        } catch(e) {
          alert(e);
        }
      }}
    >
      Löschen
    </button>
    <span>
      {edit ? (
        <button onClick={async() => {
          try {
            if (editToDo.trim() !== '') {
             setEdit(!edit);
             const updateToDos = { 
              aufgabe: editToDo || null
             };
             const q = query(collection(db, 'toDoListe'),  where('email', '==', username),
             where('aufgabe', '==', task.aufgabe));
             const querySnapshot = await getDocs(q);
    
             querySnapshot.forEach(async(docSnapshot) => {
               await updateDoc(docSnapshot.ref, updateToDos);
             });
             fetchToDos();
             alert('Erfolgreich gesichert!');
           }
          }catch(e){
            alert(e);
          }}
        }>
          Sichern
        </button>
      ):(
        <button onClick={() => setEdit(!edit) }>
          Bearbeiten
        </button>
      )}
    </span>
  </li>
))}

      </ul>
    </div>
   </div>
  );
}