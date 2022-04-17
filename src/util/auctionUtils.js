// Given an array of bids and a user, returns the user's winning bids
export const getOwnerWinningBids = (bids, sessionUserEmail) => {
  const ownerBidsSorted = bids
    .filter((b) => b.owner === sessionUserEmail)
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
      .filter(
        (b) => b.owner !== sessionUserEmail && b.player_id === bidPlayerId
      )
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
  const player = playersData.players.find(
    (p) => Number(p.id) === Number(playerId)
  );
  return `${player?.first_name} ${player?.last_name}`;
};

export const isAuctionOver = (auction) => {
  return new Date(auction?.end_date) < new Date();
};
