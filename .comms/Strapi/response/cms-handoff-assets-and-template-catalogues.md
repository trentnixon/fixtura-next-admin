# CMS handoff: assets and template catalogues

**Date:** 2026-09-28
**From:** CMS (Strapi) Backend
**To:** fixtura-admin
**Re:** Data model for a future Admin CRUD that creates and edits output assets and template catalogue rows. Today that work is done in the Strapi content manager.

This is a domain briefing. It is not an API contract for the new screens. Write endpoints for the template catalogues do not exist yet.

---

## Two catalogues

Staff currently maintain two separate sets of rows. A CRUD screen has to keep them separate.

**Output assets** are the things we render. A row is one composition (a video or an article format) for one sport. Accounts do not own these rows. A subscription package owns a list of them, and the scheduler copies the ones whose `Sport` matches the account.

**Template style** is how that render looks. Each account has one `template-option` row. That row does not store colours, files, or background settings itself. It stores `useBackground` (which background family is active) and the ids of shared catalogue rows. Those small rows are the template metadata.

Creating a new look means creating or editing a shared catalogue row, then pointing an account's template option at it. Creating a second template option for the same account is the wrong shape. Account creation already makes one, and the account relation is one-to-one.

There is also an old collection, `[tpl] Legacy Template-old` (`templates`). Accounts still have a `template` relation to it. New styling does not go there. Leave it out of this CRUD.

Brand colours are a third thing. They live on `[tpl] Brand Theme` (`themes`), in the `Theme` JSON (`primary`, `secondary`, `dark`, `white`). The member branding save writes that JSON. A template palette row is only a string token the renderer also receives. Do not build the colour editor on `template-palette`.

---

## Output assets

CMS label: `[ren] Output Asset`
Collection: `asset`
Table: `assets`
Draft and publish: yes

| Field | What it is |
| --- | --- |
| `Name` | Display name. Required by the existing create handler. |
| `CompositionID` | String the renderer uses as the composition id. Passed through as `compositionId`. |
| `Sport` | `Cricket`, `AFL`, `Hockey`, `Netball`, `Basketball`. The scheduler drops assets whose sport does not match the account. |
| `ContentType` | `Single` or `Collective`. |
| `Metadata` | Free JSON. The scheduler copies it onto the asset as `metadata`. There is no schema for the keys. |
| `description`, `assetDescription`, `SubTitle`, `Icon`, `Blurb`, `ArticleFormats`, `filter` | Copy and filter fields. `assetDescription` and `Blurb` are rich text. |
| `asset_category` | Many assets, one category. |
| `asset_type` | Many assets, one type. |
| `subscription_package` | Many assets, one package. This is how an asset becomes available to accounts on a plan. |
| `play_hq_end_point` | Optional data-source link. |
| `account_types` | Optional list of account types. |

An asset reaches a render only when all of these are true:

1. The row is published (`publishedAt` is set). The selection list returns published rows only.
2. It is linked to a subscription package.
3. That package is on the account's subscription tier.
4. `Sport` equals the account's sport.

`Metadata` and `CompositionID` are opaque to the CMS. Admin can edit them, but the CMS does not validate the JSON or check that the composition exists in the renderer.

### Small rows next to an asset

**`[ren] Asset Category`** (`asset-categories`). No draft/publish. Fields: `Name`, `Identifier`, `description`. The scheduler groups render requirements by category name and sends `Identifier`. Custom reads already exist: `GET /api/asset-categories/list` and `GET /api/asset-categories/:id`. There is no create/update route.

**`[ren] Asset Type`** (`asset-types`). Draft and publish is on. Field: `Name` only. Custom reads: `GET /api/asset-types/list` and `GET /api/asset-types/:id`. There is no create/update route.

**`[bil] Plan Package`** (`subscription-packages`) is billing, not a template. An asset CRUD can assign an existing package id. Do not invent packages from the asset screen.

### Asset routes that already exist

Custom CRUD already exists and is not authenticated (`auth: false` on every route):

- `POST /api/assets/create`
- `GET /api/assets/list`
- `GET /api/assets/list-for-selection`
- `GET /api/assets/:id`
- `PUT /api/assets/:id`
- `DELETE /api/assets/:id`

The create handler checks `Name`, the sport enum, the content-type enum, and that relation ids exist. It does not set `publishedAt`. A row created through it stays a draft until something publishes it, and draft rows are absent from `list-for-selection`.

