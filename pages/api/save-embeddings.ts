import {Client} from "@opensearch-project/opensearch";
import {AwsSigv4Signer} from "@opensearch-project/opensearch/aws";
import {defaultProvider} from "@aws-sdk/credential-provider-node";
import type {NextApiRequest, NextApiResponse} from "next";
import {BedrockRuntimeClient, InvokeModelCommand} from "@aws-sdk/client-bedrock-runtime";

const EMBEDDING_MODEL = "amazon.titan-embed-image-v1";
const bedrockClient = new BedrockRuntimeClient({
    region: 'us-east-1',
});
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
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    try {
        const {metadataString, metadata, image} = req.body;
        const metadataBase64 = Buffer.from(metadataString).toString('base64');
        const embeddings = await getEmbeddings(image, metadataBase64);
        const response = await saveEmbeddings(metadata, embeddings)
        res.status(200).json(response)
    } catch (error) {
        console.error('Error calling Embedding Model:', error);
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: 'An unknown error occurred'});
        }
    }
}

async function saveEmbeddings(metadata: any, damageVector: any) {
    try {
        return await openSearchClient.index({
            index: 'repair-cost-data',
            body: {
                damage_vector: damageVector,
                metadata: metadata
            }
        });
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function getEmbeddings(encodedImage: string, encodedJson: string) {
    const payload = {
        "inputText": encodedJson,
        "inputImage": encodedImage,
        "embeddingConfig": {
            "outputEmbeddingLength": 1024
        }
    }

    const command = new InvokeModelCommand(
        {
            modelId: EMBEDDING_MODEL,
            contentType: "application/json",
            body: JSON.stringify(payload),
        }
    )
    const apiResponse = await bedrockClient.send(command)
    const embedding = JSON.parse(new TextDecoder().decode(apiResponse.body));
    return embedding.embedding;
}