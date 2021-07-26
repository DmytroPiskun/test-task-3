module.exports = {
  async up(db, client) {
    try {
      const collections = await db.listCollections({name: "users"}).toArray();
      if(collections.length>0)
      {
        throw new Error(`Collection "users" already exists `)
      }
      else 
      {
        await db.createCollection("userStatus")
      }
    } catch (error) {
      throw error
    }
  },

  async down(db, client) {
    try
    {
      await db.dropCollection("userStatus")
    }
    catch(error)
    {
      throw new Error(error)
    }
  }
};
