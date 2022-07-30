import CatalogItem from "./CatalogItem/CatalogItem";
import { useContext } from "react";
import { GameContex } from "../../context/GameContext";

const Catalogue = () => {
    const {games} = useContext(GameContex);

    return (
        <section id="catalog-page">
            <h1>All Games</h1>

            {games.length > 0
                ? games.map(x => <CatalogItem key={x._id} game={x} />)
                : <h3 className="no-articles">No articles yet</h3>
            }

        </section>
    )
};

export default Catalogue;