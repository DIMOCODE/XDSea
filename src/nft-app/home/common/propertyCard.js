import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";

const PropertyCard = (props) => {
    return (
        <div className="property-card cursor-pointer" onClick={() => props.viewCollection()}>
            <div className='property-card-header'>
                <p>{props.property}</p>
            </div>
            <div className="property-card-body">
                <p>{props.value}</p>
            </div>
            <div className='property-card-footer'>
                <p>{props.proportion}% have this trait.</p>
            </div>
        </div>
    );
};

PropertyCard.propTypes = {
    viewCollection: PropTypes.func
}

PropertyCard.defaultProps = {
    viewCollection: () => {
    }
};


export default PropertyCard;