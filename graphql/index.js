const User = require('../mongodb/models/user');
const Item = require('../mongodb/models/item');
const { makeGetUser, makeGetItem, makeGetItems } = require('../mongodb/utils');
const { makeExecutableSchema } = require('graphql-tools');

const getUser = makeGetUser(User);
const getItem = makeGetItem(Item);
const getItems = makeGetItems(Item);
// TypeDefs

const typeDefs = `
  type Query {
    user(email: String!): User
    item(id: String!): Item
    items(filter: String): [Item]
  }

  type User {
    name: String!
    email: String!
    createdAt: String!
    userGroup: String!
  }

  type Order {
    item: Item!
    quantity: Int!
  }

  type Item {
    id: String!
    name: String!
    price: Int!
    description: [String]!
    origin: String!
    material: String!
    color: String!
    categories: [String]!
    image: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    user: (_, args) => getUser(args.email),
    item: (_, args) => getItem(args.id),
    items: (_, args) => getItems(args.filter)
  },

  User: {
    name: obj => obj.username,
    createdAt: obj => obj.created_at,
    userGroup: obj => obj.user_group
  },

  Item: {
    id: obj => obj._id,
    image: obj => obj.image_url
  }
}

module.exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
