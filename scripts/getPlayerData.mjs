import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// -----------------------------------------
// JSON structure { data: [playerObject] }
// Player Object Structure
// {
//  id
//  first_name
//  last_name
//  short_name ? mainly for The Field player obj
// }
// -----------------------------------------

// -----------------------------------------
// The Masters Player Pool
// found here: https://www.masters.com/en_US/scores/feeds/2022/players/players.json
// -----------------------------------------

const theFieldPlayer = {
  id: '999999',
  first_name: 'The',
  last_name: 'Field',
  full_name: 'The Field',
  short_name: 'The Field',
};

export const fetchMasters = async (url) => {
  try {
    const playerRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla' },
    }).then((res) => res.json());
    const players = playerRes.players.map((p) => {
      return {
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        full_name: `${p.first_name} ${p.last_name}`,
        short_name: `${p.first_name.substring(0, 1)}. ${p.last_name}`,
      };
    });
    // Add The Field player obj
    players.unshift(theFieldPlayer);
    return players;
  } catch (err) {
    console.log('LOG: err', err);
    return [];
  }
};

// -----------------------------------------
// US Open Player Pool
// found here: 'https://www.usopen.com/bin/usopen/players.json'
// or here: https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=026&YEAR=2022&format=json
// -----------------------------------------

export const fetchUsOpen = async (url) => {
  const playerRes = await fetch(url).then((res) => res.json());
  const players = playerRes.Tournament.Players.filter(
    (p) => p.isAlternate === 'No'
  ).map((p) => {
    return {
      id: p.TournamentPlayerId,
      first_name: p.PlayerFirstName,
      last_name: p.PlayerLastName,
      full_name: `${p.PlayerFirstName} ${p.PlayerLastName}`,
      short_name: `${p.PlayerFirstName.substring(0, 1)}. ${p.PlayerLastName}`,
    };
  });
  // Add The Field player obj
  players.unshift(theFieldPlayer);
  return players;
};

// -----------------------------------------
// Open Championship Player Pool
// found here: https://www.theopen.com/api/QualifiedPlayersListingApi/GetPlayersByPageAndFilters
// https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=100&YEAR=2022&format=json
// -----------------------------------------

export const fetchOpenChamp = async (url) => {
  const playerRes = await fetch(url).then((res) => res.json());
  /* const players = playerRes.items
    .filter((p) => p.isPlaying)
    .map((p) => {
      return {
        id: p.id,
        first_name: p.firstName,
        last_name: p.lastName,
        full_name: `${p.firstName} ${p.lastName}`,
        short_name: `${p.firstName.substring(0, 1)}. ${p.lastName}`,
      };
    }); */
  const players = playerRes.Tournament.Players.filter(
    (p) => p.isAlternate === 'No'
  ).map((p) => {
    return {
      id: p.TournamentPlayerId,
      first_name: p.PlayerFirstName,
      last_name: p.PlayerLastName,
      full_name: `${p.PlayerFirstName} ${p.PlayerLastName}`,
      short_name: `${p.PlayerFirstName.substring(0, 1)}. ${p.PlayerLastName}`,
    };
  });
  // Add The Field player obj
  players.unshift(theFieldPlayer);
  return players;
};

// -----------------------------------------
// The Players Championship Player Pool
// https://www.theplayers.com/field.html
// found here: https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=011&YEAR=2022&format=json
// -----------------------------------------

export const fetchPlayersChamp = async (url) => {
  const playerRes = await fetch(url).then((res) => res.json());
  const players = playerRes.Tournament.Players.filter(
    (p) => p.isAlternate === 'No'
  ).map((p) => {
    return {
      id: p.TournamentPlayerId,
      first_name: p.PlayerFirstName,
      last_name: p.PlayerLastName,
      full_name: `${p.PlayerFirstName} ${p.PlayerLastName}`,
      short_name: `${p.PlayerFirstName.substring(0, 1)}. ${p.PlayerLastName}`,
    };
  });
  // Add The Field player obj
  players.unshift(theFieldPlayer);
  return players;
};

// -----------------------------------------
// The PGA Championship Player Pool
// found here: https://www.pgatour.com/tournaments/pga-championship.html
// maybe here?: https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=033&YEAR=2022&format=json
// last year https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=033&YEAR=2021&format=json
// -----------------------------------------

export const fetchPgaChamp = async (url) => {
  const playerRes = await fetch(url).then((res) => res.json());
  const players = playerRes.Tournament.Players.filter(
    (p) => p.isAlternate === 'No'
  ).map((p) => {
    return {
      id: p.TournamentPlayerId,
      first_name: p.PlayerFirstName,
      last_name: p.PlayerLastName,
      full_name: `${p.PlayerFirstName} ${p.PlayerLastName}`,
      short_name: `${p.PlayerFirstName.substring(0, 1)}. ${p.PlayerLastName}`,
    };
  });
  // Add The Field player obj
  players.unshift(theFieldPlayer);
  return players;
};

// Wells Fargo Championship
// https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=480&YEAR=2022&format=json

const run = async () => {
  const players = await fetchOpenChamp(
    // 'https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=033&YEAR=2022&format=json'
    // 'https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=026&YEAR=2022&format=json'
    // 'https://www.theopen.com/api/QualifiedPlayersListingApi/GetPlayersByPageAndFilters'
    'https://statdata-api-prod.pgatour.com/api/clientfile/Field?T_CODE=r&T_NUM=100&YEAR=2022&format=json'
  );

  const returnObj = {
    data: players,
  };

  console.log(JSON.stringify(returnObj));
};
run();
