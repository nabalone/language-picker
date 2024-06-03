import './App.css';
import { useState } from 'react';
import { searchForLanguage } from '@languagepicker/ethnolib';


function App() {
  const [langSearchString, setLangSearchString] = useState('tok pisin');

  return (
    <>
      <input type="text" value={langSearchString} onChange={(e) => setLangSearchString(e.target.value)} />
      <p>{searchForLanguage(langSearchString)}</p>
    </>
  );
}

export default App;
