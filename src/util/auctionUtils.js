import { differenceInSeconds, differenceInMinutes, isAfter } from 'date-fns';

// Given an array of bids and a user id, returns the user's winning bids
export const getOwnerWinningBids = (bids, userId) => {
  const ownerBidsSorted = bids
    .filter((b) => b.owner === userId)
    .sort((a, b) => b.amount - a.amount);

  const ownerBidsSortedUnique = ownerBidsSorted.reduce((filter, current) => {
    const bidOnPlayer = filter.find(
      (bid) => bid.player_id === current.player_id
    );
    if (!bidOnPlayer) {
      return filter.concat([current]);
    } else {
      return filter;
    }
  }, []);

  let winningBids = [];

  ownerBidsSortedUnique.forEach((ob) => {
    const bidPlayerId = ob.player_id;
    const otherBidsOnPlayerSorted = bids
      .filter((b) => b.owner !== userId && b.player_id === bidPlayerId)
      .sort((a, b) => b.amount - a.amount);

    if (otherBidsOnPlayerSorted.length) {
      if (ob.amount > otherBidsOnPlayerSorted[0].amount) {
        winningBids.push(ob);
      }
    } else {
      winningBids.push(ob);
    }
  });

  return winningBids;
};

export const getAllOwnerBids = (bids, userId) => {
  return 'TBD';
};

// Given an array of bids, returns the total amount of bids filtered by players
export const getTotalPot = (bids) => {
  let total = 0;

  // sort the bids
  const sortedBids = bids.sort((a, b) => b.amount - a.amount);

  // add bids to map by player id
  const bidsByPlayer = sortedBids.reduce((r, v, i, a, k = v.length) => {
    return (r[v.player_id] || (r[v.player_id] = [])).push(v), r;
  }, {});

  // first obj player id by key in array is highest bid
  Object.keys(bidsByPlayer).forEach((k) => {
    total += bidsByPlayer[k][0].amount;
  });

  return total;
};

// given an array of bids, returns the highest bid for the player id
export const getPlayerHighestBid = (auctionBids, id) => {
  let highestBid = {};
  if (auctionBids && auctionBids.length) {
    const playerBids = auctionBids
      .filter((b) => b?.player_id === Number(id))
      .sort((a, b) => b?.amount - a?.amount);
    highestBid = playerBids[0] || {};
  }
  return highestBid;
};

// given an array of players and player id, returns the player name
export const getPlayerFromBid = (playersData, playerId) => {
  const player = playersData.find((p) => Number(p.id) === Number(playerId));
  return `${player?.first_name} ${player?.last_name}`;
};

export const isAuctionOver = (auction) => {
  return isAfter(new Date(), new Date(auction?.end_date));
};

export const secondsLeft = (auction) => {
  const diff = differenceInSeconds(new Date(auction?.end_date), new Date());
  return diff > -1 ? diff : 0;
};

export const minutesLeft = (auction) => {
  const diff = differenceInMinutes(new Date(auction?.end_date), new Date());
  return diff > -1 ? diff : 0;
};
