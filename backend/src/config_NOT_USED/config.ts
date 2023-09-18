
export default () => ({
    // port: parseInt(process.env.PORT, 10) || 3000,
    client:{
        id: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        redirect_uri: process.env.REDIRECT_URI,
    },
    // database: {
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    // }
  });