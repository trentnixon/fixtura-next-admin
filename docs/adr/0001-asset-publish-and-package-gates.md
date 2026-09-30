# Published and package are separate asset gates

An asset is included in a render only when it is published, linked to a subscription package on the account's tier, and the sport matches. Admin still lets staff publish a row that has no package. Published means `publishedAt` is set, so the row can appear in selection. Package is a second gate. The library shows the two states separately. Blocking publish until a package was set was rejected, because that would hide which gate had failed.
