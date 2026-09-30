# Request: Remotion player and template selector used in the member app

**Date:** 2026-09-29
**From:** fixtura-admin
**To:** App
**Re:** Staff preview of a template design, using the same player and default data as the member selector

Staff need to preview a design in Admin without waiting for a render. The member app already does this: a Remotion player plus the template selector, fed by the same default data.

Admin will copy that setup. We will not invent a second preview payload. Please point us at the files and the data you already use.

## What Admin already has

Admin can edit the shared catalogues and an account's style option. A style option stores `useBackground` and the catalogue ids. It does not store colours, files, or the preview payload.

Legal `useBackground` values for a new save are `Solid`, `Gradient`, `Video`, `Image`, `Texture`, `Animated`, and `Luminance`. `Graphics` and `Particle` can still sit on old rows. `Pattern`, `Noise`, and `Generated` are not legal choices.

Brand colours live on `theme.Theme` (`primary`, `secondary`, `dark`, `white`). A palette row is only a token.

## What we need

1. The Remotion packages and versions the selector uses, including `@remotion/player` if that is the embed.
2. The composition the selector plays. Composition id, the Root or register file, and the component that receives `inputProps`.
3. The selector component and the module that turns a selection into those `inputProps`. File paths are enough.
4. The default data object the player starts with when a user has not picked a real account render. Path, and a short note on which fields are sample fixture data versus template settings.
5. How a change in the selector updates the player. Which controls map to `useBackground`, category, mode, palette, theme colours, and the background catalogues (gradient, image, video, texture, animation, luminance, noise, particle, pattern).
6. The API the selector calls to load the pick lists and the current selection. We expect `GET /api/template-categories/all-template-options`. Say if the preview uses a different route, or if the app builds `inputProps` entirely on the client from that response.
7. Next.js or bundler config the player needs in another app. `transpilePackages`, webpack overrides, public files, fonts, and anything that breaks under Turbopack.
8. Whether the compositions live in the app repo or in a package Admin should depend on. If they live in the app, say which folders we should copy and which we should leave (auth, account media, billing).
9. What the preview cannot show without an account. Image mode uses the account photo. Luminance needs an absolute `http` or `https` plate URL. Call out anything else that stays blank on the default data.
10. One sample `inputProps` JSON for the default design, so we can mount the player before the selector is wired.

## Out of this request

- A new render pipeline or an MP4 from Admin.
- Changes to the member selector.
- A second template option per account. Account creation already makes one.
