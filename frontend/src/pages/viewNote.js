import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";

function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    API.get(`/notes/${id}`).then((res) => setNote(res.data));
  }, [id]);

  const downloadNote = () => {
    const blob = new Blob([note.content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = note.title + ".html";
    link.click();
  };

  if (!note) return <p>Loading...</p>;

  return (
    <div>
      <h2>{note.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: note.content }} />
      <button onClick={downloadNote}>Download</button>
    </div>
  );
}

export default ViewNote;
