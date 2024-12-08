import {Client} from "@opensearch-project/opensearch";
import {AwsSigv4Signer} from "@opensearch-project/opensearch/aws";
import {defaultProvider} from "@aws-sdk/credential-provider-node";
import type {NextApiRequest, NextApiResponse} from "next";

const openSearchClient = new Client({
    ...AwsSigv4Signer({
        region: 'us-east-1',
        service: 'aoss',

        getCredentials: () => {
            const credentialsProvider = defaultProvider();
            return credentialsProvider();
        },
    }),
    node: 'https://cxt16y00ttyts9fts3kd.us-east-1.aoss.amazonaws.com', // OpenSearch domain URL
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const {id} = req.body;

        try {
            await openSearchClient.delete({
                index: 'repair-cost-data',
                id: id
            });

            res.status(200).json({success: true});
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({message: error});
            } else {
                res.status(500).json({message: 'An unknown error occurred'});
            }
        }
    } else {
        res.status(405).json({message: 'Method Not Allowed'});
    }
}