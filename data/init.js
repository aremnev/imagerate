// reset database
db.dropDatabase()

// create indexes
db.users.ensureIndex({"openID": 1}, {"name": "openID"})

db.images.ensureIndex({"user": 1}, {"name": "user"})
db.images.ensureIndex({"created": 1}, {"name": "created"})
db.images.ensureIndex({"contest._id": 1}, {"name": "contest"})
