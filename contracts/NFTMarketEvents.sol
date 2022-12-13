// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

// Enumeration of Event Types that list all the possible kind
// of events
enum EventType {
    Minted,
    Listed,
    Withdrawn,
    Sale,
    Transfer,
    Edit,
    OfferReceived,
    OfferWithdrawn,
    OfferAccepted
}

// Event struct that stores all the required information for 
// events recorded for an NFT
struct Event {
    EventType eventType;
    address from;
    address to;
    uint256 price;
    uint256 timestamp;
}

contract NFTMarketEvents {

    // Store a record of all the Events for all the NFTs on the marketplace
    mapping(uint256 => mapping(uint256 => Event)) private eventHistory;

    // Return the Event object for a given event of a given NFT
    function _getEvent(uint256 tokenId, uint256 eventId) external view returns (Event memory) {
        return eventHistory[tokenId][eventId];
    }

    // Create and add an event to the given NFT's event history
    function _addEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 price, uint256 timestamp, uint256 eventType) external {
        if(eventType == 0) {
            _addMintEvent(tokenId, from, timestamp);
        }
        else if(eventType == 1) {
            _addListEvent(tokenId, eventId, from, to, price, timestamp);
        }
        else if(eventType == 2) {
            _addWithdrawEvent(tokenId, eventId, from, to, timestamp);
        }
        else if(eventType == 3) {
            _addSaleEvent(tokenId, eventId, from, to, price, timestamp);
        }
        else if(eventType == 4) {
            _addTransferEvent(tokenId, eventId, from, to, timestamp);
        }
        else if(eventType == 5) {
            _addEditEvent(tokenId, eventId, from, to, price, timestamp);
        }
        else if(eventType == 6) {
            _addOfferReceivedEvent(tokenId, eventId, from, to, price, timestamp);
        }
        else if(eventType == 7) {
            _addOfferWithdrawEvent(tokenId, eventId, from, to, price, timestamp);
        }
        else {
            _addOfferAcceptedEvent(tokenId, eventId, from, to, price, timestamp);
        }
    }

    // Add a Mint event to the given NFT's event history
    function _addMintEvent(uint256 tokenId, address from, uint256 timestamp) internal {
        eventHistory[tokenId][1] = Event(
            EventType.Minted,
            address(0),
            from,
            0,
            timestamp
        );
    }

    // Add a List event to the given NFT's event history
    function _addListEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 price, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.Listed,
            from,
            to,
            price,
            timestamp
        );
    }

    // Add an Edit event to the given NFT's event history
    function _addEditEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 price, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.Edit,
            from,
            to,
            price,
            timestamp
        );
    }

    // Add a Withdraw Listing event to the given NFT's event history
    function _addWithdrawEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.Withdrawn,
            from,
            to,
            0,
            timestamp
        );
    }

    // Add a Transfer event to the given NFT's event history
    function _addTransferEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.Transfer,
            from,
            to,
            0,
            timestamp
        );
    }

    // Add a Sale event to the given NFT's event history
    function _addSaleEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 price, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.Sale,
            from,
            to,
            price,
            timestamp
        );
    }

    // Add an Offer Received event to the given NFT's event history
    function _addOfferReceivedEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 price, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.OfferReceived,
            from,
            to,
            price,
            timestamp
        );
    }

    // Add an Offer Withdrawn event to the given NFT's event history
    function _addOfferWithdrawEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 price, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.OfferWithdrawn,
            from,
            to,
            price,
            timestamp
        );
    }

    // Add an Offer Accepted event to the given NFT's event history
    function _addOfferAcceptedEvent(uint256 tokenId, uint256 eventId, address from, address to, uint256 price, uint256 timestamp) internal {
        eventHistory[tokenId][eventId] = Event(
            EventType.OfferAccepted,
            from,
            to,
            price,
            timestamp
        );
    }
}