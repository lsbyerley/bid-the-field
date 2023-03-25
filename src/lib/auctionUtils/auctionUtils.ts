import {
  differenceInSeconds,
  differenceInMinutes,
  isAfter,
  isBefore,
} from 'date-fns';
import isEmpty from 'just-is-empty';

import type {
  Auction,
  Bid,
  BidWithProfile,
  Player,
  PlayerWithHighBid,
} from '@/types';

const MIN_BID = 1;
const MAX_BID_AMOUNT = 100;
const MIN_TO_OUTBID = 2;

// Round a number to the decimal place passed in
// https://www.jacklmoore.com/notes/rounding-in-javascript/
export const round = (value: number, decimals: number) => {
  const newLocal = Number(value + 'e' + decimals);
  return Number(`${Math.round(newLocal)}e-${decimals}`);
};

export const submitBidFilter = (
  bid: string | number,
  highestBidAmount: number
) => {
  if (!bid || isNaN(Number(bid))) {
    throw new Error('Valid bid amount required.');
  }

  const numBid = Number(bid);

  // Round the bid amount to the nearest tenth decimal
  const bidToReturn = round(numBid, 2);
  const highBid = highestBidAmount ? Number(highestBidAmount) : null;

  if (bidToReturn < MIN_BID) {
    throw new Error(`Minimum bid of $${MIN_BID} required.`);
  }
  if (!highBid && bidToReturn > MAX_BID_AMOUNT) {
    throw new Error(`Max per bid is capped at $${MAX_BID_AMOUNT}.`);
  }
  if (highBid && bidToReturn <= highBid) {
    throw new Error(`Bid must be higher than $${highBid}.`);
  }
  if (highBid && bidToReturn - highBid < MIN_TO_OUTBID) {
    throw new Error(
      `Bid must be atleast $${MIN_TO_OUTBID} higher than $${highBid}.`
    );
  }

  return bidToReturn;
};

// Given an array of bids and a user id, returns the user's winning bids
export const getOwnerWinningBids = (bids: Bid[], ownerId: string) => {
  const ownerBidsSorted = bids
    .filter((b) => `${b.owner_id}` === `${ownerId}`)
    .sort((a, b) => b.amount - a.amount);

  const ownerBidsSortedUnique = ownerBidsSorted.reduce((filter, current) => {
    const bidOnPlayer = filter.find((bid) => {
      return `${bid.player_id}` === `${current.player_id}`;
    });
    if (!bidOnPlayer) {
      return filter.concat([current]);
    } else {
      return filter;
    }
  }, []);

  const winningBids = ownerBidsSortedUnique.reduce((winningBids, bid) => {
    const bidPlayerId = bid.player_id;
    const otherBidsOnPlayerSorted = bids
      .filter(
        (b) =>
          `${b.owner_id}` !== `${ownerId}` &&
          `${b.player_id}` === `${bidPlayerId}`
      )
      .sort((a, b) => b.amount - a.amount);
    const isOtherBids = !isEmpty(otherBidsOnPlayerSorted);

    if (!isOtherBids) {
      winningBids.push(bid);
      return winningBids;
    }

    if (isOtherBids) {
      const otherBid = otherBidsOnPlayerSorted[0]; // highest of other bids
      // check if amount is higher
      if (bid.amount > otherBid.amount) {
        winningBids.push(bid);
      }
      // if amounts are the same, give tie to bid placed first by date
      if (
        bid.amount === otherBid.amount &&
        isBefore(new Date(bid.created_at), new Date(otherBid.created_at))
      ) {
        winningBids.push(bid);
      }
    }

    return winningBids;
  }, []);

  return winningBids;
};

export const getAuctionResults = (bids: Bid[]) => {
  const owners = bids.reduce((owners, item: BidWithProfile) => {
    if (!owners[item.owner_id])
      owners[item.owner_id] = {
        profile: item.profile,
        winningBids: [],
      };
    return owners;
  }, {});

  Object.keys(owners).forEach((owner) => {
    const ownerWinnings = getOwnerWinningBids(bids, owner);
    owners[owner].winningBids = ownerWinnings;
  });

  return owners;
};

// Given an array of bids, returns the total amount of bids filtered by players
export const getTotalPot = (bids: Bid[]) => {
  let total = 0;

  // sort the bids
  const sortedBids = bids.sort((a, b) => b.amount - a.amount);

  // add bids to map by player id
  const bidsByPlayer = sortedBids.reduce((r, v) => {
    return (r[v.player_id] || (r[v.player_id] = [])).push(v), r;
  }, {});

  // first obj player id by key in array is highest bid
  Object.keys(bidsByPlayer).forEach((k) => {
    total += bidsByPlayer[k][0].amount;
  });

  return total;
};

// given an array of bids, returns the highest bid for the player id
export const getPlayerHighestBid = (auctionBids: Bid[], id: string) => {
  let highestBid = {};
  if (auctionBids && auctionBids.length) {
    highestBid = auctionBids
      .filter((b) => b.player_id === id)
      .reduce((highest, curr) => {
        // if highest isn't set yet
        if (isEmpty(highest)) {
          return curr;
        }

        // if amount is greater
        if (curr.amount > highest.amount) {
          return curr;
        }

        // If tie in amount, give to earlier bid date
        if (
          curr.amount === highest.amount &&
          isBefore(new Date(curr.created_at), new Date(highest.created_at))
        ) {
          return curr;
        }

        return highest;
      }, {} as Bid);
  }
  return highestBid;
};

// given an array of players and player id, returns the player name
export const getPlayerFromBid = (
  playersData: Player[],
  playerId: string
): Player => {
  const player = playersData.find((p) => `${p.id}` === `${playerId}`);
  return player;
};

export const hasAuctionStarted = (auction: Auction) => {
  return isBefore(new Date(auction?.start_date), new Date());
};

export const isAuctionOver = (auction: Auction) => {
  return isAfter(new Date(), new Date(auction?.end_date));
};

export const shouldDisableField = (auction: Auction) => {
  // Return true when auction has started and there are 30 minutes or less in the auction
  const auctionStarted = isBefore(new Date(auction?.start_date), new Date());
  const diff = differenceInMinutes(new Date(auction?.end_date), new Date());
  return auctionStarted && diff <= 29;
};

export const secondsLeftStart = (auction: Auction) => {
  const diff = differenceInSeconds(new Date(auction?.start_date), new Date());
  return diff > -1 ? diff : 0;
};

export const secondsLeftEnd = (auction: Auction) => {
  const diff = differenceInSeconds(new Date(auction?.end_date), new Date());
  return diff > -1 ? diff : 0;
};

export const minutesLeft = (auction: Auction) => {
  const diff = differenceInMinutes(new Date(auction?.end_date), new Date());
  return diff > -1 ? diff : 0;
};

// Given an array of players and bids, attaches the highest bid to the player object and sorts
export const sortPlayersByHighestBid = (players: Player[], bids: Bid[]) => {
  return players
    .map((p) => {
      const highestBid = getPlayerHighestBid(bids, p.id);
      return {
        ...p,
        highestBid,
      };
    })
    .sort((a: PlayerWithHighBid, b: PlayerWithHighBid) => {
      var ab = a.highestBid?.amount || 0;
      var bb = b.highestBid?.amount || 0;

      return bb - ab;
    });
};