Do not point a staff UI at these routes as they stand. They are public. A real Admin CRUD needs the same API token pattern as the other Admin CMS calls, and it needs to publish the row when staff expect it to be selectable.

---

## The account template option

CMS label: `[tpl] Style Option`
Collection: `template-option`
Table: `template_options`
Draft and publish: yes

One row per account, relation `account` one-to-one. The row has no name, no media, and no `Metadata` JSON. Its fields are `useBackground` plus relations:

| Relation on the option | Points at | Schema relation |
| --- | --- | --- |
| `template_category` | Template group | many-to-one |
| `template_mode` | Display mode | one-to-one |
| `template_palette` | Colour palette token | one-to-one |
| `template_gradient` | BG gradient | one-to-one |
| `template_image` | BG image preset | one-to-one |
| `template_video` | BG video settings | one-to-one |
| `template_texture` | BG texture | one-to-one |
| `template_animation` | BG animation preset | one-to-one |
| `template_luminance` | BG luminance plate | many-to-one |
| `template_noise` | BG noise | one-to-one |
| `template_particle` | BG particle | one-to-one |
| `template_pattern` | BG pattern | one-to-one |

Luminance is many-to-one so many accounts can share one plate. The older links are declared one-to-one on the option, with no inverse on the catalogue. In practice they are still a shared pick list. Every new account is given the same catalogue ids. Editing gradient id 3 changes the render for every account whose option still points at 3.

### How the row is created

`AccountCreator.createTemplate` runs when an account is created. Branding save uses the same helper if the account has no option yet (`buildDefaultTemplateOptionData`).

The default row is:

- `useBackground`: `Animated`
- `template_animation`: the one published, active, `isDefault` preset (looked up, not hardcoded)
- `template_palette`, `template_gradient`, `template_image`, `template_noise`, `template_particle`, `template_pattern`, `template_video`, `template_category`: hardcoded id `1`
- `template_mode`: id `1`, unless branding save passes another mode id
- `publishedAt`: set immediately
- `template_texture` and `template_luminance`: left empty

Those id `1` rows have to exist and stay published. Account creation does not look them up. Deleting or unpublishing palette, gradient, image, noise, particle, pattern, video, or category id `1` breaks new accounts. Animation is the exception: if the single default preset is missing, creation throws `PRODUCTION_ANIMATION_DEFAULT_MISSING` instead of writing a bad id.

Category id `1` should stay public. A private category is rejected when the member app saves, even if account creation already stored it.

### How the member app writes it

`PUT /api/template-option/put-template-options/:accountId`

This updates the account's existing option, or creates one if it is missing. It only stores ids of rows that already exist. It does not create catalogue rows.

Required on every save: `useBackground`, `templateCategoryId`, `templateModeId`.

Other ids are optional. Leave one out and the previous link stays. Send `null` and the link is cleared. Exception: while `useBackground` is `Luminance`, omitting `templateLuminanceId` keeps the current plate, and sending `null` is rejected. The plate must be published and its image URL must be absolute `http` or `https`.

Every id is checked against the published catalogue. Draft rows fail the save. A private template category fails with `CATEGORY_NOT_AVAILABLE`. An animation id is accepted only when that preset is published, `isActive`, and `operatorVisible`.

The template builder reads the pick lists and the current selection from:

`GET /api/template-categories/all-template-options?accountId=...&templateOptionId=...`

That response is published rows only. Private categories are filtered out of the category list.

---

## useBackground

Stored enum on the option:

`Solid`, `Gradient`, `Video`, `Image`, `Graphics`, `Texture`, `Particle`, `Animated`, `Luminance`

New writes from the member save accept only:

`Solid`, `Gradient`, `Video`, `Image`, `Texture`, `Animated`, `Luminance`

`Graphics` and `Particle` are still in the database enum, so old rows can still hold them. A new save that sends them is rejected. `Pattern`, `Noise`, and `Generated` are also rejected. Do not offer those as choices in Admin.

What the scheduler actually sends (`templateOptionDestruct`):

- `Animated`: the animation preset, plus empty gradient, image, noise, particle, pattern, texture, and video blocks.
- `Luminance`: the plate (`url`, and a fixed map of theme `brand`). The other background blocks are omitted.
- Anything else: gradient, image, noise, particle, pattern, texture, and video settings are all copied from the linked rows. `useBackground` tells the renderer which family is active. The other links stay stored, and they are still projected.

