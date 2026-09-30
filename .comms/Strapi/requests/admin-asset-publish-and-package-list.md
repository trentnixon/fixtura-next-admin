# Request: asset publish on the existing writes, and a package list

**Date:** 2026-09-28
**From:** fixtura-admin
**To:** CMS (Strapi)
**Re:** Staff asset editor at `/dashboard/assets`

Admin is editing assets through the existing collection routes with the admin bearer token: `POST /assets`, `PUT /assets/:id`, `GET /assets`, `DELETE /assets/:id`. We will not call the public asset routes (`auth: false`), including `POST /api/assets/create`.

## 1. Publish and unpublish

Please confirm that this token can set `publishedAt` on `POST /assets` and can set or clear `publishedAt` on `PUT /assets/:id`.

Publish has to be an explicit staff action. Create must keep leaving the row unpublished. A cleared `publishedAt` is how staff unpublish.

If the generic write ignores `publishedAt`, we need a dedicated publish and unpublish action on the same admin token pattern as the other Admin CMS routes. Do not copy `auth: false` from the current asset CRUD.

## 2. Package list

Please confirm a read of existing subscription packages for this token: id and name is enough. The asset form assigns an existing package id. It does not create packages.

`GET /subscription-packages` is fine if the token can already call it. Otherwise a small list route with the same auth.

## 3. Template catalogue CRUD

Staff need add, review, update, and delete for the shared template-style rows. `api::template-noise.template-noise` is the example. The same operations are needed for the other small catalogues: template-category, template-mode, template-palette, template-gradient, template-video, template-image, template-texture, template-luminance, template-particle, and template-pattern.

Admin has no client for these. The member save only points an account at a row that already exists. It cannot create one.

Each catalogue needs, on the admin bearer token, the same pattern as the other Admin CMS routes:

- List, including drafts, so staff can review unpublished rows
- Get one
- Create, leaving the row unpublished
- Update the fields on that content type
- Delete
- Publish and unpublish, as an explicit `publishedAt` set or clear

For noise, the editable fields are `name` and `noiseType`. Noise is still projected onto a render. It is not a legal `useBackground` value.

Rules for every catalogue in this list:

- Do not copy `auth: false`.
- Do not delete or unpublish id `1` on palette, gradient, image, noise, particle, pattern, video, or category. New accounts are created with those ids.
- Unpublished rows stay invisible to the member save and to the aggregate pick list.
- Texture and luminance store a media-library file link, not a new upload bucket.
- Video and image presets have no file field.
- Palette `value` is a token string. Brand hex colours stay on `theme.Theme`.
- Do not offer this API for `template-animation`. That catalogue is written by the discovery sync.
- Do not offer this API for legacy `templates`.

## Out of this request

- Create and update for asset categories and asset types. Reads already exist.
- PlayHQ endpoint and account-type list endpoints.
- Changing which catalogue row an account points at. That stays on `PUT /api/template-option/put-template-options/:accountId`.
