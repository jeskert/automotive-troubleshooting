'use client'

import "@/styles/app.css";
import {Amplify} from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import TicketDashboard from "@/pages/TicketDashboard";
import {Authenticator} from "@aws-amplify/ui-react";

Amplify.configure(outputs);

export default function App() {
    return (
        <Authenticator loginMechanisms={['username']} signUpAttributes={['preferred_username']}>
            <TicketDashboard/>;
        </Authenticator>
    )
}
