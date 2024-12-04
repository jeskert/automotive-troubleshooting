'use client'

import type {AppProps} from "next/app";
import {Authenticator} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import "@/styles/app.css";
import {Amplify} from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function App({Component, pageProps}: AppProps) {
    return (
        <Authenticator loginMechanisms={['username']} signUpAttributes={['preferred_username']}>
            <Component {...pageProps} />;
        </Authenticator>
    )
}