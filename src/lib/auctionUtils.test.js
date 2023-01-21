import * as utils from './auctionUtils';

const playersData = [
  { id: 1, full_name: 'test1', short_name: 'test1' },
  { id: 2, full_name: 'test2', short_name: 'test2' },
  { id: 3, full_name: 'test3', short_name: 'test3' },
];

const bids = [
  {
    created_at: '2023-01-21T04:31:43.896264+00:00',
    player_id: 1,
    amount: 27,
    owner_id: 1,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-16T16:35:33.354703+00:00',
    player_id: 2,
    amount: 18,
    owner_id: 1,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-16T16:33:48.267114+00:00',
    player_id: 2,
    amount: 16.5,
    owner_id: 2,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-16T16:33:19.525347+00:00',
    player_id: 2,
    amount: 15,
    owner_id: 1,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-16T15:50:15.181179+00:00',
    player_id: 3,
    amount: 12.1,
    owner_id: 2,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-16T16:09:05.438501+00:00',
    player_id: 3,
    amount: 12.1,
    owner_id: 1,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-16T16:10:22.010158+00:00',
    player_id: 3,
    amount: 12.1,
    owner_id: 1,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-16T15:50:05.2652+00:00',
    player_id: 3,
    amount: 11,
    owner_id: 2,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-14T16:07:02.159597+00:00',
    player_id: 3,
    amount: 10,
    owner_id: 2,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-21T04:24:08.577761+00:00',
    player_id: 4,
    amount: 7,
    owner_id: 2,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-15T23:47:42.874877+00:00',
    player_id: 5,
    amount: 6,
    owner_id: 2,
    profile: { name: '', email: '' },
  },
  {
    created_at: '2023-01-15T16:36:44.63673+00:00',
    player_id: 6,
    amount: 5,
    owner_id: 2,
    profile: { name: '', email: '' },
  },
];

describe('auctionUtils -> getOwnerWinningBids', () => {
  it('should return winning bids of owner', () => {
    const ownerId = 1;
    expect(utils.getOwnerWinningBids(bids, ownerId)).toEqual([
      {
        amount: 27,
        owner_id: 1,
        player_id: 1,
        created_at: '2023-01-21T04:31:43.896264+00:00',
        profile: { name: '', email: '' },
      },
      {
        amount: 18,
        owner_id: 1,
        player_id: 2,
        created_at: '2023-01-16T16:35:33.354703+00:00',
        profile: { name: '', email: '' },
      },
    ]);
  });
});

describe('auctionUtils -> getAuctionResults', () => {
  it('should return bid results grouped by owner', () => {
    expect(utils.getAuctionResults(bids)).toEqual({
      1: {
        profile: { name: '', email: '' },
        winningBids: [
          { amount: 25, owner_id: 1, player_id: 3 },
          { amount: 15, owner_id: 1, player_id: 1 },
        ],
      },
      2: {
        profile: { name: '', email: '' },
        winningBids: [{ amount: 5, owner_id: 1, player_id: 2 }],
      },
    });
  });
});

describe('auctionUtils -> getTotalPot', () => {
  it('should return total pot of winning bids', () => {
    expect(utils.getTotalPot(bids)).toEqual(75.1);
  });
});

describe('auctionUtils -> getPlayerHighestBid', () => {
  it('should return the highest bid for a player', () => {
    const playerId = 1;
    expect(utils.getPlayerHighestBid(bids, playerId)).toEqual({
      player_id: 1,
      amount: 27,
      owner_id: 1,
      created_at: '2023-01-21T04:31:43.896264+00:00',
      profile: { name: '', email: '' },
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
