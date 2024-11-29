import {type ClientSchema, a, defineData} from "@aws-amplify/backend";

const schema = a.schema({
    Ticket: a
        .model({
            id: a.id(),
            userId: a.integer(),
            title: a.string(),
            content: a.string(),
            status: a.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
            resolverId: a.integer(),
            imagePaths: a.string().array(),
        }).authorization(allow => [allow.owner()]),
    });

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
    },
});
