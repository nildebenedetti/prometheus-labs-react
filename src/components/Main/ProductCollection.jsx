import { useState, useEffect } from "react"
import ProductGrid from "./ProductGrid.jsx"
import api from "../../services/api.js"
import { Link } from "react-router";

import DailysupBanner from "./DailysupBanner.jsx";
import NovaBanner from "./NovaBanner.jsx";

function ProductCollection() {

  // stato per i prodotti
  const [latest, setLatest] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const [latestProducts, bestsellerProducts] = await Promise.all([
          api.getLatestProducts(),
          api.getBestsellerProducts()
        ]);
        
        const slicedLatest = latestProducts.slice(0, 5);

        setLatest(slicedLatest);
        // la total quanity è il numero totale di unità vendute
        // per il dato prodotto recuperata da orders
        const sortedBestsellers = [...bestsellerProducts].sort((a, b) => {
          return b.total_quantity - a.total_quantity; 
        });


        const slicedBestsellers = sortedBestsellers.slice(0, 5);

        setBestsellers(slicedBestsellers);
        

      } catch (error) {
        console.error('Error when loading data')
      }

    }

      fetchData();

  }, [])


  return <>
    <div className="">
      <ProductGrid title="Clients'Favorites" products={bestsellers} />
      <Link to="/products?category=dailysuper"> <DailysupBanner /> </Link>
      <ProductGrid title="New In" products={latest} />
      <Link to="/products?category=novamorph"> <NovaBanner /> </Link>
    </div>
  </>
}

export default ProductCollection;