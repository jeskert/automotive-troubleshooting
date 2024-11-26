/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTicket = /* GraphQL */ `
  subscription OnCreateTicket(
    $filter: ModelSubscriptionTicketFilterInput
    $owner: String
  ) {
    onCreateTicket(filter: $filter, owner: $owner) {
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
export const onDeleteTicket = /* GraphQL */ `
  subscription OnDeleteTicket(
    $filter: ModelSubscriptionTicketFilterInput
    $owner: String
  ) {
    onDeleteTicket(filter: $filter, owner: $owner) {
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
export const onUpdateTicket = /* GraphQL */ `
  subscription OnUpdateTicket(
    $filter: ModelSubscriptionTicketFilterInput
    $owner: String
  ) {
    onUpdateTicket(filter: $filter, owner: $owner) {
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
