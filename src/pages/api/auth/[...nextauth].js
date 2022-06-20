import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { compare } from "bcrypt";

export default NextAuth({
  //Configure JWT
  session: {
    jwt: true,
  },
  //Specify Provider
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        //Connect to DB
        const client = await MongoClient.connect(
          `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.j5m9mrb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
          { useNewUrlParser: true, useUnifiedTopology: true }
        );
        //Get all the users
        const users = await client.db().collection("users");
        //Find user with the email
        const result = await users.findOne({
          email: credentials.email,
        });
        //Not found - send error res
        if (!result) {
          client.close();
          throw new Error("No user found with the email");
        }
        //Check hased password with DB password
        const checkPassword = await compare(
          credentials.password,
          result.password
        );
        //Incorrect password - send response
        if (!checkPassword) {
          client.close();
          throw new Error("Password doesnt match");
        }
        //Else send success response
        client.close();
        return { email: result.email, name: result.name };
      },
    }),
  ],
});
