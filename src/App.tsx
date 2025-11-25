import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "./firebase";

function App() {
  const [status, setStatus] = useState<string | null>(null);

  const handleAddTestDoc = async () => {
    setStatus("Sparar dokument...");

    try {
      const docRef = await addDoc(collection(db, "testCollection"), {
        message: "Hello from Boomi!",
        createdAt: serverTimestamp(),
        randomValue: Math.random(),
      });

      setStatus(`Dokument sparat! ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("Något gick fel när dokumentet skulle sparas");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Boomi Countdown</h1>

      <button onClick={handleAddTestDoc}>
        Skapa test-dokument i Firestore
      </button>

      {status && <p>{status}</p>}
    </main>
  );
}

export default App;
