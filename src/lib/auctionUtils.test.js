import * as utils from './auctionUtils';

const playersData = [
  { id: 1, full_name: 'test1', short_name: 'test1' },
  { id: 2, full_name: 'test2', short_name: 'test2' },
  { id: 3, full_name: 'test3', short_name: 'test3' },
];

const bids = [
  { player_id: 1, amount: 15, owner: 'owner1' },
  { player_id: 1, amount: 11, owner: 'owner2' },
  { player_id: 2, amount: 5, owner: 'owner2' },
  { player_id: 3, amount: 25, owner: 'owner1' },
];

describe('auctionUtils -> getOwnerWinningBids', () => {
  it('should return winning bids of owner', () => {
    const ownerId = 'owner1';
    expect(utils.getOwnerWinningBids(bids, ownerId)).toEqual([
      { amount: 25, owner: 'owner1', player_id: 3 },
      { amount: 15, owner: 'owner1', player_id: 1 },
    ]);
  });
});

describe('auctionUtils -> getAuctionResults', () => {
  it('should return bid results grouped by owner', () => {
    expect(utils.getAuctionResults(bids)).toEqual({
      owner1: [
        { amount: 25, owner: 'owner1', player_id: 3 },
        { amount: 15, owner: 'owner1', player_id: 1 },
      ],
      owner2: [{ amount: 5, owner: 'owner2', player_id: 2 }],
    });
  });
});

describe('auctionUtils -> getTotalPot', () => {
  it('should return total pot of winning bids', () => {
    expect(utils.getTotalPot(bids)).toEqual(45);
  });
});

describe('auctionUtils -> getPlayerHighestBid', () => {
  it('should return the highest bid for a player', () => {
    const playerId = 1;
    expect(utils.getPlayerHighestBid(bids, playerId)).toEqual({
      player_id: 1,
      amount: 15,
      owner: 'owner1',
    });
  });
});

describe('auctionUtils -> getPlayerFromBid', () => {
  it('should return a player object from array of bids', () => {
    const playerId = 1;
    expect(utils.getPlayerFromBid(playersData, playerId)).toEqual({
      full_name: 'test1',
      id: 1,
      short_name: 'test1',
    });
  });
});

describe('auctionUtils -> isAuctionOver', () => {
  it('should return false when auction is not over', () => {
    const auction = {
      end_date: '2022-05-13T10:18:00-04:00',
    };
    expect(utils.isAuctionOver(auction)).toEqual(true);
  });
});
