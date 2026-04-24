import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

function NotesFeed() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get("/notes").then((res) => setNotes(res.data));
  }, []);

  return (
    <div>
      <h2>All Notes</h2>
      {notes.map((note) => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>By {note.author?.name}</p>
          <Link to={`/note/${note._id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}

export default NotesFeed;
