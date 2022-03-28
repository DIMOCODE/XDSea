import React from 'react';

const SkeletonMyNFT = () => {
    const length = [1, 2]
    return (
        <React.Fragment>
            <div className="grid grid-cols-2 gap-4">
                {length.map(e => <div className="nft-skeleton" key={e}>
                <div>
                    {e == 1 ? <div className="nft-skeleton_loading" style={{
                        height: '300px',
                        width: '100%'
                        }}/>
                        :
                        <div className="nft-skeleton_loading col-span-2" style={{height: '500px', width: '100%'}}/>
                    }
                    </div>    
                </div>)}
            </div>
        </React.Fragment>
    );
};

export default SkeletonMyNFT; 