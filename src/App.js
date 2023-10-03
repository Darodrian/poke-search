import "./App.css";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

import { Provider } from "react-redux";
import store from "./store";

import BuscadorPokemon from "./components/BuscadorPokemon";
import ResultadoPokemon from "./components/ResultadoPokemon";
import { useState } from "react";

function App() {
  const [pokemonName, setPokemonName] = useState('pikachu');

  return (
    <Provider store={store}>
      <div className="App container">
        <div className="row">
          <div className="col-12 mt-4 border-top pt-3">
            <BuscadorPokemon data={{pokemonName, setPokemonName}} />
          </div>
          <div className="col-12">
            <ResultadoPokemon name={pokemonName} />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
