# ValeriusBridge — starter frontend

This is a static starter UI for the ValeriusBridge project.

## Included
- Mobile number + exactly 4-digit PIN sign-in form
- Calls the existing Supabase `pin-login` Edge Function
- Session restore and logout through `session-control`
- Mobile-responsive layout

## Important limitations
- Admin login is intentionally blocked by the current backend until Admin MFA is implemented.
- No account registration, package, order, proof, wallet, invoice or payout workflows are implemented yet.
- This is a development starter, not a production-ready application.
- The publishable Supabase key is intended for browser use. Never put a Supabase service-role/secret key in frontend files.
- The current Edge Functions use permissive CORS and need an allowlisted production origin, plus additional rate limiting, before production.
- Four-digit PINs have a small search space. Keep backend lockouts and stronger rate limits; do not treat the PIN alone as high-assurance authentication.

## Deploy
Upload the contents of this folder to the GitHub repository root, then connect the repository to a static host such as Cloudflare Pages. Use the root directory `/` and no build command; output directory `/`.

## Domain and passkeys
Do not enroll Admin passkeys until the final HTTPS domain is chosen.
