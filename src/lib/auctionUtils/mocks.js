export const playersData = [
  { id: 1, name: 'test1' },
  { id: 2, name: 'test2' },
  { id: 3, name: 'test3' },
  { id: 5, name: 'nobidtest1' },
  { id: 6, name: 'nobidtest2' },
];

export const mockProfile = { name: '', email: '' };

// mockdate june 17, 2022 4pm
export const mockSystemDate = new Date('June 17, 2022 16:00:00');

// 2022-06-17 16:01:00+00

export const mockBidDates = {
  date1601: '2022-06-17 16:01:00+00',
  date1602: '2022-06-17 16:02:00+00',
  date1603: '2022-06-17 16:03:00+00',
};

// Owner1 Wins; owner2 bids once
const playerOneBids = [
  {
    amount: 17,
    created_at: mockBidDates.date1602,
    owner_id: '2',
    player_id: 1,
    profile: mockProfile,
  },
  {
    amount: 7,
    created_at: mockBidDates.date1601,
    owner_id: '1',
    player_id: 1,
    profile: mockProfile,
  },
  {
    amount: 27,
    created_at: mockBidDates.date1603,
    owner_id: '1',
    player_id: 1,
    profile: mockProfile,
  },
];

// Owner2 Wins; owner1 bids once
const playerTwoBids = [
  {
    amount: 7,
    created_at: mockBidDates.date1601,
    owner_id: '2',
    player_id: 2,
    profile: mockProfile,
  },
  {
    amount: 27,
    created_at: mockBidDates.date1603,
    owner_id: '2',
    player_id: 2,
    profile: mockProfile,
  },
  {
    amount: 17,
    created_at: mockBidDates.date1602,
    owner_id: '1',
    player_id: 2,
    profile: mockProfile,
  },
];

// Owner3 wins; owner2 bids same amount one second later (order matters)
const playerThreeBids = [
  {
    amount: 27,
    created_at: mockBidDates.date1603,
    owner_id: '2',
    player_id: 3,
    profile: mockProfile,
  },
  {
    amount: 27,
    created_at: mockBidDates.date1602,
    owner_id: '3',
    player_id: 3,
    profile: mockProfile,
  },
];

// Owner3 wins; no other bids placed
const playerFourBids = [
  {
    amount: 27,
    created_at: mockBidDates.date1602,
    owner_id: '3',
    player_id: 4,
    profile: mockProfile,
  },
];

export const mockBids = [
  ...playerOneBids,
  ...playerTwoBids,
  ...playerThreeBids,
  ...playerFourBids,
];
