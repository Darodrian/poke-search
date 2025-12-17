import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./style.css";
import { useState } from "react";
import { Provider } from "react-redux";
import Store from "../../services/store";
import PokemonSearch from "../../feature/pokemon/pokemon-search";
import PokemonResult from "../../feature/pokemon/pokemon-result";

const App = () => {
  const [pokemonName, setPokemonName] = useState('pikachu');
  const [selectedVersion, setSelectedVersion] = useState('all');

  return (
    <Provider store={Store}>
      <div className="App container">
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8 mx-auto mt-4">
            <PokemonSearch 
              data={{
                pokemonName, 
                setPokemonName,
                selectedVersion,
                setSelectedVersion
              }} 
            />
          </div>
          <div className="col-12 col-lg-10 col-xl-8 mx-auto">
            <PokemonResult name={pokemonName} version={selectedVersion} />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
