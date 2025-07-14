// utils/spotify.ts

export async function getTopTracks(accessToken: string): Promise<SpotifyApi.TrackObjectFull[]> {
  const limit = 50
  const totalDesired = 500
  const topTracks: SpotifyApi.TrackObjectFull[] = []

  for (let offset = 0; offset < totalDesired; offset += limit) {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}&time_range=long_term`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch top tracks: ${response.statusText}`)
    }

    const data: SpotifyApi.UsersTopTracksResponse = await response.json()

    if (!data.items || data.items.length === 0) break

    topTracks.push(...data.items)

    // If fewer than requested are returned, stop early
    if (data.items.length < limit) break
  }

  return topTracks
}
