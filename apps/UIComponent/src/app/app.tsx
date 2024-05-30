// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { searchForLanguage } from '../../../index/search';

export function App() {
  const [langSearchString, setLangSearchString] = useState('tok pisin');
  return (
    <div>
      <input type="text" value={langSearchString} onChange={(e) => setLangSearchString(e.target.value)} />
      <p>{searchForLanguage(langSearchString)}</p>
    </div>
  );
}

export default App;
