import './App.css';
import {Link,Routes, BrowserRouter, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function App() {
  return (
   <BrowserRouter>
     <main>
      <div className='header'>
       Familie Ntrikos
      </div>
      <Link to='/ToDoListe'>
       <button>
         To Do Liste
       </button>
      </Link>
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
function Startseite() {
  return (
    <div>
      Startseite
    </div>
  );
}
function ToDoListe() {
  return (
   <div>
     To Do Liste
   </div>
  );
}