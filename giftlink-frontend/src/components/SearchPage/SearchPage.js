import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchPage.css';
import { urlConfig } from '../../config';

function SearchPage() {
    // Task 1: Define state variables
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [ageRange, setAgeRange] = useState(10);
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all products initially
        const fetchProducts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }

                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2: Fetch search results based on user inputs
    const handleSearch = async () => {
        try {
            const params = new URLSearchParams({
                name: searchQuery,
                age_years: ageRange
            });

            if (category) {
                params.append('category', category);
            }

            if (condition) {
                params.append('condition', condition);
            }

            const url = `${urlConfig.backendUrl}/api/search?${params.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Search error: ' + error.message);
        }
    };

    // Task 6: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/details/${productId}`);
    };

    return (
        <div className="container mt-5 search-page">
            <div className="row justify-content-center">
                <div className="col-md-8">

                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>

                        <div className="d-flex flex-column">

                            {/* Task 3: Category dropdown */}
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                className="form-control dropdown-filter mb-3"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>

                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>

                            {/* Task 3: Condition dropdown */}
                            <label htmlFor="condition">Condition</label>
                            <select
                                id="condition"
                                className="form-control dropdown-filter mb-3"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                <option value="">All Conditions</option>

                                {conditions.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>

                            {/* Task 4: Age range slider */}
                            <label htmlFor="ageRange">
                                Maximum Age: {ageRange} years
                            </label>

                            <input
                                id="ageRange"
                                type="range"
                                min="0"
                                max="10"
                                value={ageRange}
                                className="age-range-slider"
                                onChange={(e) => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Task 7: Search input */}
                    <input
                        type="text"
                        className="form-control search-input mb-3"
                        placeholder="Search gifts by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Task 8: Search button */}
                    <button
                        className="btn btn-primary search-button mb-4"
                        onClick={handleSearch}
                    >
                        Search
                    </button>

                    {/* Task 5: Display results */}
                    <div className="row">
                        {searchResults.length > 0 ? (
                            searchResults.map((gift) => (
                                <div
                                    key={gift.id}
                                    className="col-md-6 mb-4"
                                >
                                    <div
                                        className="card search-results-card h-100"
                                        onClick={() => goToDetailsPage(gift.id)}
                                    >
                                        <img
                                            src={gift.image || '/static/presents.svg'}
                                            className="card-img-top search-result-image"
                                            alt={gift.name}
                                        />

                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {gift.name}
                                            </h5>

                                            <p className="card-text">
                                                <strong>Category:</strong> {gift.category}
                                            </p>

                                            <p className="card-text">
                                                <strong>Condition:</strong> {gift.condition}
                                            </p>

                                            <p className="card-text">
                                                <strong>Age:</strong> {gift.age_years} years
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-warning no-products-found">
                                No products found
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SearchPage;