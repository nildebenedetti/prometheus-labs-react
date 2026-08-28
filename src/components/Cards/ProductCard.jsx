import { Link } from "react-router";
import useFavourites from "../../hooks/useFavourites.js";
import { useState } from "react";
import styles from "./ProductCard.module.css";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiGlobe,
  FiSun,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext.jsx";
import { API_URL } from "../../utils/utils.js";

// Componente card singolo product
function ProductCard({ product, className = "" }) {
  const [expanded, setExpanded] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const favourite = isFavourite(product.slug);
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const quantityInCart = getItemQuantity(product.slug);
  const productAlreadyInCart = isInCart(product.slug);

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.imgMain,
    });
  }

  function powerTypeCheck(powerType) {
    if (powerType === "physical") {
      return (
        <div
          className={`badge my-auto p-2 m-3 ${styles.powTag} ${styles.phTag}`}
        >
          {product.power_type}
        </div>
      );
    }
    if (powerType === "psychic") {
      return (
        <div
          className={`badge my-auto p-2 m-3  ${styles.powTag} ${styles.psyTag}`}
        >
          {product.power_type}
        </div>
      );
    }
  }

  return (
    <div className={`card h-100 d-flex flex-column pt-4 ${styles.productCard}`}>
      {/* Image */}
      <Link to={`/products/${product.slug}`}>
        <img
          src={`${API_URL}${product.imgMain}`}
          className="card-img-top"
          alt={product.name}
        />
      </Link>
      {/* card body */}
      <div className={`card-body d-flex flex-column ${styles.cardBody}`}>
        <div className="card-title-container text-center">
          <h6 className={`mb-1 ${styles.cardTitle}`}>
            {product.name}
          </h6>
          <div className="">
            <div className={`${styles.powerTitle}`}>{product.power}</div>
            {powerTypeCheck(product.power_type)}
          </div>
        </div>
        {/* Categories */}
        <div className="d-flex flex-wrap gap-1 justify-content-center my-2">
          {product.categories.map((category) => {
            if (category === "iconic") {
              return (
                <span key={category} className={`${styles.iconic}`}>
                  {category}
                </span>
              );
            }
            return (
              <span
                key={category}
                className={`badge bg-secondary ${styles.productType}`}
              >
                {category}
              </span>
            );
          })}
        </div>
        {/* Description */}
        <p className="card-text small text-muted flex-grow-1">
          {expanded
            ? product.shortDescription
            : product.shortDescription.slice(0, 0) + ""}
        </p>

      </div>

      <div
        className={`card-footer d-flex gap-3 justify-content-between align-items-center ${styles.cardFooter}`}
      >
        <button
          className={`btn bg-jurassik-orange`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavourite(product);
          }}
        >
          {favourite ? (
            <FaHeart className="icon-btn icon-btn--active" />
          ) : (
            <FiHeart className="icon-btn" />
          )}
        </button>

        <div className={`d-flex align-items-center ${styles.priceBox}`}>
          <span className={`fw-bold me-auto ${styles.productPrice}`}>
            € {product.price}
          </span>
          {!productAlreadyInCart ? (
            <button
              className="btn bg-jurassik-orange"
              onClick={handleAddToCart}
            >
              <FiShoppingCart className="icon-btn" />
            </button>
          ) : (
            <div className="d-flex align-items-center">
              <button
                className={`${styles.quantityBtn} btn`}
                onClick={() => decreaseQuantity(product.slug)}
              >
                -
              </button>
              <div className="d-flex justify-content-center mx-2">
                {quantityInCart}
              </div>
              <button
                className={`${styles.quantityBtn} btn`}
                onClick={() => increaseQuantity(product.slug)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
