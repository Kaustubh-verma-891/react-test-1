import { useState, useEffect } from 'react';
import axios from 'axios';

function NavBar({ onLogin, onLogout, isLoggedIn }) {
  return (
    <nav className="position-sticky w-full h-fit flex justify-around z-10 p-4 bg-amber-300 shadow-2xl border-bottom">
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
  )
}

function Main() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    axios.get('/api/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error('Error loading notes:', error));
  }, []);

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
    const noteId = notes[index].id;
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
    const noteId = notes[editIndex].id;
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

function App() {
  return (
    <div className="w-full h-screen flex flex-col">
      <NavBar />
      <div className="w-full h-full flex">
        <Sidebar />
        <Main />
      </div>
    </div>
  )
}

export default App