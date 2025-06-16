import readline from 'node:readline/promises'
import connectMongoose from './lib/connectMongoose.js'
import Product from './models/Products.js'
import User from './models/Users.js'

/**
 * CONECTION WITH MONGODB
 */
const connection = await connectMongoose()
console.log('Connected to MongoDB:', connection.name)

/**
 * initDB QUESTION
 */
const answer = await ask('Are you sure you want to delete database collection? (n)')
if (answer !== 'y') {
    console.log('Operation aborted')
    process.exit()
}

/**
 * INIT
 */
await initUsers()
await initProducts()
await connection.close()

/**
 * USERS
 */
async function initUsers() {
    const result = await User.deleteMany()
    console.log(`Deleted ${result.deletedCount} users.`)

    const insertResult = await User.insertMany([
        { email: 'paco@usuario.com', password: await User.hashPassword('1234') },
        { email: 'kike@usuario.com', password: await User.hashPassword('1234') },
    ])
    
    console.log(`Insert ${insertResult.length} users.`)
}

/**
 * PRODUCTS
 */
async function initProducts() {
	const result = await Product.deleteMany()
	console.log(`${result.deletedCount} products deleted`)

	const [paco, kike] = await Promise.all([
		User.findOne({email: 'paco@usuario.com'}),
		User.findOne({email: 'kike@usuario.com'})
	])

	const insertResult = await Product.insertMany([
		{
			name : "Air Jordan",
			owner: kike._id,
			price : 48,
			image : "Air_Jordam.jpg",
			tags : [ "Lifestyle" ]
		},
		{
			name : "Caja de herramientas",
			owner: paco._id,
			price : 47,
			image : "Caja_herramientas.jpg",
			tags : [ "Work" ]
		},
		{
			name : "Kawasaki Ninja",
			owner: kike._id,
			price : 13000,
			image : "Kawasaki_Ninja.png",
			tags : [ "Lifestyle", "Motor" ]
		},
		{
			name : "Vinilo Led Zeppelin 4",
			owner: paco._id,
			price : 29,
			image : "LedZeppelin4.jpg",
			tags : [ "Lifestyle" ]
		},
		{
			name : "Sudadera Nort Face",
			owner: kike._id,
			price : 42,
			image : "Nort_Face.jpg",
			tags : [ "Lifestyle" ]
		},
		{
			name : "Play Station 5",
			owner: kike._id,
			price : 600,
			image : "PS5.jpg",
			tags : [ "Lifestyle" ]
		},
		{
			name : "Sony Ericson Xperia",
			owner: paco._id,
			price : 20,
			image : "SE_Xperia.jpg",
			tags : [ "Mobile" ]
		},
		{
			name : "SEAT 500",
			owner: kike._id,
			price : 20,
			image : "SEAT_500.jpg",
			tags : [ "Motor" ]
		},
		{
			name : "Nintendo Switch",
			owner: paco._id,
			price : 20,
			image : "Switch.jpg",
			tags : [ "Lifestyle" ]
		},
		{
			name : "XBOX",
			owner: paco._id,
			price : 20,
			image : "XBOX.jpg",
			tags : [ "Lifestyle" ]
		}
	])
	console.log(`Insert ${insertResult.length} products.`)
}

/**
 * initDB 
 */
async function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const result = await rl.question(question)
    rl.close()
    return result
}