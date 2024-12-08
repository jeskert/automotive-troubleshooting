import type {NextApiRequest, NextApiResponse} from 'next';
import {BedrockRuntimeClient, InvokeModelCommand} from "@aws-sdk/client-bedrock-runtime";
import fs from 'fs';
import path from 'path';

const bedrockClient = new BedrockRuntimeClient({
    region: 'us-east-1',
});

const model = fs.readFileSync(path.join(process.cwd(), 'public', 'static', 'model.txt'), 'utf8');
const criteriaCost = fs.readFileSync(path.join(process.cwd(), 'public', 'static', 'criteria_cost.txt'), 'utf8');
const instructionModel1 = fs.readFileSync(path.join(process.cwd(), 'public', 'static', 'instruction_model_1.txt'), 'utf8');
// const instructionModel2 = fs.readFileSync(path.join(process.cwd(), 'public', 'static', 'instruction_model_2.txt'), 'utf8');
// const instructionModel3 = fs.readFileSync(path.join(process.cwd(), 'public', 'static', 'instruction_model_3.txt'), 'utf8');


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    try {
        const {image} = req.body;
        const metadataString = await createJsonMetadata(image, instructionModel1);
        const metadata = JSON.parse(metadataString);
        res.status(200).json(metadata);
    } catch (error) {
        console.error('Error calling Bedrock:', error);
        if (error instanceof Error) {
            res.status(500).json({message: error.message});
        } else {
            res.status(500).json({message: 'An unknown error occurred'});
        }
    }
}

async function createJsonMetadata(encodedImage: string, instruction: string) {
    const prompt = criteriaCost + model + instruction;
    const payload = {
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': 2000,
        'temperature': 1,
        'top_p': 1,
        'top_k': 250,
        'messages': [
            {
                'role': 'user',
                'content': [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": encodedImage
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    }
    const invokeBodyEncoded = JSON.stringify(payload);
    const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        contentType: "application/json",
        body: invokeBodyEncoded
    });
    const apiResponse = await bedrockClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body)
    const responseBody = JSON.parse(decodedResponseBody);
    return responseBody.content[0].text;
}


