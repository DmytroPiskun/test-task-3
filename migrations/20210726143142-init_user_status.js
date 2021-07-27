
const initCollection = async (db) => {
  await db.createCollection('userstatuses')
  await db.collection('userstatuses').insertMany([{status: "Active"}, {status: "Blocked"}, {status: "Unverified"}])
}

module.exports = {
  async up(db, client) {
    try {
      const collections = await db.listCollections({name: "userStatus"}).toArray();
      if(collections.length>0)
      {
        throw new Error(`Collection "userStatus" already exists `)
      }
      else 
      {
        await initCollection(db)
      }
    } catch (error) {
      throw error
    }
  },

  async down(db, client) {
    try
    {
     const dropResult =  await db.dropCollection("userstatuses")
    }
    catch(error)
    {
      throw new Error(error)
    }
  }
};
