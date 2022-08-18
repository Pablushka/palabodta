import React from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api'


const handleSubmit = (e: any) => {
  e.preventDefault();

  // get value form input the word
  const theWord = e.target.elements.the_word.value;

  invoke('check_word', { wordGuess: theWord })
    .then((response) => console.log(response))
    .catch((error) => console.log(error))
    .finally(() => {
    }
)
}

function App() {
  return (
    <div className="App">
      <form action="" onSubmit={handleSubmit}>
        <input id="the_word" type="text" />
        <button type='submit'>Enviar</button>
      </form>
    </div>
  );
}

export default App;
