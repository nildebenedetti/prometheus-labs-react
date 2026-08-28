import ProductCard from "../Cards/ProductCard.jsx";
import styles from "../Cards/ProductCard.module.css";

function ProductGrid({ title, products, lastProduct }) {
    return ( <div className="mb-2  row-gap-3">
            <h2 className={`p-4`}>{title}</h2>
            <div className="container">
            <div className="mx-lg-5 mx-3 mt-2">
                <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
                {products.map((product) => (
                    <div key={product.id} className="col">
                    <ProductCard
                        product={product}
                        className={`${styles.productCard} ${styles.productMain}`}
                    />
                    </div>
                ))}
                </div>
                <div className="d-flex justify-content-center mt-4">
                {lastProduct && (
                    <ProductCard
                    key={lastProduct.id}
                    product={lastProduct}
                    className={`${styles.productCard} ${styles.productLast}`}
                    />
                )}
                </div>
            </div>
            </div>
        </div>
    );
    }
    export default ProductGrid;
