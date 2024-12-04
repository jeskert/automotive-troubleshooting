import * as React from 'react';
import { Flex, TextAreaField, Loader, Text, View, Button } from "@aws-amplify/ui-react"
import {useAIGeneration} from "@/components/tools/client";


export default function AIHelper() {
    const [{ data, isLoading }, generateAutomotiveDamageProcessing] =
        useAIGeneration("generateAutomotiveDamageProcessing");

    const handleClick = async () => {
        generateAutomotiveDamageProcessing();
    };

    return (
        <Flex direction="column">
            <Flex direction="row">
                <Button onClick={handleClick}>生成智能维修方案</Button>
            </Flex>
            {isLoading ? (
                <Loader variation="linear" />
            ) : (
                <>
                    <Text fontWeight="bold">{data?.name}</Text>
                    <View as="ul">
                        {data?.ingredients?.map((ingredient) => (
                            <View as="li" key={ingredient}>
                                {ingredient}
                            </View>
                        ))}
                    </View>
                    <Text>{data?.instructions}</Text>
                </>
            )}
        </Flex>
    );
}