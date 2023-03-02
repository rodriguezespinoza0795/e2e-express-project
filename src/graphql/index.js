const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');
const { expressMiddleware  } = require('@apollo/server/express4');
const { loadFiles } = require('@graphql-tools/load-files');
const resolvers = require('./resolvers');
const { buildContext } = require('graphql-passport');
const { typeDefs: scalarsTypeDefs, resolvers: scalarsResolvers } = require('graphql-scalars');

const useGraphql = async (app) => {
  const typeDefs = [
    ...await loadFiles('./src/**/*.graphql'),
    scalarsTypeDefs,
  ];
  const allResolvers = [
    resolvers,
    scalarsResolvers,
  ];
  const server = new ApolloServer({
    typeDefs,
    resolvers: allResolvers,
    playground: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground
    ]
  });

  await server.start();

  app.use(expressMiddleware(server, {
    context: ({req, res}) => buildContext({req, res}),
  }));
  
}

module.exports = useGraphql;