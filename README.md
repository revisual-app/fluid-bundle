# fluid-bundle

This project is hosted with CloudFlare Worker.

This project uses vanilla JS and CSS, however SCSS was added for the ease of development.
The scope of the project is finite, it suppose to be a simple landing page with
a checkout page that navigates to Stripe.

The frontend is located in `public/` directory. The backend API endpoints are in `src/`. The entry point is `index.js`
which works as a simple router.

Because SCSS is compiled to CSS
on the build/deployment time, SCSS files are located in `src/styles` directory

## Development environment

Create .dev.vars copying from .dev.vars_example. Fill in missing credentials. Reach out to fellow developer for secrets.

### Starting local server

```bash
npm i
npm start
```

Follow guidelines from the `npm start` output.

## Deployment

Project is configured to auto-deploy on push to git repository.

### Staging/dev
When pushing to develop branch, it will auto deploy to: https://fluid-bundle.help-0f3.workers.dev/

### Production
When pushing to main branch, it will auto-deploy to https://fmbundle.com/.


