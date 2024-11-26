import {useEffect, useState} from "react";
import {generateClient} from "aws-amplify/data";
import type {Schema} from "@/amplify/data/resource";
import {useAuthenticator} from "@aws-amplify/ui-react";
import {TicketCreateForm} from "@/ui-components";

const client = generateClient<Schema>();

export default function App() {
    const [tickets, setTickets] = useState<Array<Schema["Ticket"]["type"]>>([]);
    const [showCreateForm, setShowCreateForm] = useState(false); 
    const {user, signOut} = useAuthenticator();

    function deleteTicket(id: string) {
        client.models.Ticket.delete({id})
    }

    function listTickets() {
        client.models.Ticket.observeQuery().subscribe({
            next: (data) => setTickets([...data.items]),
        });
    }

    useEffect(() => {
        listTickets();
    }, []);


    return (
        <main>
            <button onClick={() => setShowCreateForm(true)}>Create Ticket</button>
            {showCreateForm && <TicketCreateForm />}            
            <ul>
                {tickets.map(ticket =>
                    <li
                        onClick={() => deleteTicket(ticket.id)}
                        key={ticket.id}>
                        {ticket.content}
                    </li>
                )}
            </ul>
            <button onClick={signOut}>Sign out</button>
        </main>
    )
}
