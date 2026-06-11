import '../config/dotenv.js'
import { pool } from '../config/database.js'
import giftData from '../data/gifts.js'

const createTableQuery = `
CREATE TABLE IF NOT EXISTS gifts (
  id INTEGER PRIMARY KEY,
  name TEXT,
  pricepoint TEXT,
  audience TEXT,
  image TEXT,
  description TEXT,
  submitted_by TEXT,
  submitted_on DATE
);
`

async function seed() {
  try {
    await pool.query(createTableQuery)
    console.log('Ensured gifts table exists')

    const insertQuery = `
      INSERT INTO gifts (id, name, pricepoint, audience, image, description, submitted_by, submitted_on)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        pricepoint = EXCLUDED.pricepoint,
        audience = EXCLUDED.audience,
        image = EXCLUDED.image,
        description = EXCLUDED.description,
        submitted_by = EXCLUDED.submitted_by,
        submitted_on = EXCLUDED.submitted_on
    `

    for (const g of giftData) {
      const values = [
        g.id,
        g.name,
        g.pricePoint || g.pricepoint || null,
        g.audience,
        g.image,
        g.description,
        g.submittedBy || g.submitted_by || null,
        g.submittedOn ? g.submittedOn.split('T')[0] : null
      ]
      await pool.query(insertQuery, values)
      console.log(`Upserted gift id=${g.id}`)
    }

    console.log('Seeding complete')
  } catch (err) {
    console.error('Error seeding gifts:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

seed()
