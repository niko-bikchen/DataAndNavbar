// transformResponse expected input
const response = [
  {
    id: 1293487,
    name: "KCRW", // radio station callsign
    tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }],
  },
  {
    id: 12923,
    name: "KQED",
    tracks: [
      { timestp: "2021-04-09", trackName: "Savage" },
      { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
    ],
  },
  {
    id: 4,
    name: "WNYC",
    tracks: [
      { timestp: "2021-04-09", trackName: "Captain Hook" },
      { timestp: "2021-04-08", trackName: "Captain Hook" },
      { timestp: "2021-04-07", trackName: "Captain Hook" },
    ],
  },
];

// transformResponse expected output
const data = [
  {
    x: "2021-04-07",
    y: 1,
    tooltip: "Captain Hook (1)",
  },
  {
    x: "2021-04-08",
    y: 5,
    tooltip: "Peaches (1), Savage (3), Captain Hook (1)",
  },
  {
    x: "2021-04-09",
    y: 3,
    tooltip: "Savage (1), Savage (feat. Beyonce) (1), Captain Hook (1)",
  },
];

const compareTimestamps = (a, b) => {
  const timestampA = new Date(a.x);
  const timestampB = new Date(b.x);

  if (timestampA < timestampB) {
    return -1;
  }
  if (timestampA > timestampB) {
    return 1;
  }
  return 0;
};

// Construct a tooltip out of the object containing song names and the number of times each song was played.
const makeTooltip = (songsData) =>
  Object.entries(songsData)
    .map(([songName, songSpins]) => `${songName} (${songSpins})`)
    .join(", ");

// Updates an exisiting timestamp by increasing total spins and adding new song.
const updateExistingTimestamp = (result, track) => ({
  ...result,
  [track.timestp]: {
    total_spins: result[track.timestp].total_spins + 1, // Increase the total number of songs played.
    played_tracks: result[track.timestp].played_tracks.hasOwnProperty(
      track.trackName
    )
      ? {
          // If this song is aleady in the list.
          // Increase the number of times this song was played.
          ...result[track.timestp].played_tracks,
          [track.trackName]:
            result[track.timestp].played_tracks[track.trackName] + 1,
        }
      : {
          // If there is no such song in the list.
          // Add new song.
          ...result[track.timestp].played_tracks,
          [track.trackName]: 1,
        },
  },
});

// Adds a new object entry that, for a given timestamp,
// will contain the total number of songs played and a list of song names.
const addNewTimestamp = (result, track) => ({
  ...result,
  [track.timestp]: {
    total_spins: 1,
    played_tracks: {
      [track.trackName]: 1, // The total number of times this song was played.
    },
  },
});

/**
 * Transforms a response form the API into a format suitable for a charting library.
 * @param {Array.<{id: Number, name: String, tracks: Array.<{timestp: String, trackName: String}>}>} apiResponse a response from the API.
 * @returns {Array.<{x: String, y: Number, tooltip: String}>} response transformed into a format a charting library can use.
 */
const transformResponse = (apiResponse) => {
  const timestampStats = apiResponse
    .map((station) => station.tracks) // Extract tracks lists.
    .reduce((result, tracks) => [...result, ...tracks], []) // Turn array of arrays into an array.
    .reduce(
      // Transform array into an object with keys being timestamps.
      (result, track) =>
        result.hasOwnProperty(track.timestp)
          ? updateExistingTimestamp(result, track)
          : addNewTimestamp(result, track),
      {}
    );

  const result = Object.entries(timestampStats)
    // Convert into a format of an expected output.
    .map(([timestamp, stats]) => ({
      x: timestamp,
      y: stats.total_spins,
      tooltip: makeTooltip(stats.played_tracks),
    }))
    // Sort by timestamps.
    .sort(compareTimestamps);

  return result;
};

const result = transformResponse(response);

console.log(result);
