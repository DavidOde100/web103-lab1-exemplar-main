import './dotenv.js'
import { pool } from './database.js'
import giftData from '../data/gifts.js'

async function createGiftsTable() {
	const createTableQuery = `
		DROP TABLE IF EXISTS gifts;

		CREATE TABLE IF NOT EXISTS gifts (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				pricePoint VARCHAR(10) NOT NULL,
				audience VARCHAR(255) NOT NULL,
				image VARCHAR(255) NOT NULL,
				description TEXT NOT NULL,
				submittedBy VARCHAR(255) NOT NULL,
				submittedOn TIMESTAMP NOT NULL
		);
	`

	try {
		const res = await pool.query(createTableQuery)
		console.log('🎉 gifts table created successfully')
	} catch (err) {
		console.error('⚠️ error creating gifts table', err)
		throw err
	}
}

async function reset() {
	try {
		await createGiftsTable()
		console.log('Created gifts table')

		const insertQuery = `
			INSERT INTO gifts (id, name, "pricePoint", audience, image, description, "submittedBy", "submittedOn")
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				"pricePoint" = EXCLUDED."pricePoint",
				audience = EXCLUDED.audience,
				image = EXCLUDED.image,
				description = EXCLUDED.description,
				"submittedBy" = EXCLUDED."submittedBy",
				"submittedOn" = EXCLUDED."submittedOn"
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
				g.submittedOn || null
			]
			await pool.query(insertQuery, values)
		}

		console.log('Reset complete')
	} catch (err) {
		console.error('Error resetting gifts table:', err)
		process.exitCode = 1
	} finally {
		await pool.end()
	}
}

const seedGiftsTable = async () => {
	await createGiftsTable()

	let completed = 0
	const total = giftData.length

	giftData.forEach((gift) => {
		const insertQuery = {
			text: 'INSERT INTO gifts (name, pricePoint, audience, image, description, submittedBy, submittedOn) VALUES ($1, $2, $3, $4, $5, $6, $7)'
		}

		const values = [
			gift.name,
			gift.pricePoint || gift.pricepoint || null,
			gift.audience,
			gift.image,
			gift.description,
			gift.submittedBy || gift.submitted_by || null,
			gift.submittedOn || null
		]

		pool.query(insertQuery, values, (err, res) => {
			if (err) {
				console.error('⚠️ error inserting gift', err)
				return
			}

			console.log(`✅ ${gift.name} added successfully`)

			completed += 1
			if (completed === total) {
				console.log('Seeding complete')
				pool.end()
			}
		})
	})
}

seedGiftsTable()

