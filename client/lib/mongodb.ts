import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

interface MongooseConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const cached: MongooseConnection = {
  conn: null,
  promise: null,
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add connection timeouts to fail fast on network issues
      serverSelectionTimeoutMS: 5000, // 5s
      connectTimeoutMS: 5000, // 5s
      socketTimeoutMS: 45000 // 45s
    }

    console.log('[connectDB] Attempting mongoose.connect with timeout options', {
      serverSelectionTimeoutMS: opts.serverSelectionTimeoutMS,
      connectTimeoutMS: opts.connectTimeoutMS
    })

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[connectDB] Mongoose connected')
      return mongoose
    }).catch((err) => {
      console.error('[connectDB] Mongoose connect error:', err && err.message ? err.message : err)
      throw err
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB 