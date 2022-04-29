// -----------------------------------------
// Player Object Structure
// {
//  id
//  first_name
//  last_name
// }
// -----------------------------------------

//TODO: add player obj formatting to each fetch below

// -----------------------------------------
// The Masters Player Pool
// found here: https://www.masters.com/en_US/scores/feeds/2022/players/players.json
// -----------------------------------------

export const fetchMasters = async (url) => {
  const playerRes = await fetch(url).then((res) => res.json());
  const players = playerRes.players.map((p) => {
    return { ...p };
  });
  console.log('LOG: playerRes', JSON.stringify(players));
};

// -----------------------------------------
// US Open Player Pool
// found here: 'https://www.usopen.com/bin/usopen/players.json'
// -----------------------------------------

export const fetchUsOpen = async (url) => {
  const playerRes = await fetch(url).then((res) => res.json());
  const players = playerRes.map((p) => {
    return { ...p };
  });
  console.log('LOG: playerRes', JSON.stringify(players));
};

// -----------------------------------------
// Open Championship Player Pool
// found here: https://www.theopen.com/api/QualifiedPlayersListingApi/GetPlayersByPageAndFilters
// -----------------------------------------

export const fetchOpenChamp = async (url) => {
  const playerRes = await fetch(url).then((res) => res.json());
  const players = playerRes.items
    .filter((p) => p.isPlaying)
    .map((p) => {
      return { ...p };
    });
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
    return { ...p };
  });
  return players;
};
