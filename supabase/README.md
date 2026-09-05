# Supabase migrations

`migrations/202609050001_core_mvp.sql` is the first server-side boundary for FACS.

It creates the minimum persistent model for authenticated profiles, posts, up to five owned media assets, one private vote per member, numeric-age ranges, and aggregate-only results. It also creates a private `facs-media` Storage bucket: browsers may upload only to their own ID prefix, and only authorized viewers can read post media. It does **not** create payment flow, a media-validation worker, a moderation queue, or an administrator console.

## Applying safely

Use a project-owner session, after reviewing the migration in the Supabase SQL editor or with the Supabase CLI. Do not paste a service-role key into this repository or a browser environment.

Before applying in production, run the SQL in a non-production project and verify:

1. a new Auth user receives a profile;
2. a member cannot set their own role, read raw votes, or vote twice;
3. only a post author can view an `actual_age` value;
4. numeric votes outside the authored range fail;
5. `get_post_aggregate` exposes only aggregate data;
6. a user cannot list another user's pending Storage objects or retrieve a non-public asset by guessing its path.
