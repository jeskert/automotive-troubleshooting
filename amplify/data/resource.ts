import {type ClientSchema, a, defineData} from "@aws-amplify/backend";

const schema = a.schema({
    Ticket: a
        .model({
            id: a.id(),
            userId: a.integer(),
            title: a.string(),
            content: a.string(),
            status: a.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED']),
            resolverId: a.integer(),
            imagePaths: a.string().array(),
        }).authorization(allow => [allow.owner()]),
    IngestionTask: a
        .model({
            id: a.id(),
            status: a.enum(['IN_PROGRESS', 'COMPLETED', 'ERROR']),
            imagePaths: a.string().array(),
        }).authorization(allow => [allow.owner()]),

    generateAutomotiveDamageProcessing: a.generation({
        aiModel: a.ai.model('Claude 3.5 Sonnet'),
        systemPrompt: 'You are a helpful assistant that help automotive after-sales technician with enriched automotive knowledge.',
    })
        .arguments({
            description: a.string(),
        })
        .returns(
            a.customType({
                name: a.string(),
                ingredients: a.string().array(),
                instructions: a.string(),
            })
        )
        .authorization((allow) => allow.authenticated()),
    });

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
    },
});
