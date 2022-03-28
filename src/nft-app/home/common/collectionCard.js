import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import {toXdc} from "../../../common/common";

const CollectionCard = (props) => {
    const [blob, setBlob] = useState(null)
    
    const isVideo = async (file) => {
        const blob = await fetch(file).then((r) => r.blob())
        setBlob(blob)
        return !!blob?.type?.match('video.*');
    }
    
    return (
        <div className="collection-card cursor-pointer" onClick={() => props.viewCollection()}>
            <div className="collection-card-body">
                <img alt="Collection Banner" src={props.banner}/>
            </div>
            <div className='collection-card-logo'>
                {props.name === "Untitled Collection 54"
                    ? <video>
                        <source src={props.logo} type={blob?.type}/>
                    </video>
                    : <img alt='Collection Logo' src={props.logo}/>
                }
            </div>
            <div className="collection-card-footer">
                <h4>{props.name}</h4>
                <p>{props.description}</p>
            </div>
        </div>
    );
};

CollectionCard.propTypes = {
    viewCollection: PropTypes.func
}

CollectionCard.defaultProps = {
    viewCollection: () => {
    }
};


export default CollectionCard;