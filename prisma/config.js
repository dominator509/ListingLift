const { defineConfig } = require('prisma/config')
module.exports = defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://root@127.0.0.1:5432/listinglift_dev?schema=public"
    }
  }
})
