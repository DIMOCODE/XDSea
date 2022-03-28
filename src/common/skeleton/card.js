import React from 'react';

const SkeletonCard = () => {
    const length = [1, 2, 3, 4]
    return (
        <React.Fragment>
            {length.map(e => <div className="nft-skeleton" key={e}>
                <div>
                    <div className="nft-skeleton_loading" style={{
                        height: '400px',
                        width: '100%'
                    }}/>
                </div>
            </div>)}
        </React.Fragment>
    );
};

export default SkeletonCard;