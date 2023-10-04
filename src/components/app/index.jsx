import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./style.css";
import { useState } from "react";
import { Provider } from "react-redux";
import Store from "../../services/store";
import Buscador from "../../feature/pokemon/pokemon-search";
import Resultado from "../../feature/pokemon/pokemon-result";

const App = () => {
  const [pokemonName, setPokemonName] = useState('pikachu');

  return (
    <Provider store={Store}>
      <div className="App container">
        <div className="row">
          <div className="col-12 mt-4 border-top pt-3">
            <Buscador data={{pokemonName, setPokemonName}} />
          </div>
          <div className="col-12">
            <Resultado name={pokemonName} />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
