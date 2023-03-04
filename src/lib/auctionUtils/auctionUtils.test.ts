import * as utils from './auctionUtils';
import {
  playersData,
  playersDataWithHighBid,
  mockProfile,
  mockBids,
  mockSystemDate,
  mockBidDates,
} from './mocks';
import clone from 'just-clone';

const auctionDefault = {
  created_at: '',
  data_filename: '',
  description: '',
  id: 1,
  name: '',
  payouts: '',
  rules: '',
  sport: '',
};

describe('auctionUtils', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern' as any);
    jest.setSystemTime(mockSystemDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('round', () => {
    it('should return 27.49 when passed 27.488', () => {
      expect(utils.round(27.488, 2)).toEqual(27.49);
    });
  });

  describe('getOwnerWinningBids', () => {
    it('should return winning bids of owner 1', () => {
      const ownerId = '1';
      expect(utils.getOwnerWinningBids(mockBids, ownerId)).toEqual([
        {
          amount: 27,
          auction_id: 1,
          id: 1,
          owner_id: '1',
          player_id: '1',
          created_at: mockBidDates.date1603,
          profile: mockProfile,
        },
      ]);
    });
    it('should return winning bids of owner 2', () => {
      const ownerId = '2';
      expect(utils.getOwnerWinningBids(mockBids, ownerId)).toEqual([
        {
          amount: 27,
          created_at: mockBidDates.date1603,
          owner_id: '2',
          player_id: '2',
          profile: mockProfile,
        },
      ]);
    });
    it('should return winning bids of owner 3', () => {
      const ownerId = '3';
      expect(utils.getOwnerWinningBids(mockBids, ownerId)).toEqual([
        {
          amount: 27,
          created_at: mockBidDates.date1602,
          owner_id: '3',
          player_id: '3',
          profile: mockProfile,
        },
        {
          amount: 27,
          created_at: mockBidDates.date1602,
          owner_id: '3',
          player_id: '4',
          profile: mockProfile,
        },
      ]);
    });
  });

  describe('getAuctionResults', () => {
    it('should return bid results grouped by owner', () => {
      expect(utils.getAuctionResults(mockBids)).toEqual({
        1: {
          profile: mockProfile,
          winningBids: [
            {
              amount: 27,
              auction_id: 1,
              id: 1,
              created_at: mockBidDates.date1603,
              owner_id: '1',
              player_id: '1',
              profile: mockProfile,
            },
          ],
        },
        2: {
          profile: mockProfile,
          winningBids: [
            {
              amount: 27,
              created_at: mockBidDates.date1603,
              owner_id: '2',
              player_id: '2',
              profile: mockProfile,
            },
          ],
        },
        3: {
          profile: mockProfile,
          winningBids: [
            {
              amount: 27,
              created_at: mockBidDates.date1602,
              owner_id: '3',
              player_id: '3',
              profile: mockProfile,
            },
            {
              amount: 27,
              created_at: mockBidDates.date1602,
              owner_id: '3',
              player_id: '4',
              profile: mockProfile,
            },
          ],
        },
      });
    });
  });

  describe('getTotalPot', () => {
    it('should return total pot of winning bids', () => {
      expect(utils.getTotalPot(clone(mockBids))).toEqual(108);
    });
  });

  describe('getPlayerHighestBid', () => {
    it('should return the highest bid for player 2', () => {
      const playerId = '2';
      expect(utils.getPlayerHighestBid(mockBids, playerId)).toEqual({
        amount: 27,
        created_at: mockBidDates.date1603,
        owner_id: '2',
        player_id: '2',
        profile: mockProfile,
      });
    });
    it('should return the highest bid for player 3', () => {
      const playerId = '3';
      expect(utils.getPlayerHighestBid(mockBids, playerId)).toEqual({
        amount: 27,
        created_at: mockBidDates.date1602,
        owner_id: '3',
        player_id: '3',
        profile: mockProfile,
      });
    });
  });

  describe('getPlayerFromBid', () => {
    it('should return a player object from array of bids', () => {
      const playerId = '1';
      expect(utils.getPlayerFromBid(playersData, playerId)).toEqual({
        name: 'test1',
        id: '1',
      });
    });
    it('should return a player 1 object from array of bids if id is a string', () => {
      const playerId = '1';
      expect(utils.getPlayerFromBid(playersData, playerId)).toEqual({
        name: 'test1',
        id: '1',
      });
    });
    it('should return empty object if player not found', () => {
      const playerId = '99';
      expect(utils.getPlayerFromBid(playersData, playerId)).toEqual({});
    });
  });

  describe('shouldDisableField', () => {
    it('should return true when there are 30 minutes or less in the auction', () => {
      const auction = {
        ...auctionDefault,
        start_date: '2022-06-17T15:00:00',
        end_date: '2022-06-17T16:28:00',
      };
      expect(utils.shouldDisableField(auction)).toEqual(true);
    });
    it('should return false when there are 30 minutes or more in the auction', () => {
      const auction = {
        ...auctionDefault,
        start_date: '2022-06-17T15:00:00',
        end_date: '2022-06-17T16:31:00',
      };
      expect(utils.shouldDisableField(auction)).toEqual(false);
    });
  });

  describe('isAuctionOver', () => {
    it('should return false when auction is not over', () => {
      const auction = {
        ...auctionDefault,
        start_date: null,
        end_date: '2022-06-17T15:00:00',
      };
      expect(utils.isAuctionOver(auction)).toEqual(true);
    });

    it('should return true when auction is over', () => {
      const auction = {
        ...auctionDefault,
        start_date: null,
        end_date: '2022-06-17T16:00:00',
      };
      expect(utils.isAuctionOver(auction)).toEqual(false);
    });
  });

  describe('hasAuctionStarted', () => {
    it('should return true if auction has started', () => {
      const auction = {
        ...auctionDefault,
        start_date: '2022-06-17T15:00:00',
        end_date: null,
      };
      expect(utils.hasAuctionStarted(auction)).toEqual(true);
    });
    it('should return false if auction has not started', () => {
      const auction = {
        ...auctionDefault,
        start_date: '2022-06-17T17:00:00',
        end_date: null,
      };
      expect(utils.hasAuctionStarted(auction)).toEqual(false);
    });
  });

  describe('secondsLeftStart', () => {
    it('should return 30 seconds left before auction starts', () => {
      const auction = {
        ...auctionDefault,
        start_date: '2022-06-17T16:00:30',
        end_date: null,
      };
      expect(utils.secondsLeftStart(auction)).toEqual(30);
    });
    it('should return 0 seconds left before auction starts', () => {
      const auction = {
        ...auctionDefault,
        start_date: '2022-06-17T15:59:58',
        end_date: null,
      };
      expect(utils.secondsLeftStart(auction)).toEqual(0);
    });
  });

  describe('secondsLeftEnd', () => {
    it('should return 5 seconds left in the auction', () => {
      const auction = {
        ...auctionDefault,
        start_date: null,
        end_date: '2022-06-17T16:00:05',
      };
      expect(utils.secondsLeftEnd(auction)).toEqual(5);
    });
    it('should return 0 seconds left in the auction', () => {
      const auction = {
        ...auctionDefault,
        start_date: null,
        end_date: '2022-06-17T15:59:58',
      };
      expect(utils.secondsLeftEnd(auction)).toEqual(0);
    });
  });

  describe('minutesLeft', () => {
    it('should return 27 minutes left in the auction', () => {
      const auction = {
        ...auctionDefault,
        start_date: null,
        end_date: '2022-06-17T16:27:00',
      };
      expect(utils.minutesLeft(auction)).toEqual(27);
    });
    it('should return 0 minutes left in the auction', () => {
      const auction = {
        ...auctionDefault,
        start_date: null,
        end_date: '2022-06-17T15:58:00',
      };
      expect(utils.minutesLeft(auction)).toEqual(0);
    });
  });

  describe('sortPlayersByHighestBid', () => {
    it('should return players sorted by the highest bid', () => {
      expect(
        utils.sortPlayersByHighestBid(playersDataWithHighBid, clone(mockBids))
      ).toEqual([
        {
          id: '1',
          name: 'test1',
          highestBid: {
            amount: 27,
            auction_id: 1,
            id: 1,
            created_at: mockBidDates.date1603,
            owner_id: '1',
            player_id: '1',
            profile: mockProfile,
          },
        },
        {
          id: '2',
          name: 'test2',
          highestBid: {
            amount: 27,
            created_at: mockBidDates.date1603,
            owner_id: '2',
            player_id: '2',
            profile: mockProfile,
          },
        },
        {
          id: '3',
          name: 'test3',
          highestBid: {
            amount: 27,
            created_at: mockBidDates.date1602,
            owner_id: '3',
            player_id: '3',
            profile: mockProfile,
          },
        },
        {
          id: '5',
          name: 'nobidtest1',
          highestBid: {},
        },
        {
          id: '6',
          name: 'nobidtest2',
          highestBid: {},
        },
      ]);
    });
  });
});