So a particle or pattern row can still affect a render when the active mode is `Solid` or `Gradient`. Those catalogues are live data. They are just not valid values of `useBackground` anymore.

The account photo for `Image` mode is not on the template option. The scheduler resolves it from the account media library, and only when `useBackground` is `Image`.

---

## Small template rows

All of these use draft and publish. Unpublished rows are invisible to the member save and to the aggregate pick list.

| CMS label | Collection / table | What one row is | Fields |
| --- | --- | --- | --- |
| `[tpl] Template Group` | `template-category` / `template_categories` | Layout family. Also carries how fixtures are split, and which audio bundle plays. | `Name`, `slug`, `divideFixturesBy` (JSON), `isPrivate` (default false), `bundle_audio` |
| `[tpl] Display Mode` | `template-mode` / `template_modes` | Light/dark style. Projected as `mode` (the slug, or `"light"` if the slug is empty) and `modeId`. | `Name`, `slug` |
| `[tpl] Color Palette` | `template-palette` / `template_palettes` | A token string. Projected as `palette`. This is not the brand colour JSON. | `name`, `value` |
| `[tpl] BG Gradient` | `template-gradient` / `template_gradients` | Gradient settings. No file. | `name`, `type`, `direction` |
| `[tpl] BG Video` | `template-video` / `template_videos` | Playback settings only. No file and no URL column. The scheduler currently sets `video.url` to null. | `name`, `position` (`center`, `left`, `right`, `top`, `bottom`), `size` (`cover`, `contain`), `loop` (default true), `muted` (default true), `offthread` (default true), `volume`, `rate`, `overlay` (JSON) |
| `[tpl] BG Image` | `template-image` / `template_images` | Motion and overlay preset for a photo. No file and no URL. The photo comes from the account media library. | `name`, `animationType` (`none`, `zoom`, `pan`, `kenburns`, `breathing`, `focusblur`), `animationDirection` (`up`, `down`, `left`, `right`, `in`, `out`, `pulse`), `overlayStyle` (`none`, `solid`, `gradient`, `vignette`, `duotone`, `pattern`, `colorFilter`), `gradientType` (`linear`, `radial`), `overlayOpacity` |
| `[tpl] BG Texture` | `template-texture` / `template_textures` | A reusable texture image plus how it blends. | `Name`, `category` (`Paper`, `Print`, `Turf`, `Infrastructure`, `Metal`, `Stadium`), `opacity`, `blendMode` (`multiply` only), `texture` (one image, media library) |
| `[tpl] BG Luminance` | `template-luminance` / `template_luminances` | One grayscale plate. Many accounts can select the same row. | `name` (required), `image` (required, one image). The projection fills `map.kind = theme`, `map.preset = brand`, `protection = none`, `supersampleScale = 1`. Those four are not columns. |
| `[tpl] BG Animation` | `template-animation` / `template_animations` | A production preset. See the animation rules below. | `presetId` (required, unique), `name` (required), `description`, `defaultConfiguration` (required JSON), `configurationSchema` (required JSON), `operatorVisible` (required, default false), `isActive` (required, default true), `isDefault` (required, default false), `sortOrder`, `catalogueVersion` (required) |
| `[tpl] BG Particle` | `template-particle` / `template_particles` | Particle settings. Still projected. Not a legal `useBackground` value. | `name`, `particleType` (`lines`, `dots`, `bubbles`, `snow`, `confetti`), `particleCount`, `speed`, `direction` (`up`, `down`, `left`, `right`, `random`), `animationType` (`scale`, `fade`, `slide`, `none`) |
| `[tpl] BG Pattern` | `template-pattern` / `template_patterns` | Pattern settings. Still projected. Not a legal `useBackground` value. | `name`, `patternType` (`Triangles`, `lines`, `grid`, `dots`, `Crosshatch`, `Chevron`), `animation` (`none`, `panDown`, `panUp`, `panRight`, `panLeft`, `rotate`, `pulse`), `scale`, `rotation`, `opacity`, `animationDuration`, `animationSpeed` |
| `[tpl] BG Noise` | `template-noise` / `template_noises` | Noise type. Still projected. Not a legal `useBackground` value. | `name`, `noiseType` (`default`, `subtle`, `grain`, `wave`, `fog`, `static`, `floatingParticles`, `dynamicParticles`, `triangleSwarm`, `pulsingCircles`, `digitalRain`, `gradientGrid`, `spokes`) |

