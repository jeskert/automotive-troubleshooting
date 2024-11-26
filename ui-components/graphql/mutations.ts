/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTicket = /* GraphQL */ `
  mutation CreateTicket(
    $condition: ModelTicketConditionInput
    $input: CreateTicketInput!
  ) {
    createTicket(condition: $condition, input: $input) {
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
export const deleteTicket = /* GraphQL */ `
  mutation DeleteTicket(
    $condition: ModelTicketConditionInput
    $input: DeleteTicketInput!
  ) {
    deleteTicket(condition: $condition, input: $input) {
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
export const updateTicket = /* GraphQL */ `
  mutation UpdateTicket(
    $condition: ModelTicketConditionInput
    $input: UpdateTicketInput!
  ) {
    updateTicket(condition: $condition, input: $input) {
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
