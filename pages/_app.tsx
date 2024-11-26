import "@/styles/app.css";
import type {AppProps} from "next/app";

import {Authenticator, ThemeProvider} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import {Amplify} from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function App({Component, pageProps}: AppProps) {
    return (
        <ThemeProvider>
            <Authenticator>
                <Component {...pageProps} />;
            </Authenticator>
        </ThemeProvider>

    )
}
