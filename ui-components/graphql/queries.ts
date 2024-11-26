/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTicket = /* GraphQL */ `
  query GetTicket($id: ID!) {
    getTicket(id: $id) {
      content
      createdAt
      id
      owner
      resolverId
      status
      title
      updatedAt
      userId
      __typename
    }
  }
`;
export const listTickets = /* GraphQL */ `
  query ListTickets(
    $filter: ModelTicketFilterInput
    $id: ID
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTickets(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        content
        createdAt
        id
        owner
        resolverId
        status
        title
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
