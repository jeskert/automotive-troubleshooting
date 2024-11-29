'use client'

import TicketList from '@/components/features/TicketList'
import MainLayout from '@/components/layout/MainLayout'
import StatusCards from '@/components/layout/StatusCards'

import {Amplify} from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function Home() {

    return (
        <MainLayout>
            <div className="space-y-8">
                <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
                <StatusCards />
                <TicketList />
            </div>
        </MainLayout>
    )
} 