Texture and luminance files already live in the Strapi media library (S3). The catalogue row stores a link to that file. Luminance plates were imported from an existing folder with `node scripts/import-luminance-plates.js --folder <id> --apply`. That script does not upload or copy files. A plate with no usable image URL cannot be saved onto an account.

Video and image-preset rows have nowhere to put a file. A CRUD form that uploads a video onto `template-video`, or a photo onto `template-image`, will not change what the renderer plays.

### Animation presets

These rows are also written by `node scripts/sync-template-animation-catalogue.js` (npm script `template-animation:sync`). The script upserts from the Creator discovery contract. Presets removed from the contract are marked inactive. It does not delete rows, and it does not rewrite existing template options.

Rules already enforced in the CMS:

- Only one row may have `isDefault: true`. A second default is rejected in the lifecycle.
- That default must be published, `isActive`, and `operatorVisible`, or new accounts cannot be created and catalogue health fails.
- The member save only accepts presets with `operatorVisible` and `isActive`.
- A later sync can overwrite `defaultConfiguration`, `configurationSchema`, `operatorVisible`, and `isDefault`.

If Admin gets a form for animation presets, a hand edit is not the source of truth. The discovery contract is. Either keep animation out of the first CRUD, or make the form call the same sync path.

---

## What the Admin CRUD should do

Build two areas.

**Output assets.** Create, edit, publish, and assign category, type, sport, composition id, metadata, and subscription package. Publish has to be an explicit step, because the current create route leaves a draft. Category and type need their own small create/edit screens if staff should not open Strapi for those two-field rows.

**Template catalogues.** Create and edit the shared rows in the table above, then publish them. Unpublished rows cannot be selected by the member app. Texture and luminance need a media-library picker, not a new upload bucket. Video and image presets are settings forms with no file field.

Changing an account's selected ids can stay on the existing member save, `PUT /api/template-option/put-template-options/:accountId`. That API already enforces ownership, published ids, private categories, luminance, and the allowed `useBackground` list. An Admin "edit this account's style" screen can call it. An Admin "add a new gradient" screen cannot. That second screen needs new CMS routes.

### Constraints to keep

- Do not create a template option per new background. Accounts already have one.
- Do not delete or unpublish catalogue id `1` on palette, gradient, image, noise, particle, pattern, video, or category unless `buildDefaultTemplateOptionData` is changed in the same release.
- Do not add a second `isDefault` animation preset.
- Do not offer `Graphics`, `Particle`, `Pattern`, `Noise`, or `Generated` as `useBackground`.
- Do not treat `template-image` as the background photo, or `template-video` as the video file.
- Do not store brand hex colours on `template-palette`. Those belong on `theme.Theme`.
- Do not build this on `[tpl] Legacy Template-old`.
- Editing a shared catalogue row changes every account that points at it, including accounts whose active `useBackground` is something else, because those links are still projected.
- A render that already has a snapshot keeps the old style until a new render is made. Saving a catalogue row does not repaint finished videos.
- Copy the Admin API token auth used by the other Admin CMS routes. Do not copy `auth: false` from the existing asset CRUD.

---

## Where this lives in the CMS

- Output asset schema: `src/api/asset/content-types/asset/schema.json`
- Asset create handler: `src/api/asset/controllers/admin/AssetCreateHandler.js`
- Asset routes: `src/api/asset/routes/custom-asset.js`
- Template option schema: `src/api/template-option/content-types/template-option/schema.json`
- Default row for new accounts: `src/api/template-animation/controllers/services/animationCatalogue/buildDefaultTemplateOptionData.js`
- Member save: `src/api/template-option/controllers/services/putTemplateOptions/`
- Pick lists: `src/api/template-category/controllers/services/getAllTemplateOptions/index.js`
- Scheduler projection: `src/api/account/controllers/workers/getAccountDetailsForScheduler/utils/templateOptionDestruct.js`
- Animation sync: `scripts/sync-template-animation-catalogue.js`
- Luminance import: `scripts/import-luminance-plates.js`
