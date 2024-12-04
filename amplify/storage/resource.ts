import {defineStorage} from '@aws-amplify/backend';


export const storage = defineStorage({
    name: 'ticketPictures',
    access: (allow) => ({
        'ticket-pictures/*': [
            allow.authenticated.to(['read', 'write']),
            allow.guest.to(['read', 'write'])
        ],
        'knowledge-base-pictures/*': [
            allow.authenticated.to(['read', 'write']),
            allow.guest.to(['read', 'write'])
        ],
    }),
    isDefault: true,
});