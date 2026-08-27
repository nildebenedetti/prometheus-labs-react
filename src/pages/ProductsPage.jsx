import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import "../styles/ProductsPage.css";
import styles from "../components/Cards/ProductCard.module.css";
import ProductCard from "../components/Cards/ProductCard.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import api from "../services/api.js";
import { FiSearch } from "react-icons/fi";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") ?? "";
    const categoryParam = searchParams.get("category") ?? "";
    const selectedCategories = categoryParam ? categoryParam.split(',') : [];
    const isAllSelected = selectedCategories.length === 0;
    const sort = searchParams.get("sort") ?? "";
    const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

    function setParam(key, value) {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (value) next.set(key, value); else next.delete(key);
            return next;
        });
    }

    const { addToCart } = useCart();
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsError, setProductsError] = useState("");

    // useEffect per fetch categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const allProducts = await api.getProducts('');

                if (allProducts && Array.isArray(allProducts)) {

                    const uniqueCategories = new Set(); // il set gestisce anche le categorie multiple!!! 

                    allProducts.forEach(product => {
                        if (Array.isArray(product.categories)) {
                            product.categories.forEach(category => uniqueCategories.add(category));
                        }
                    })
                    setCategories([...uniqueCategories]); // spalmo in un array

                }
            } catch (error) {
                console.error("Error loading categories:", error);
            }

        }
        fetchCategories();
    }, []);

    // useEffect per fetch dei prodotti in dipendenza dai search params
    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoadingProducts(true);
                setProductsError("");

                const query = searchParams.toString();
                const results = await api.getProducts(query);

                setProducts(results || []);

            } catch (error) {
                console.error("Error loading products:", error);
                setProductsError(error.message || "Error loading products");
            } finally {
                setLoadingProducts(false);
            }
        }

        fetchProducts();
    }, [searchParams]);


    const visibleProducts = useMemo(() => {
        let list = [...products];

        // FILTER BY CATEGORY
        if (selectedCategories.length > 0) {
            list = list.filter(product =>
                Array.isArray(product.categories) &&
                product.categories.some(category => selectedCategories.includes(category))
            );
        }

        // SORT
        if (sort === "min") {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        }

        if (sort === "max") {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        }

        return list;
    }, [products, selectedCategories, sort]);


    function handleAddToCart(event, product) {
        event.preventDefault();
        event.stopPropagation();

        addToCart({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.imgMain,
        });
    };

    function toggleCategory(category) {
        const isSelected = selectedCategories.includes(category);

        let updatedList;
        if (isSelected) {
            updatedList = selectedCategories.filter(c => c !== category);
        } else {
            updatedList = [...selectedCategories, category];
        }

        setParam("category", updatedList.length ? updatedList.join(",") : "");
    };

    return (
        <main className="container products-page  px-4 px-md-3">
            <h1 className="text-center mb-4">Products</h1>
            <hr className="line" />

            <section className="filters-row-mobile mb-3">


                <div className="mobile-search">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setParam("search", searchInput)}
                    />
                </div>

                <div className="mobile-row-2 justify-content-between">
                    <div className="d-flex flex-column align-items-center flex-grow-1">
                        <label htmlFor="categoryFilter">Categories</label>
                        <select
                            id="categoryFilter"
                            className="w-100"
                            value={selectedCategories[0] || ""}
                            onChange={(e) => setParam("category", e.target.value)}
                        >
                            <option value="">All</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="d-flex flex-column align-items-center flex-grow-1">
                        <label htmlFor="priceSort">Price</label>
                        <select
                            id="priceSort"
                            className="w-100"
                            value={sort}
                            onChange={(e) => setParam("sort", e.target.value)}
                        >
                            <option value="">Sort</option>
                            <option value="min">Price MIN</option>
                            <option value="max">Price MAX</option>
                        </select>
                    </div>

                </div>

            </section>
            <section className="filters-row  ">

                <div className=" d-flex  flex-column w-25 gap-3 ">
                    <div className="d-flex flex-column">
                        <label className="form-label fw-bold fs-5 text-center">Search</label>

                    </div>
                    <div className="d-flex gap-1 ">
                        <input
                            type="text"
                            className="form-control compact-input rounded-4"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchInput(value);
                                if (value.trim() === "") {
                                    setParam("search", "");
                                }

                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setParam("search", searchInput.trim());
                                }
                            }}
                        />

                        <button
                            className="btn search-btn compact-btn rounded-4"
                            onClick={() => setParam("search", searchInput.trim())}
                        >
                            Search
                        </button>

                    </div>
                </div>
                <div className="d-flex flex-column w-25 gap-2 ">
                    <label className="form-label fw-bold fs-5 text-center">Categories</label>

                    <div className="category-columns">
                        <div
                            className={`category-chip ${isAllSelected ? "active" : ""}`}
                            onClick={() => setParam("category", "")}
                        >
                            All
                            {isAllSelected && <span className="checkmark">✓</span>}
                        </div>
                        <div className="category-column">
                            {categories.slice(0, 2).map((category) => {
                                const isSelected = selectedCategories.includes(category);

                                return (
                                    <div
                                        key={category}
                                        className={`category-chip ${isSelected ? "active" : ""}`}
                                        onClick={() => toggleCategory(category)}
                                    >
                                        {category}
                                        {isSelected && <span className="checkmark">✓</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="category-column">
                            {categories.slice(2).map((category) => {
                                const isSelected = selectedCategories.includes(category);

                                return (
                                    <div
                                        key={category}
                                        className={`category-chip ${isSelected ? "active" : ""}`}
                                        onClick={() => toggleCategory(category)}
                                    >
                                        {category}
                                        {isSelected && <span className="checkmark">✓</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column w-25 text-center gap-3">
                    <label className="form-label fw-bold fs-5 ">Sort</label>
                    <div className="ios-switch-container" onClick={() => {
                        const next = sort === "min" ? "max" : "min";
                        setParam("sort", next);
                    }}>
                        <span className={`switch-text ${sort === "min" ? "active" : ""}`}>Price MIN</span>

                        <div className={`ios-switch-track ${sort}`}></div>

                        <span className={`switch-text ${sort === "max" ? "active" : ""}`}>Price MAX</span>
                    </div>



                </div>


            </section>
            
                {loadingProducts && <p>Products Loading...</p>}

                {productsError && <p className="text-danger text-center my-5 fs-5">{search ? `No products found for search term "${search}"` : productsError}</p>}

                {!loadingProducts && !productsError && visibleProducts.length === 0 && (
                    <p>{search ? `No products found with name "${search}"` : "No products to be shown"}</p>
                )}

                {!loadingProducts && !productsError && (
                    <div className="row g-4 mb-5">
                        {visibleProducts.map((product) => (
                            <div key={product.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                                    <ProductCard
                                        product={product}
                                        className={`${styles.productCard}`}
                                    />
                            </div>
                        ))}
                    </div>
                )}

        </main>
    );
}
