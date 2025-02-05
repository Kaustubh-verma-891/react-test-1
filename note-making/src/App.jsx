import { useState, useEffect } from 'react';
import axios from 'axios';

function NavBar({ onLogin, onLogout, isLoggedIn }) {
  return (
    <nav className="position-sticky w-full h-fit z-10 p-4 bg-amber-300 shadow-2xl border-bottom">
      <h1 className="text-2xl font-semibold">My Notes</h1>
      {isLoggedIn ? (
        <button onClick={onLogout} className="ml-auto bg-red-500 px-3 py-1 rounded hover:scale-105">Logout</button>
      ) : (
        <button onClick={onLogin} className="ml-auto bg-blue-500 px-3 py-1 rounded hover:scale-105">Login</button>
      )}
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="w-1/5 h-full p-4 bg-amber-100">
      <h2>Categories</h2>
    </aside>
  );
}

function Main({ isLoggedIn }) {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('/api/notes')
        .then(response => setNotes(response.data))
        .catch(error => console.error('Error loading notes:', error));
    }
  }, [isLoggedIn]);

  const addNote = () => {
    if (note.trim()) {
      axios.post('/api/notes', { note })
        .then(response => {
          setNotes([...notes, response.data]);
          setNote('');
        })
        .catch(error => console.error('Error adding note:', error));
    }
  };

  const deleteNote = (index) => {
    const noteId = notes[index]._id;
    axios.delete(`/api/notes/${noteId}`)
      .then(() => {
        setNotes(notes.filter((_, i) => i !== index));
      })
      .catch(error => console.error('Error deleting note:', error));
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditNote(notes[index].note);
  };

  const saveEdit = () => {
    const noteId = notes[editIndex]._id;
    axios.put(`/api/notes/${noteId}`, { note: editNote })
      .then(response => {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = response.data;
        setNotes(updatedNotes);
        setEditIndex(null);
        setEditNote('');
      })
      .catch(error => console.error('Error saving note:', error));
  };

  return (
    <main className="w-full m-5 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl">Notes</h2>
        <section className='flex flex-wrap'>
          {notes.map((note, index) => (
            <div key={index} className="w-[30%] border p-2 m-2">
              {editIndex === index ? (
                <div>
                  <input
                    className="border-2 p-1 rounded"
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                  />
                  <button onClick={saveEdit}>Save</button>
                </div>
              ) : (
                <div>
                  <h3 className='mb-2'>Note {index + 1}</h3>
                  <p className='mb-2 overflow-clip'>{note.note}</p>
                  <button className='mr-14 bg-blue-300 px-3 py-1 rounded hover:scale-105' onClick={() => startEditing(index)}>Edit</button>
                  <button className='bg-red-500 px-3 py-1 rounded hover:scale-105' onClick={() => deleteNote(index)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
      <div className='flex w-full'>
        <input
          className="w-2/3 mr-8 border-2 p-2 rounded "
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className='hover:bg-amber-200 p-2 rounded-xl transition-all duration-150' onClick={addNote}>Add Note</button>
      </div>
    </main>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/auth/login', { email, password })
      .then(response => {
        onLogin();
      })
      .catch(error => console.error('Error logging in:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-10">
      <h2 className="text-2xl mb-4">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
}

function SignUp({ onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/auth/signup', { email, password })
      .then(response => {
        onSignUp();
      })
      .catch(error => console.error('Error signing up:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-10">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleSignUp = () => {
    setIsSignUp(false);
    setIsLoggedIn(true);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <NavBar onLogin={() => setIsSignUp(true)} onLogout={handleLogout} isLoggedIn={isLoggedIn} />
      <div className="w-full h-full flex">
        <Sidebar />
        {isLoggedIn ? (
          <Main isLoggedIn={isLoggedIn} />
        ) : isSignUp ? (
          <SignUp onSignUp={handleSignUp} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;