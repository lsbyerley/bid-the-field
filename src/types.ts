import type { Database } from '../db_types';

export type Auction = Database['public']['Tables']['auctions']['Row'];
export type Bid = Database['public']['Tables']['bids']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  short_name: string;
}

export interface BasketballPlayer extends Player {
  seed: number;
}

export interface BidWithProfile extends Bid {
  profile: Profile;
}

export interface PlayerWithHighBid extends Player {
  highestBid: Bid;
}

export interface BidCardArgs {
  sport: string;
  player: PlayerWithHighBid;
  biddingDisabled: boolean;
  disableTheField: boolean;
  onSubmitBid: Function;
}

export interface BasketballBidCardArgs {
  isOpen: boolean;
  player: BasketballPlayer;
  highestBid: BidWithProfile;
  biddingDisabled: boolean;
  openBidModal: Function;
  submitTenPercentBid: Function;
  isPartOfField: boolean;
  disableTheFieldPlayer: boolean;
}

export interface GolfBidCardArgs {
  isOpen: boolean;
  player: Player;
  highestBid: BidWithProfile;
  biddingDisabled: boolean;
  openBidModal: Function;
  submitTenPercentBid: Function;
  isPartOfField: boolean;
  disableTheFieldPlayer: boolean;
}

export interface BidModalFormData {
  bidAmount: string | number;
}

export interface BidModalArgs {
  isOpen: boolean;
  setIsOpen: Function;
  onSubmit: Function;
  player: Player;
  highestBid: Bid;
}

export interface AsyncRefConfig {
  value: any;
  isProp: boolean;
}

export interface ResultsArgs {
  players: Player[] | BasketballPlayer[];
  bids: Bid[];
}