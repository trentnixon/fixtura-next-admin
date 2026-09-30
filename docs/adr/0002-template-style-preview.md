# Template style preview is a session look, not the member picker

Staff preview Template style on a cricket sample fixture, on its own page under Template Options. The screen writes nothing. The select is one option per sample file, not the member list of Image Options assets. The starting style is the new-account template option plus the ladder theme hex. The file supplies the fixture rows and its own duration.

## Consequences

- The ten CompositionIDs are `CricketLadder`, `CricketUpcoming`, `CricketTop5Batting`, `CricketTop5Bowling`, `CricketBattingPerformances`, `CricketBowlingPerformances`, `CricketResults`, `CricketRoster`, `CricketResultSingle`, and `CricketTeamOfTheWeek`. The ladder is the start. Switching files keeps the session style. Duration is that file's `FPS_INTRO` plus `FPS_MAIN`. There are no sponsors, so the outro is 0. Do not reuse 2385 for the other nine.
- Catalogue lists include drafts, private categories, and animation presets that are inactive or hidden. The member save gate does not apply. A row that cannot draw stays in the list.
- The file's pattern, noise, particle, and texture do not show while the style is `Animated`. Switching to Texture replaces the file's texture object. Leaving that object in place brings back the file's empty texture.
- Texture and luminance use the file stored on the chosen row. Image and video have nowhere to store a picture, so a pasted URL lives only in the session. All ten files have an empty `HeroImage.url`, so that pasted image URL is the picture. An empty image or video paste uses the scene's own fallback file. An empty texture URL has no picture. Luminance with no absolute `http` or `https` plate does not mount the player.
- Video drafts are read from the video collection. `videos` on the template-options payload is published-only.
