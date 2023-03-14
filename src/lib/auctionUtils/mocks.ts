import type { Player, PlayerWithHighBid, BidWithProfile } from '@/types';

export const defaultPlayerData = {
  first_name: '',
  last_name: '',
  short_name: '',
  full_name: '',
};

export const playersData = [
  { ...defaultPlayerData, id: '1', first_name: 'test1' },
  { ...defaultPlayerData, id: '2', first_name: 'test2' },
  { ...defaultPlayerData, id: '3', first_name: 'test3' },
  { ...defaultPlayerData, id: '5', first_name: 'nobidtest1' },
  { ...defaultPlayerData, id: '6', first_name: 'nobidtest2' },
] as Player[];

export const playersDataWithHighBid = [
  { ...defaultPlayerData, id: '1', first_name: 'test1' },
  { ...defaultPlayerData, id: '2', first_name: 'test2' },
  { ...defaultPlayerData, id: '3', first_name: 'test3' },
  { ...defaultPlayerData, id: '5', first_name: 'nobidtest1' },
  { ...defaultPlayerData, id: '6', first_name: 'nobidtest2' },
] as PlayerWithHighBid[];

export const mockAuction = {};

export const mockProfile = {
  created_at: '',
  email: '',
  id: '',
  name: '',
  phone: '',
  username: '',
};

// mockdate june 17, 2022 4pm
export const mockSystemDate = new Date('June 17, 2022 16:00:00');

// 2022-06-17 16:01:00+00

export const mockBidDates = {
  date1601: '2022-06-17 16:01:00+00',
  date1602: '2022-06-17 16:02:00+00',
  date1603: '2022-06-17 16:03:00+00',
};

export const bid_id = 1;
export const auction_id = 1;

// Owner1 Wins; owner2 bids once
const playerOneBids = [
  {
    id: bid_id,
    auction_id,
    amount: 17,
    created_at: mockBidDates.date1602,
    owner_id: '2',
    player_id: '1',
    profile: mockProfile,
  },
  {
    id: bid_id,
    auction_id,
    amount: 7,
    created_at: mockBidDates.date1601,
    owner_id: '1',
    player_id: '1',
    profile: mockProfile,
  },
  {
    id: bid_id,
    auction_id,
    amount: 27,
    created_at: mockBidDates.date1603,
    owner_id: '1',
    player_id: '1',
    profile: mockProfile,
  },
] as BidWithProfile[];

// Owner2 Wins; owner1 bids once
const playerTwoBids = [
  {
    amount: 7,
    created_at: mockBidDates.date1601,
    owner_id: '2',
    player_id: '2',
    profile: mockProfile,
  },
  {
    amount: 27,
    created_at: mockBidDates.date1603,
    owner_id: '2',
    player_id: '2',
    profile: mockProfile,
  },
  {
    amount: 17,
    created_at: mockBidDates.date1602,
    owner_id: '1',
    player_id: '2',
    profile: mockProfile,
  },
] as BidWithProfile[];

// Owner3 wins; owner2 bids same amount one second later (order matters)
const playerThreeBids = [
  {
    amount: 27,
    created_at: mockBidDates.date1603,
    owner_id: '2',
    player_id: '3',
    profile: mockProfile,
  },
  {
    amount: 27,
    created_at: mockBidDates.date1602,
    owner_id: '3',
    player_id: '3',
    profile: mockProfile,
  },
] as BidWithProfile[];

// Owner3 wins; no other bids placed
const playerFourBids = [
  {
    amount: 27,
    created_at: mockBidDates.date1602,
    owner_id: '3',
    player_id: '4',
    profile: mockProfile,
  },
] as BidWithProfile[];

export const mockBids = [
  ...playerOneBids,
  ...playerTwoBids,
  ...playerThreeBids,
  ...playerFourBids,
];
