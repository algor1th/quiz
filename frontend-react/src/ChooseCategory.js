import React from 'react';
import { Link } from 'react-router-dom';

function ChooseCategory() {
    const categories = ["test", 'hello world']

    return(
        <>
        <h1>Kategorie wählen</h1>
        <div className="choose-category">
            {categories.map((cat) => 
                <Link to={'/q/' + cat } key={cat}>
                    <button>
                            {cat}
                    </button>
                </Link>
            )}
        </div>
        </>
    )
}
export default ChooseCategory;