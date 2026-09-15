# Database

LJ CareerConnect uses MongoDB, which is schemaless at the database level — there are no `.sql` migration files to keep here. The effective schema is enforced entirely in code via Mongoose models in [`backend/src/models/`](../backend/src/models/).

- Full collection-by-collection reference, field lists and relationships: [`../documentation/database-schema.md`](../documentation/database-schema.md)
- Demo data generator (creates every collection's documents with realistic, clearly-marked demo data): [`../backend/seed/seed.js`](../backend/seed/seed.js) (`npm run seed` from `backend/`)

## Connecting

Set `MONGO_URI` in `backend/.env` to either a local instance (`mongodb://127.0.0.1:27017/lj-careerconnect`) or a MongoDB Atlas connection string. See the root `README.md` → "MongoDB Setup" for details.
